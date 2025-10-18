/**
 * Template Cloning and Customization
 * Handles downloading templates and customizing them for the user
 */
import { execa } from 'execa';
import fs from 'fs/promises';
import path from 'path';
/**
 * Clone a template repository
 */
export async function cloneTemplate(template, targetDir, branch = 'main') {
    const { url } = template;
    try {
        // Clone with shallow depth for speed
        await execa('git', [
            'clone',
            '--depth',
            '1',
            '--branch',
            branch,
            url,
            targetDir
        ]);
        // Remove .git directory to start fresh
        const gitDir = path.join(targetDir, '.git');
        await fs.rm(gitDir, { recursive: true, force: true });
    }
    catch (error) {
        throw new Error(`Failed to clone template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Customize the cloned template with user's configuration
 */
export async function customizeTemplate(targetDir, config) {
    // 1. Update package.json with project name
    await updatePackageJson(targetDir, config);
    // 2. Replace placeholders in files
    await replacePlaceholders(targetDir, config);
    // 3. Update README with project-specific info
    await updateReadme(targetDir, config);
    // 4. Handle optional features (remove if not selected)
    await handleOptionalFeatures(targetDir, config);
    // 5. Update environment variables template
    await updateEnvTemplate(targetDir, config);
}
/**
 * Update root and nested package.json files
 */
async function updatePackageJson(targetDir, config) {
    const packageJsonPaths = [
        path.join(targetDir, 'package.json'),
        path.join(targetDir, 'apps', 'frontend', 'package.json'),
        path.join(targetDir, 'apps', 'backend', 'package.json'),
    ];
    for (const pkgPath of packageJsonPaths) {
        try {
            const pkgContent = await fs.readFile(pkgPath, 'utf-8');
            const pkg = JSON.parse(pkgContent);
            // Update name based on location
            if (pkgPath.includes('frontend')) {
                pkg.name = `${config.name}-frontend`;
            }
            else if (pkgPath.includes('backend')) {
                pkg.name = `${config.name}-backend`;
            }
            else {
                pkg.name = config.name;
            }
            // Update description
            pkg.description = `${config.name} - Full-stack application`;
            // Write back
            await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
        }
        catch (error) {
            // File might not exist, that's okay
            continue;
        }
    }
}
/**
 * Replace placeholder variables in all files
 * Placeholders: {{PROJECT_NAME}}, {{FRONTEND_FRAMEWORK}}, etc.
 */
async function replacePlaceholders(targetDir, config) {
    const placeholders = {
        '{{PROJECT_NAME}}': config.name,
        '{{FRONTEND_FRAMEWORK}}': config.apps.frontend.framework,
        '{{BACKEND_FRAMEWORK}}': config.apps.backend.framework,
        '{{DATABASE}}': config.apps.backend.database,
        '{{ORM}}': config.apps.backend.orm || 'none',
        '{{PACKAGE_MANAGER}}': config.packageManager,
        '{{MONOREPO_FRAMEWORK}}': config.monorepo,
    };
    // Files to search and replace in
    const patterns = [
        '**/*.md',
        '**/*.json',
        '**/*.ts',
        '**/*.tsx',
        '**/*.js',
        '**/*.jsx',
        '**/Dockerfile',
        '**/.env.example',
    ];
    async function processFile(filePath) {
        try {
            let content = await fs.readFile(filePath, 'utf-8');
            let modified = false;
            for (const [placeholder, value] of Object.entries(placeholders)) {
                if (content.includes(placeholder)) {
                    content = content.replace(new RegExp(placeholder, 'g'), value);
                    modified = true;
                }
            }
            if (modified) {
                await fs.writeFile(filePath, content);
            }
        }
        catch (error) {
            // Skip files that can't be read as text
        }
    }
    async function walkDir(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            // Skip node_modules and .git
            if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
                continue;
            }
            if (entry.isDirectory()) {
                await walkDir(fullPath);
            }
            else if (entry.isFile()) {
                await processFile(fullPath);
            }
        }
    }
    await walkDir(targetDir);
}
/**
 * Update README with project-specific information
 */
async function updateReadme(targetDir, config) {
    const readmePath = path.join(targetDir, 'README.md');
    try {
        let readme = await fs.readFile(readmePath, 'utf-8');
        // Add project name as title if not already there
        if (!readme.startsWith(`# ${config.name}`)) {
            const techStack = `
## Tech Stack

- **Monorepo**: ${config.monorepo}
- **Frontend**: ${config.apps.frontend.framework} with ${config.apps.frontend.styling}
- **Backend**: ${config.apps.backend.framework}
- **Database**: ${config.apps.backend.database}
- **ORM**: ${config.apps.backend.orm || 'None'}
- **Package Manager**: ${config.packageManager}

`;
            readme = `# ${config.name}\n\n${techStack}${readme}`;
        }
        await fs.writeFile(readmePath, readme);
    }
    catch (error) {
        // README might not exist
    }
}
/**
 * Handle optional features - remove code/config for unselected features
 */
