/**
 * Input validation utilities
 */

import chalk from 'chalk';

/**
 * Validate project name
 * - Must contain only letters, numbers, hyphens, and underscores
 * - Cannot start with . or _
 * - Must be less than 214 characters
 * - Cannot be a reserved name
 */
export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Project name cannot be empty' };
  }

  // Check for valid characters
  if (!/^[a-z0-9-_]+$/.test(name)) {
    return {
      valid: false,
      error: `Project name can only contain lowercase letters, numbers, hyphens, and underscores.\nInvalid name: "${name}"`
    };
  }

  // Check length (npm package name limit)
  if (name.length > 214) {
    return { valid: false, error: 'Project name must be less than 214 characters' };
  }

  // Check if starts with . or _
  if (/^[._]/.test(name)) {
    return { valid: false, error: 'Project name cannot start with . or _' };
  }

  // Check for reserved names
  const reserved = ['node_modules', 'package.json', 'package-lock.json', 'npm', 'node'];
  if (reserved.includes(name.toLowerCase())) {
    return { valid: false, error: `"${name}" is a reserved name` };
  }

  return { valid: true };
}

/**
 * Validate and throw if invalid
 */
export function assertValidProjectName(name: string): void {
  const result = validateProjectName(name);
  if (!result.valid) {
    throw new Error(result.error);
  }
}

/**
 * Validate template URL
 */
export interface ParsedTemplateUrl {
  /** Bare clone URL: https://github.com/owner/repo */
  repoUrl: string;
  /** Branch or tag to check out (defaults to 'main') */
  branch: string;
  /** Optional subfolder inside the repo to use as the template root */
  subfolder?: string;
}

/**
 * Parse and validate a GitHub template URL.
 *
 * Accepts three forms:
 *   https://github.com/user/repo
 *   https://github.com/user/repo/tree/<branch>
 *   https://github.com/user/repo/tree/<branch>/path/to/subfolder
 */
export function parseTemplateUrl(
  url: string
): { valid: boolean; error?: string; parsed?: ParsedTemplateUrl } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Template URL cannot be empty' };
  }

  // Form 1: https://github.com/user/repo[.git]
  const rootRe = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?$/;
  const rootMatch = url.match(rootRe);
  if (rootMatch) {
    return {
      valid: true,
      parsed: {
        repoUrl: `https://github.com/${rootMatch[1]}/${rootMatch[2]}`,
        branch: 'main',
      },
    };
  }

  // Form 2: https://github.com/user/repo/tree/<branch>[/subfolder/path]
  const treeRe = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)\/tree\/([\w./-]+?)(?:\/(.+))?$/;
  const treeMatch = url.match(treeRe);
  if (treeMatch) {
    return {
      valid: true,
      parsed: {
        repoUrl: `https://github.com/${treeMatch[1]}/${treeMatch[2]}`,
        branch: treeMatch[3],
        subfolder: treeMatch[4] || undefined,
      },
    };
  }

  return {
    valid: false,
    error:
      'Template URL must be a GitHub URL in one of these forms:\n' +
      '  https://github.com/user/repo\n' +
      '  https://github.com/user/repo/tree/branch\n' +
      '  https://github.com/user/repo/tree/branch/path/to/subfolder',
  };
}

/** @deprecated use parseTemplateUrl */
export function validateTemplateUrl(url: string): { valid: boolean; error?: string } {
  const result = parseTemplateUrl(url);
  return { valid: result.valid, error: result.error };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_RE.test(value);
}
