/**
 * Project Health Check
 * Verifies project setup and dependencies
 */

import fs from 'fs/promises';
import path from 'path';
import { execa } from 'execa';
import chalk from 'chalk';
import { Logger } from '../utils/logger.js';

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
export async function runHealthCheck(projectDir: string = process.cwd()): Promise<HealthCheckResult> {
  const checks: HealthCheckResult['checks'] = [];
  
  console.log(chalk.cyan.bold('\n🏥 Running Project Health Check...\n'));
  
  // Check 1: package.json exists
  checks.push(await checkPackageJson(projectDir));
  
  // Check 2: node_modules exists
  checks.push(await checkNodeModules(projectDir));
  
  // Check 3: Git repository
  checks.push(await checkGitRepo(projectDir));
  
  // Check 4: TypeScript configuration
  checks.push(await checkTypeScriptConfig(projectDir));
  
  // Check 5: Environment files
  checks.push(await checkEnvFiles(projectDir));
  
  // Check 6: Monorepo structure
  checks.push(await checkMonorepoStructure(projectDir));
  
  // Check 7: Dependencies are up to date
  checks.push(await checkDependencies(projectDir));
  
  // Check 8: Build scripts
  checks.push(await checkBuildScripts(projectDir));
  
  const passed = checks.every(c => c.passed);
  
  return { passed, checks };
}

/**
 * Display health check results
 */
export function displayHealthCheckResults(result: HealthCheckResult): void {
  console.log();
  
  result.checks.forEach(check => {
    const icon = check.passed ? chalk.green('✓') : chalk.red('✗');
    console.log(`${icon} ${check.name}`);
    console.log(chalk.gray(`  ${check.message}`));
    
    if (!check.passed && check.suggestion) {
      console.log(chalk.yellow(`  💡 ${check.suggestion}`));
    }
    console.log();
  });
  
  const passedCount = result.checks.filter(c => c.passed).length;
  const totalCount = result.checks.length;
  
  console.log(chalk.bold(`\nResults: ${passedCount}/${totalCount} checks passed\n`));
  
  if (result.passed) {
    console.log(chalk.green.bold('✨ Project is healthy!\n'));
  } else {
    console.log(chalk.yellow.bold('⚠️  Some issues found. See suggestions above.\n'));
  }
}

// Individual check functions

async function checkPackageJson(projectDir: string) {
  try {
    const pkgPath = path.join(projectDir, 'package.json');
    await fs.access(pkgPath);
    const content = await fs.readFile(pkgPath, 'utf-8');
    JSON.parse(content); // Validate JSON
    
    return {
      name: 'package.json',
      passed: true,
      message: 'Valid package.json found'
    };
  } catch {
    return {
      name: 'package.json',
      passed: false,
      message: 'package.json not found or invalid',
      suggestion: 'Make sure you are in a valid Node.js project directory'
    };
  }
}

async function checkNodeModules(projectDir: string) {
  try {
    const nmPath = path.join(projectDir, 'node_modules');
    await fs.access(nmPath);
    
    return {
      name: 'Dependencies',
      passed: true,
      message: 'node_modules directory exists'
    };
  } catch {
    return {
      name: 'Dependencies',
      passed: false,
      message: 'node_modules not found',
      suggestion: 'Run npm install (or yarn/pnpm install) to install dependencies'
    };
  }
}

async function checkGitRepo(projectDir: string) {
  try {
    const gitPath = path.join(projectDir, '.git');
    await fs.access(gitPath);
    
    return {
      name: 'Git Repository',
      passed: true,
      message: 'Git repository initialized'
    };
  } catch {
    return {
      name: 'Git Repository',
      passed: false,
      message: 'Not a git repository',
      suggestion: 'Run "git init" to initialize a git repository'
    };
  }
}

async function checkTypeScriptConfig(projectDir: string) {
  try {
    const tsconfigPath = path.join(projectDir, 'tsconfig.json');
    await fs.access(tsconfigPath);
    const content = await fs.readFile(tsconfigPath, 'utf-8');
    JSON.parse(content);
    
    return {
      name: 'TypeScript Configuration',
      passed: true,
      message: 'Valid tsconfig.json found'
    };
  } catch {
    return {
      name: 'TypeScript Configuration',
      passed: false,
      message: 'tsconfig.json not found or invalid',
      suggestion: 'Create a tsconfig.json file for TypeScript configuration'
    };
  }
}

async function checkEnvFiles(projectDir: string) {
  try {
    const envExamplePath = path.join(projectDir, 'apps', 'backend', '.env.example');
    await fs.access(envExamplePath);
    
    // Check if .env exists
    const envPath = path.join(projectDir, 'apps', 'backend', '.env');
    try {
      await fs.access(envPath);
      return {
        name: 'Environment Files',
        passed: true,
        message: '.env and .env.example found'
      };
    } catch {
      return {
        name: 'Environment Files',
        passed: false,
        message: '.env.example found but .env is missing',
        suggestion: 'Copy .env.example to .env and configure your environment variables'
      };
    }
  } catch {
    return {
      name: 'Environment Files',
      passed: false,
      message: 'Environment configuration files not found',
      suggestion: 'Create .env.example and .env files in apps/backend/'
    };
  }
}

async function checkMonorepoStructure(projectDir: string) {
  try {
    const appsPath = path.join(projectDir, 'apps');
    const packagesPath = path.join(projectDir, 'packages');
    
    await fs.access(appsPath);
    
    // Check for frontend and backend
    const frontendPath = path.join(appsPath, 'frontend');
    const backendPath = path.join(appsPath, 'backend');
    
    await fs.access(frontendPath);
    await fs.access(backendPath);
    
    return {
      name: 'Monorepo Structure',
      passed: true,
      message: 'Valid monorepo structure (apps/frontend, apps/backend)'
    };
  } catch {
    return {
      name: 'Monorepo Structure',
      passed: false,
      message: 'Expected monorepo structure not found',
      suggestion: 'Ensure apps/frontend and apps/backend directories exist'
    };
  }
}

async function checkDependencies(projectDir: string) {
  try {
    const pkgPath = path.join(projectDir, 'package.json');
    const content = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    
    if (!pkg.dependencies && !pkg.devDependencies) {
      return {
        name: 'Dependencies Check',
        passed: false,
        message: 'No dependencies defined',
        suggestion: 'Add required dependencies to package.json'
      };
    }
    
    return {
      name: 'Dependencies Check',
      passed: true,
      message: 'Dependencies are defined'
    };
  } catch {
    return {
      name: 'Dependencies Check',
      passed: false,
      message: 'Could not check dependencies',
      suggestion: 'Verify package.json is valid'
    };
  }
}

async function checkBuildScripts(projectDir: string) {
  try {
    const pkgPath = path.join(projectDir, 'package.json');
    const content = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    
    const requiredScripts = ['dev', 'build'];
    const missingScripts = requiredScripts.filter(script => !pkg.scripts?.[script]);
    
    if (missingScripts.length > 0) {
      return {
        name: 'Build Scripts',
        passed: false,
        message: `Missing scripts: ${missingScripts.join(', ')}`,
        suggestion: 'Add dev and build scripts to package.json'
      };
    }
    
    return {
      name: 'Build Scripts',
      passed: true,
      message: 'Required scripts (dev, build) are defined'
    };
  } catch {
    return {
      name: 'Build Scripts',
      passed: false,
      message: 'Could not check build scripts',
      suggestion: 'Verify package.json is valid'
    };
  }
}
