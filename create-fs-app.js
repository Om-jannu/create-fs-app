#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require("child_process");
const os = require("os");
const path = require('path');
const { dir } = require('console');
// const processEditor = require('process-editor');

// console.log(process.argv.length);
// console.log(processEditor.name);
if (process.argv.length > 3) {
  console.log("Error: Please provide a valid directory name\n");
  console.log("Note: directory name should not contain spaces");
  console.log("Try : npx build-mern-app app_name");
  process.exit(1);
}
let appName = process.argv[2];
const currentDirectory = process.cwd();
const parentDir = path.resolve(__dirname, '..');
console.log("parent directory"+parentDir);
const gitRepo = "https://github.com/Om-jannu/mern-template.git";
const buildStructure = (dirName,dir) => {
  try {
    execSync(`git clone ${gitRepo} ${dirName}`,{stdio:'inherit'});
    console.log('Repository cloned successfully to '+dir);
  } catch (err) {
    console.error('Error cloning repository:', err);
    process.exit(1);
  }
}
if (!appName) {
  console.error('Error: Please provide a directory name');
  process.exit(1);
}
else if (appName == ".") {
  buildStructure(".",currentDirectory);
}
else {
  fs.access(parentDir, fs.constants.F_OK, (error) => {
    if (error) {
      console.error(`Error: Directory "${dirName}" does not exist`);
      process.exit(1);
    }
    process.chdir(parentDir);
    console.log("changed to parent directory");
    console.log(`Current directory after changing: ${process.cwd()}`);
    if (fs.existsSync(path.join(parentDir, appName))) {
      console.log("file already exists");
      process.exit(0);
    }
    fs.mkdirSync(appName);
    const projectdirname = parentDir+'\.'+appName;
    buildStructure(appName,projectdirname);
    console.log(`Project "${appName}" has been created`);
  });
}