/**
 * Project Health Check
 * Verifies project setup and dependencies
 */
export interface HealthCheckResult {
    passed: boolean;
    checks: Array<{
        name: string;
        passed: boolean;
        message: string;
        suggestion?: string;
    }>;
}
/**
 * Run health check on a project
 */
export declare function runHealthCheck(projectDir?: string): Promise<HealthCheckResult>;
/**
 * Display health check results
 */
export declare function displayHealthCheckResults(result: HealthCheckResult): void;
