/**
 * Remote Registry Fetcher
 *
 * Downloads the template registry (v2) from the templates GitHub repo and
 * caches it locally for 1 hour.  Falls back through a layered strategy:
 *
 *   1. Fresh cache (< 1 h)          → return immediately
 *   2. Network fetch succeeds        → write fresh cache, return
 *   3. Network fails + stale cache   → return stale (offline resilience)
 *   4. Nothing available             → return null → hardcoded fallback
 *
 * registry.json v2 shape:
 *   { version: 2, repoUrl, branch, official: {}, contributed: {} }
 *
 * Cache: ~/.cache/create-fs-app/registry.json
 * TTL:   1 hour
 */

import fs   from 'fs/promises';
import path from 'path';
import os   from 'os';
import {
  TemplateMetadata,
  TemplateSupports,
  ContributorMetadata,
  RemoteRegistryPayload,
} from './template-registry.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const REGISTRY_RAW_URL =
  'https://raw.githubusercontent.com/Om-jannu/create-fs-app-templates/master/registry.json';

const CACHE_DIR   = path.join(os.homedir(), '.create-fs-app');
const CACHE_FILE  = path.join(CACHE_DIR, 'registry.json');
const CACHE_TTL   = 60 * 60 * 1000; // 1 hour
const FETCH_TIMEOUT = 5_000;

// ── Remote registry shape (v2 only) ──────────────────────────────────────────

interface RemoteBaseEntry {
  id?: string;
  description: string;
  features: string[];
  supports: TemplateSupports;
  subfolder?: string;
}

interface RemoteContributedEntry extends RemoteBaseEntry {
  contributor: ContributorMetadata;
}

interface RemoteRegistry {
  version: number;
  repoUrl: string;
  branch:  string;
  official:     Record<string, RemoteBaseEntry>;
  contributed?: Record<string, RemoteContributedEntry>;
}

// ── Cache helpers ─────────────────────────────────────────────────────────────

interface RegistryCache {
  version:     2;
  fetchedAt:   number;
  official:    Record<string, TemplateMetadata>;
  contributed: Record<string, TemplateMetadata>;
}

function buildMetadata(
  entry: RemoteBaseEntry,
  repoUrl: string,
  branch: string,
  contributor?: ContributorMetadata,
): TemplateMetadata {
  return {
    id:          entry.id,
    contributor,
    url:         repoUrl,
    branch,
    subfolder:   entry.subfolder,
    description: entry.description,
    features:    entry.features,
    supports:    entry.supports,
  };
}

async function readCache(requireFresh = true): Promise<RemoteRegistryPayload | null> {
  try {
    const raw   = await fs.readFile(CACHE_FILE, 'utf-8');
    const cache = JSON.parse(raw) as Partial<RegistryCache>;

    if (cache.version !== 2) return null; // stale format — force re-fetch

    if (!requireFresh || Date.now() - (cache.fetchedAt ?? 0) < CACHE_TTL) {
      return { official: cache.official ?? {}, contributed: cache.contributed ?? {} };
    }
    return null;
  } catch {
    return null;
  }
}

async function writeCache(payload: RemoteRegistryPayload): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const cache: RegistryCache = {
      version:     2,
      fetchedAt:   Date.now(),
      official:    payload.official,
      contributed: payload.contributed,
    };
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch {
    // non-fatal
  }
}

// ── Network fetch ─────────────────────────────────────────────────────────────

async function fetchFromGitHub(): Promise<RemoteRegistryPayload | null> {
  try {
    const res = await fetch(REGISTRY_RAW_URL, {
      signal:  AbortSignal.timeout(FETCH_TIMEOUT),
      headers: { 'User-Agent': 'create-fs-app-cli' },
    });
    if (!res.ok) return null;

    const remote = await res.json() as RemoteRegistry;

    if (remote.version !== 2) return null; // unsupported format

    const { repoUrl, branch } = remote;
    const official:    Record<string, TemplateMetadata> = {};
    const contributed: Record<string, TemplateMetadata> = {};

    for (const [key, entry] of Object.entries(remote.official ?? {})) {
      official[key] = buildMetadata(entry, repoUrl, branch);
      if (!official[key].subfolder) official[key].subfolder = `templates/${key}`;
    }
    for (const [key, entry] of Object.entries(remote.contributed ?? {})) {
      contributed[key] = buildMetadata(entry, repoUrl, branch, entry.contributor);
      if (!contributed[key].subfolder) contributed[key].subfolder = `templates/${key}`;
    }

    return { official, contributed };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getRemoteRegistry(): Promise<RemoteRegistryPayload | null> {
  const fresh = await readCache(true);
  if (fresh) return fresh;

  const fetched = await fetchFromGitHub();
  if (fetched) {
    await writeCache(fetched);
    return fetched;
  }

  const stale = await readCache(false);
  if (stale) return stale;

  return null;
}

export async function clearRegistryCache(): Promise<void> {
  try { await fs.unlink(CACHE_FILE); } catch { /* fine */ }
}
