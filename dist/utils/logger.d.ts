/**
 * Logging utilities with debug mode support
 */
export declare class Logger {
    /**
     * Debug message (only shown when DEBUG=true)
     */
    static debug(message: string, ...args: any[]): void;
    /**
     * Verbose message (only shown when VERBOSE=true or DEBUG=true)
     */
    static verbose(message: string, ...args: any[]): void;
    /**
     * Info message
     */
    static info(message: string, ...args: any[]): void;
    /**
     * Success message
     */
    static success(message: string, ...args: any[]): void;
    /**
     * Warning message
     */
    static warn(message: string, ...args: any[]): void;
    /**
     * Error message
     */
    static error(message: string, ...args: any[]): void;
    /**
     * Check if debug mode is enabled
     */
    static isDebug(): boolean;
    /**
     * Check if verbose mode is enabled
     */
    static isVerbose(): boolean;
}
