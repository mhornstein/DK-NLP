const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DEFAULT_PORT = 4200;

// Step 1: Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('server-uri', {
    alias: 's',
    describe: 'The Server URI',
    type: 'string',
    default: '127.0.0.1:3000',
  })
  .option('mode', {
    alias: 'm',
    describe: 'Mode to run the Angular CLI commands',
    choices: ['serve', 'build'], // Limit the choices to 'serve' and 'build'
    default: 'serve',
  })
  .option('port', {
    alias: 'p',
    describe: 'The port on which the client will be served',
    type: 'number',
    default: DEFAULT_PORT,
    implies: 'mode',
  })
  .check((argv) => {
    // Ensure that the port option is only used when the mode is 'serve' and that it is a number
    if (argv.mode === 'serve' && !Number.isInteger(argv.port)) {
      throw new Error(`The "port" option must be a number".`);
    }
    if (argv.mode === 'build' && argv.port !== DEFAULT_PORT) {
      throw new Error(
        'The "port" option can only be set when the "mode" is set to "serve".',
      );
    }
    return true; // Tell Yargs that the arguments passed the check
  }).argv;

const serverUri = argv['server-uri'];
const mode = argv.mode;
const port = argv.port; // This will only be set if mode is 'serve'

console.log(
  `Lunching client with Server URI: ${serverUri}, Mode: ${mode}${
    mode === 'serve' ? `, Port: ${port}` : ''
  }`,
);

// Step 2: Update the environment file
const environmentFilePath = path.join(
  __dirname,
  '../src/environments/environment.ts',
);
const environmentContent = `export const environment = { serverUri: '${serverUri}' };`;

try {
  fs.writeFileSync(environmentFilePath, environmentContent, {
    encoding: 'utf8',
  });
  console.log('Environment file updated successfully.');
} catch (error) {
  console.error('Error writing environment file:', error);
  process.exit(1);
}

// Step 3: Execute the Angular CLI command based on the mode
try {
  let command = mode === 'serve' ? `ng serve --port ${port}` : 'ng build';

  console.log(`Executing "${command}"...`);
  const child = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${command}:`, error);
      return;
    }
    console.log(stdout);
    if (stderr) {
      console.error(`Error in ${command}:`, stderr);
    }
  });

  // print the live output of the command
  child.stdout.on('data', (data) => {
    console.log(data);
  });
  child.stderr.on('data', (data) => {
    console.error(data);
  });
} catch (error) {
  console.error('Error executing Angular CLI command:', error);
  process.exit(1);
}
