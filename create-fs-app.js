import fs from 'fs';
import child_process from 'child_process';
import path from 'path';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';
import gradient from 'gradient-string';
import ora from 'ora'; 
import prompts from 'prompts';

const currentDirectory = process.cwd();

// Git repositories
const mernGitRepo = 'https://github.com/Om-jannu/mern-template.git';
const meanGitRepo = 'https://github.com/your-username/mean-template.git';
const mevnGitRepo = 'https://github.com/your-username/mevn-template.git'; 

// Sleep function
const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));


const installMyPackage = async () => {
  const response = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'This script needs to install the create-fs-app package globally. Do you want to proceed?',
    initial: false,
  });

  if (response.confirm) {
    const spinner = ora('Installing create-fs-app package...').start();
    try {
      child_process.execSync('npm i create-fs-app -g');
      spinner.succeed('create-fs-app package installed successfully');
    } catch (error) {
      spinner.fail('Error installing create-fs-app package');
      console.error(chalk.red('Error installing create-fs-app package:', error.message));
      process.exit(1);
    }
  } else {
    console.log(chalk.yellow('Package installation canceled. Exiting...'));
    process.exit(0);
  }
};

// Welcome function
const welcome = async () => {
  const msg = 'create-fs-app';
  const welcomeMsg = figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
  welcomeMsg;
  await sleep();
  console.log(`
  I am your personal FullStack template generator 
  I can create Full Stack Templates for you ${chalk.green('in seconds')}😉
  Let's get started...
  `);
};

// Question function
const askFsName = async () => {
  const answers = await inquirer.prompt({
    name: 'fs_app',
    type: 'list',
    message: 'Which FullStack App do you want to build?',
    choices: ['MERN app', 'MEAN app', 'MEVN app'],
  });
  return handleAnswer(answers.fs_app);
};

// Completion screen
const completion = async (appName) => {
  const completion_msg = chalkAnimation.rainbow(
    '\nSuccessfully created your Full Stack Template'
  );
  await sleep();
  completion_msg.stop();
  console.log(chalk.bold.yellow('To access your folder :'));
  console.log(chalk.bold.blue(`cd ${appName === '.' ? currentDirectory : appName}`));
  console.log(chalk.bold.blue('code .'));
  console.log(chalk.bold.yellow(`\nNOTE : ${chalk.bold.blue('code .')} is for opening folder in ${chalk.bold.blue('vs-code')} for different IDE use different Keyword`));
};

// Answer handler
const handleAnswer = async (fs_app) => {
  const spinner = createSpinner(chalk.bold.green('Creating your Project Structure...')).start();
  await sleep();
  spinner.stop();

  try {
    let repoUrl;
    switch (fs_app) {
      case 'MERN app':
        console.log(chalk.bold.bgGreen('\nBuilding MERN structure'));
        repoUrl = mernGitRepo;
        break;
      case 'MEAN app':
        console.log(chalk.bold.bgBlue('\nBuilding MEAN structure'));
        repoUrl = meanGitRepo;
        break;
      case 'MEVN app':
        console.log(chalk.bold.bgMagenta('\nBuilding MEVN structure'));
        repoUrl = mevnGitRepo;
        break;
      default:
        console.error(chalk.red('Invalid choice. Please try again.'));
        process.exit(1);
    }

    const appName = process.argv[2] || '.';
    await buildStructure(fs_app, repoUrl, appName);
    await completion(appName);
  } catch (error) {
    console.error(chalk.red('Error creating project structure:', error.message));
    process.exit(1);
  }
};

// Function to build the project structure
const buildStructure = async (selectedApp, repoUrl, appName) => {
  try {
    // Function to create a folder
    const createFolder = async (folderName) => {
      try {
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName);
          console.log(chalk.bold.green(`Creating a ${selectedApp} in ~/${folderName}`));
        } else {
          console.log(chalk.italic.red(`Folder ${folderName} already exists.`));
          console.log(chalk.bold.yellow(`Try : cd ${folderName} && npx create-fs-app .`));
        }
      } catch (err) {
        throw new Error(`Error creating folder ${err}`);
      }
    };

    // Function to clone a repository
    const cloneRepository = async (dirName, custdir, repo) => {
      try {
        child_process.execSync(`git clone ${repo} ${dirName}`, { stdio: 'inherit' });
        console.log(chalk.bold.green('\nRepository cloned successfully to ' + custdir));
      } catch (err) {
        throw new Error('Error cloning repository:', err);
      }
    };

    if (!appName) {
      throw new Error('Error: Please provide a directory name');
    } else if (appName === '.') {
      cloneRepository('.', currentDirectory, repoUrl);
    } else {
      await createFolder(appName);
      await cloneRepository(appName, path.join(currentDirectory, appName), repoUrl);
    }
  } catch (error) {
    throw error;
  }
};

const run = async () => {
  try {
    if (process.argv.length > 3) {
      console.log(chalk.italic.red('Error: Please provide a valid directory name'));
      console.log(chalk.italic.red('Note: directory name should not contain spaces'));
      console.log(chalk.bold.yellow('Try : npx create-fs-app app_name'));
      process.exit(1);
    }

    // await installMyPackage();
    await welcome();
    await askFsName();
  } catch (error) {
    console.error(chalk.red('An error occurred:', error.message));
    process.exit(1);
  }
};

run();