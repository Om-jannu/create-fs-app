#!/usr/bin/env node
import fs from 'fs';
import child_process from "child_process";
import path from 'path';
import {fileURLToPath} from 'url';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';
import gradient from 'gradient-string';

let appName = process.argv[2];
const currentDirectory = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const parentDir = path.resolve(path.dirname(__filename),'../');
console.log(parentDir);
const mernGitRepo = "https://github.com/Om-jannu/mern-template.git";

//sleep function
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

// welcome function
const welcome = async() =>{
  const msg = "create-fs-app";
  const welcomeMsg = figlet(msg,(err,data) =>{
    console.log(gradient.pastel.multiline(data));
  })
  welcomeMsg;
  await sleep();
  console.log(`
  I am your personal FullStack template generator 
  I can create Full Stack Templates for you ${chalk.green('in seconds')}😉
  Let's get started...
  `);
}

// qns function
const askFsName = async() => {
  const answers = await inquirer.prompt({
    name:"fs_app",
    type:'list',
    message:'Which FullStack App do you want to build?',
    choices:[
      'MERN app',
      'MEAN app',
      'MEVN app',
    ],
  });
  return handleAnswer(answers.fs_app);
}

//completion screen
const completion = async() =>{
  const completion_msg = chalkAnimation.rainbow(
    '\nSuccesfully created your Full Stack Template'
  );
  await sleep();
  completion_msg.stop();
  console.log(chalk.bold.yellow('To access your folder :'));
  console.log(chalk.bold.blue('cd ..'));
  console.log(chalk.bold.blue(`cd ${appName}`));
  console.log(chalk.bold.blue('code .'));
      const projectdirname = parentDir+'/'+appName;
      console.log(chalk.bold.yellow(`\nNOTE : ${chalk.bold.blue('code .')} is for opening folder in vs-code for different IDE use different Keyword`));
}

// answer handler
const handleAnswer = async(fs_app) => {
  const spinner = createSpinner(chalk.bold.green('Creating your Project Structure...')).start();
  await sleep();
  spinner.stop();
  if(fs_app == 'MERN app') {
    console.log(chalk.bold.bgGreen("\nBuilding MERN structure"));
    BuildMernStructure();
    await sleep();
    completion();
  }
  if(fs_app == 'MEAN app') {
    console.log("\nNot yet started");
    // completion();
  }
  if(fs_app == 'MEVN app') {
    console.log("\nNot yet started");
    // completion();
  }
}

// function to clone a repositoy
const buildStructure = (dirName,dir,repo) => {
  try {
    child_process.execSync(`git clone ${repo} ${dirName}`,{stdio:'inherit'});
    console.log(chalk.bold.green('\nRepository cloned successfully to '+dir));
  } catch (err) {
    console.error(chalk.bold.red('Error cloning repository:', err));
    process.exit(1);
  }
}

// function to clone mern repository
const BuildMernStructure = ()=>{
  if (!appName) {
    console.error(chalk.bold.red('Error: Please provide a directory name'));
    process.exit(1);
  }
  else if (appName == ".") {
    buildStructure(".",currentDirectory,mernGitRepo);
  }
  else {
    fs.access(parentDir, fs.constants.F_OK, (error) => {
      if (error) {
        console.error(chalk.bold.red(`Error: Directory "${parentDir}" does not exist`));
        process.exit(1);
      }
      process.chdir(parentDir);
      console.log(chalk.bold.yellow(`Current directory : ${process.cwd()}`));
      if (fs.existsSync(path.join(parentDir, appName))) {
        console.log(chalk.bold.red("Folder already exists"));
        process.exit(0);
      }
      fs.mkdirSync(appName);
      const projectdirname = parentDir+'\\'+appName;
      buildStructure(appName,projectdirname,mernGitRepo);
      console.log(chalk.bold.green(`Project "${appName}" has been created`));
    });
  }
}

if (process.argv.length > 3) {
  console.log(chalk.bold.red("Error: Please provide a valid directory name"));
  console.log(chalk.bold.red("Note: directory name should not contain spaces"));
  console.log(chalk.bold.yellow("Try : npx build-mern-app app_name"));
  process.exit(1);
}

await welcome();
await askFsName();





