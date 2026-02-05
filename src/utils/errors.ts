/**
 * Custom error classes with helpful messages
 */

import chalk from 'chalk';

export class ProjectError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ProjectError';
  }
}

/**
 * Enhance error messages with helpful context
 */
export function enhanceError(error: any): Error {
  if (error.code === 'EACCES') {
    return new ProjectError(
      'Permission denied. Try running with sudo or check directory permissions.',
      'EACCES'
    );
  }
  
  if (error.code === 'ENOSPC') {
    return new ProjectError(
      'Not enough disk space to create project.',
      'ENOSPC'
    );
  }
  
  if (error.code === 'EEXIST') {
    return new ProjectError(
      'Directory already exists. Please choose a different name or remove the existing directory.',
      'EEXIST'
    );
  }
  
  if (error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo')) {
    return new ProjectError(
      'Network error: Unable to connect to template repository. Check your internet connection.',
      'ENOTFOUND'
    );
  }
  
  if (error.message?.includes('git')) {
    return new ProjectError(
      'Git error: Make sure git is installed and accessible from your PATH.\n' +
      'Install git: https://git-scm.com/downloads',
      'GIT_ERROR'
    );
  }
  
  if (error.message?.includes('npm') || error.message?.includes('yarn') || error.message?.includes('pnpm')) {
    return new ProjectError(
      'Package manager error: Failed to install dependencies.\n' +
      'Try running the installation manually after project creation.',
      'PKG_MANAGER_ERROR'
    );
  }
  
  return error;
}

/**
 * Format error for display
 */
export function formatError(error: any): string {
  const enhanced = enhanceError(error);
  
  let message = chalk.red.bold('\n❌ Error: ') + chalk.red(enhanced.message);
  
  if (enhanced instanceof ProjectError && enhanced.code) {
    message += chalk.gray(`\n\nError code: ${enhanced.code}`);
  }
  
  return message;
}
