const { exec } = require('child_process');
const path = require('path');

// Define the commands to run
const commands = [
  'git submodule update --init --recursive',
  'git checkout 5d3a10a',
  'mkdir -p output/HorizonLog'
];

// Function to execute a command
function runCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

// Run the commands sequentially
async function runCommands() {
  try {
    await runCommand(commands[0], process.cwd());
    await runCommand(commands[1], path.join(process.cwd(), 'Horizon'));
    await runCommand(commands[2], path.join(process.cwd(), 'Horizon'));
    console.log('Postinstall script completed successfully.');
  } catch (error) {
    console.error('Postinstall script failed.');
    process.exit(1);
  }
}

runCommands();