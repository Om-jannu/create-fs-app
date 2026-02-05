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
    static debug(message, ...args) {
        if (DEBUG) {
            console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
        }
    }
    /**
     * Verbose message (only shown when VERBOSE=true or DEBUG=true)
     */
    static verbose(message, ...args) {
        if (VERBOSE || DEBUG) {
            console.log(chalk.blue(`[VERBOSE] ${message}`), ...args);
        }
    }
    /**
     * Info message
     */
    static info(message, ...args) {
        console.log(chalk.cyan(message), ...args);
    }
    /**
     * Success message
     */
    static success(message, ...args) {
        console.log(chalk.green(message), ...args);
    }
    /**
     * Warning message
     */
    static warn(message, ...args) {
        console.log(chalk.yellow(`⚠️  ${message}`), ...args);
    }
    /**
     * Error message
     */
    static error(message, ...args) {
        console.error(chalk.red(`❌ ${message}`), ...args);
    }
    /**
     * Check if debug mode is enabled
     */
    static isDebug() {
        return DEBUG;
    }
    /**
     * Check if verbose mode is enabled
     */
    static isVerbose() {
        return VERBOSE || DEBUG;
    }
}
//# sourceMappingURL=logger.js.map