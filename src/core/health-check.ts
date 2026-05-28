/**
 * Environment Health Check
 * Verifies that the required tools are installed and at the right version.
 */

import { execa } from 'execa';
import chalk from 'chalk';
import os from 'os';

export interface HealthCheckResult {
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
    suggestion?: string;
  }>;
}

export async function runHealthCheck(): Promise<HealthCheckResult> {
  const checks: HealthCheckResult['checks'] = [];

  console.log(chalk.cyan.bold('\n🏥 Environment Health Check\n'));

  checks.push(await checkNode());
  checks.push(await checkGit());
  checks.push(await checkDocker());
  checks.push(await checkNpm());
  checks.push(await checkPnpm());
  checks.push(await checkYarn());

  const passed = checks.every(c => c.passed);
  return { passed, checks };
}

export function displayHealthCheckResults(result: HealthCheckResult): void {
  console.log();
  result.checks.forEach(check => {
    const icon = check.passed ? chalk.green('✓') : chalk.red('✗');
    console.log(`${icon} ${chalk.bold(check.name)}`);
    console.log(chalk.gray(`  ${check.message}`));
    if (!check.passed && check.suggestion) {
      console.log(chalk.yellow(`  💡 ${check.suggestion}`));
    }
    console.log();
  });

  const passedCount = result.checks.filter(c => c.passed).length;
  const totalCount  = result.checks.length;
  console.log(chalk.bold(`Results: ${passedCount}/${totalCount} checks passed\n`));

  if (result.passed) {
    console.log(chalk.green.bold('✨ Environment is ready!\n'));
  } else {
    console.log(chalk.yellow.bold('⚠️  Some tools are missing. See suggestions above.\n'));
  }
}

// ── Individual checks ─────────────────────────────────────────────────────────

async function checkNode() {
  try {
    const result = await execa('node', ['--version']);
    const raw     = result.stdout.trim();               // e.g. "v20.11.0"
    const [major] = raw.replace('v', '').split('.').map(Number);
    const ok      = major >= 18;
    return {
      name:       'Node.js',
      passed:     ok,
      message:    `${raw} detected${ok ? '' : ' (v18+ required)'}`,
      suggestion: ok ? undefined : 'Download from https://nodejs.org (LTS recommended)',
    };
  } catch {
    return {
      name:       'Node.js',
      passed:     false,
      message:    'Not found in PATH',
      suggestion: 'Download from https://nodejs.org',
    };
  }
}

async function checkGit() {
  try {
    const result = await execa('git', ['--version']);
    return {
      name:    'Git',
      passed:  true,
      message: result.stdout.trim(),
    };
  } catch {
    return {
      name:       'Git',
      passed:     false,
      message:    'Not found in PATH',
      suggestion: 'Install from https://git-scm.com/downloads',
    };
  }
}

async function checkDocker() {
  try {
    const result = await execa('docker', ['--version']);
    // Check if daemon is running
    try {
      await execa('docker', ['info'], { timeout: 4000 });
      return {
        name:    'Docker',
        passed:  true,
        message: result.stdout.trim() + ' — daemon running',
      };
    } catch {
      return {
        name:       'Docker',
        passed:     false,
        message:    result.stdout.trim() + ' — daemon not running',
        suggestion: 'Start Docker Desktop or run: sudo systemctl start docker',
      };
    }
  } catch {
    return {
      name:       'Docker',
      passed:     false,
      message:    'Not found in PATH',
      suggestion: 'Install from https://docs.docker.com/get-docker/',
    };
  }
}

async function checkNpm() {
  try {
    const result = await execa('npm', ['--version']);
    return { name: 'npm', passed: true, message: `v${result.stdout.trim()}` };
  } catch {
    return { name: 'npm', passed: false, message: 'Not found in PATH', suggestion: 'Comes bundled with Node.js' };
  }
}

async function checkPnpm() {
  try {
    const result = await execa('pnpm', ['--version']);
    return { name: 'pnpm', passed: true, message: `v${result.stdout.trim()}` };
  } catch {
    return { name: 'pnpm', passed: false, message: 'Not installed', suggestion: 'npm install -g pnpm' };
  }
}

async function checkYarn() {
  try {
    const result = await execa('yarn', ['--version']);
    return { name: 'Yarn', passed: true, message: `v${result.stdout.trim()}` };
  } catch {
    return { name: 'Yarn', passed: false, message: 'Not installed', suggestion: 'npm install -g yarn' };
  }
}