async function handleOptionalFeatures(targetDir, config) {
    // Remove Docker files if not selected
    if (!config.apps.backend.docker) {
        const dockerFiles = [
            path.join(targetDir, 'Dockerfile'),
            path.join(targetDir, 'docker-compose.yml'),
            path.join(targetDir, '.dockerignore'),
            path.join(targetDir, 'apps', 'backend', 'Dockerfile'),
            path.join(targetDir, 'apps', 'frontend', 'Dockerfile'),
        ];
        for (const file of dockerFiles) {
            try {
                await fs.unlink(file);
            }
            catch {
                // File doesn't exist, that's fine
            }
        }
    }
    // Remove linting config if not selected
    if (!config.apps.frontend.linting) {
        const lintFiles = [
            path.join(targetDir, '.eslintrc.json'),
            path.join(targetDir, '.prettierrc'),
            path.join(targetDir, 'apps', 'frontend', '.eslintrc.json'),
        ];
        for (const file of lintFiles) {
            try {
                await fs.unlink(file);
            }
            catch {
                // File doesn't exist
            }
        }
    }
}
/**
 * Update environment variables template
 */
async function updateEnvTemplate(targetDir, config) {
    const envExamplePath = path.join(targetDir, 'apps', 'backend', '.env.example');
    try {
        let envContent = await fs.readFile(envExamplePath, 'utf-8');
        // Update database URL based on selected database
        const dbUrls = {
            postgresql: 'postgresql://user:password@localhost:5432/{{PROJECT_NAME}}',
            mysql: 'mysql://user:password@localhost:3306/{{PROJECT_NAME}}',
            mongodb: 'mongodb://localhost:27017/{{PROJECT_NAME}}',
            sqlite: 'file:./dev.db',
        };
        const dbUrl = dbUrls[config.apps.backend.database] || '';
        envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${dbUrl}"`);
        envContent = envContent.replace(/{{PROJECT_NAME}}/g, config.name);
        await fs.writeFile(envExamplePath, envContent);
    }
    catch (error) {
        // .env.example might not exist
    }
}
/**
 * Initialize git repository
 */
export async function initializeGit(targetDir, config) {
    try {
        process.chdir(targetDir);
        await execa('git', ['init']);
        await execa('git', ['add', '.']);
        await execa('git', ['commit', '-m', `Initial commit: ${config.name}`]);
        console.log('✓ Initialized git repository');
    }
    catch (error) {
        console.warn('Warning: Git initialization failed');
    }
}
/**
 * Install dependencies
 */
export async function installDependencies(targetDir, packageManager) {
    try {
        process.chdir(targetDir);
        console.log(`Installing dependencies with ${packageManager}...`);
        await execa(packageManager, ['install'], {
            stdio: 'inherit',
        });
        console.log('✓ Dependencies installed');
    }
    catch (error) {
        throw new Error(`Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=template-clone.js.map