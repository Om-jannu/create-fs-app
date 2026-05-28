/**
 * Remote Registry Fetcher
 *
 * Downloads the template registry from the templates GitHub repo and caches
 * it locally for 1 hour.  Falls back through a layered strategy:
 *
 *   1. Fresh cache (< 1 h old)        → return immediately, no network call
 *   2. Network fetch succeeds          → write fresh cache, return
 *   3. Network fails, stale cache exists → return stale cache (any age)
 *   4. No cache at all                 → return null → hardcoded fallback
 *
 * Why layered fallback?
 *   Users who have run the CLI at least once keep the best known template list
 *   available even when fully offline or on a slow / firewalled connection.
 *   The hardcoded registry is only the last resort for first-time offline runs.
 *
 * Cache location: ~/.cache/create-fs-app/registry.json
 * Cache TTL:      1 hour (for freshness check; stale entries are still served)
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { TemplateMetadata, TemplateSupports } from './template-registry.js';

// ── Constants ──────────────────────────────────────────────────────────────

const REGISTRY_RAW_URL =
  'https://raw.githubusercontent.com/Om-jannu/create-fs-app-templates/master/registry.json';

const CACHE_DIR  = path.join(os.homedir(), '.cache', 'create-fs-app');
const CACHE_FILE = path.join(CACHE_DIR, 'registry.json');
const CACHE_TTL  = 60 * 60 * 1000; // 1 hour in ms
const FETCH_TIMEOUT = 5_000;        // 5 s — don't block startup

// ── Remote registry shape (what lives in registry.json on GitHub) ──────────

interface RemoteTemplateEntry {
  description: string;
  features: string[];
  supports: TemplateSupports;
  /** Optional override — defaults to `templates/${key}` */
  subfolder?: string;
}

interface RemoteRegistry {
  version: number;
  repoUrl: string;
  branch: string;
  templates: Record<string, RemoteTemplateEntry>;
}

// ── Cache helpers ──────────────────────────────────────────────────────────

interface RegistryCache {
  fetchedAt: number;
  templates: Record<string, TemplateMetadata>;
}

/**
 * Read the local cache file.
 * @param requireFresh  When true (default), returns null for expired entries.
 *                      When false, returns the cached templates regardless of age
 *                      — used as the stale-on-failure offline fallback.
 */
async function readCache(requireFresh = true): Promise<Record<string, TemplateMetadata> | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    const cache: RegistryCache = JSON.parse(raw);
    if (!requireFresh || Date.now() - cache.fetchedAt < CACHE_TTL) {
      return cache.templates;
    }
    return null; // expired and caller wants a fresh entry
  } catch {
    return null;
  }
}

async function writeCache(templates: Record<string, TemplateMetadata>): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const cache: RegistryCache = { fetchedAt: Date.now(), templates };
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch {
    // non-fatal — next run will just re-fetch
  }
}

// ── Network fetch ──────────────────────────────────────────────────────────

async function fetchFromGitHub(): Promise<Record<string, TemplateMetadata> | null> {
  try {
    const res = await fetch(REGISTRY_RAW_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: { 'User-Agent': 'create-fs-app-cli' },
    });
    if (!res.ok) return null;

    const remote: RemoteRegistry = await res.json() as RemoteRegistry;
    if (!remote?.templates || typeof remote.templates !== 'object') return null;

    // Expand each slim registry entry into a full TemplateMetadata
    const templates: Record<string, TemplateMetadata> = {};
    for (const [key, entry] of Object.entries(remote.templates)) {
      templates[key] = {
        url:       remote.repoUrl,
        branch:    remote.branch,
        subfolder: entry.subfolder ?? `templates/${key}`,
        description: entry.description,
        features:    entry.features,
        supports:    entry.supports,
      };
    }
    return templates;
  } catch {
    return null; // network error, timeout, JSON parse error — all non-fatal
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns the latest template registry using a layered strategy:
 *   1. Fresh cache (< 1 h)     → return immediately
 *   2. Network fetch succeeds  → write cache, return
 *   3. Network fails + stale cache exists → return stale (offline resilience)
 *   4. Nothing available       → return null → caller uses hardcoded fallback
 */
export async function getRemoteRegistry(): Promise<Record<string, TemplateMetadata> | null> {
  // 1. Fresh cache hit — no network needed
  const fresh = await readCache(true);
  if (fresh) return fresh;

  // 2. Try to refresh from GitHub
  const fetched = await fetchFromGitHub();
  if (fetched) {
    await writeCache(fetched);
    return fetched;
  }

  // 3. Network unavailable — serve stale cache so offline users aren't downgraded
  //    to the hardcoded floor registry.
  const stale = await readCache(false);
  if (stale) return stale;

  // 4. No cache at all — caller falls back to the hardcoded TEMPLATE_REGISTRY.
  return null;
}

/**
 * Clears the local registry cache so the next run re-fetches from GitHub.
 * Called by `create-fs-app cache clear`.
 */
export async function clearRegistryCache(): Promise<void> {
  try {
    await fs.unlink(CACHE_FILE);
  } catch {
    // file may not exist — fine
  }
}
