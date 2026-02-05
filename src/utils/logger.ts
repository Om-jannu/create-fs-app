/**
 * Logging utilities with debug mode support
 */

import chalk from 'chalk';

// Check if debug mode is enabled
const DEBUG = process.env.DEBUG === 'true' || process.env.DEBUG === '1';
const VERBOSE = process.env.VERBOSE === 'true' || process.env.VERBOSE === '1';

export class Logger {
  /**
   * Debug message (only shown when DEBUG=true)
   */
  static debug(message: string, ...args: any[]): void {
    if (DEBUG) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  /**
   * Verbose message (only shown when VERBOSE=true or DEBUG=true)
   */
  static verbose(message: string, ...args: any[]): void {
    if (VERBOSE || DEBUG) {
      console.log(chalk.blue(`[VERBOSE] ${message}`), ...args);
    }
  }

  /**
   * Info message
   */
  static info(message: string, ...args: any[]): void {
    console.log(chalk.cyan(message), ...args);
  }

  /**
   * Success message
   */
  static success(message: string, ...args: any[]): void {
    console.log(chalk.green(message), ...args);
  }

  /**
   * Warning message
   */
  static warn(message: string, ...args: any[]): void {
    console.log(chalk.yellow(`⚠️  ${message}`), ...args);
  }

  /**
   * Error message
   */
  static error(message: string, ...args: any[]): void {
    console.error(chalk.red(`❌ ${message}`), ...args);
  }

  /**
   * Check if debug mode is enabled
   */
  static isDebug(): boolean {
    return DEBUG;
  }

  /**
   * Check if verbose mode is enabled
   */
  static isVerbose(): boolean {
    return VERBOSE || DEBUG;
  }
}
