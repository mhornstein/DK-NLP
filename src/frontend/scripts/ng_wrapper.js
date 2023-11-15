const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEFAULT_SERVER_URI = '127.0.0.1:3000';

function parseArguments(args) {
  const ngArgs = [];
  let serverUri = DEFAULT_SERVER_URI;
  let i = 0;

  while (i < args.length) {
    if (args[i] === '--serverUri') {
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        serverUri = args[i + 1]; // override serverUri value
        i += 2; // Skip the next item since it's the value of --serverUri
      } else {
        throw new Error(
          'Invalid value for --serverUri. A URI must follow the --serverUri flag.',
        );
      }
    } else {
      ngArgs.push(args[i]);
      i++;
    }
  }
  return { ngArgs, serverUri };
}

function runNgCommand(ngArgs) {
  const command = `ng ${ngArgs.join(' ')}`;

  console.log(`running command: ${command}`);

  const child = exec(command);

  child.stdout.on('data', (data) => {
    console.log(data);
  });
  child.stderr.on('data', (data) => {
    console.error(data);
  });
}

function setServerUri(serverUri) {
  const envFilePath = path.join(
    __dirname,
    '../src/environments/environment.ts',
  );
  const envContent = `export const environment = { serverUri: '${serverUri}' };`;

  try {
    fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });
  } catch (error) {
    throw new Error(`Error writing environment file: ${error.message}`);
  }
}

// Main Execution
try {
  const args = process.argv.slice(2); // Remove the first two elements (node and script path)
  const { ngArgs, serverUri } = parseArguments(args);
  setServerUri(serverUri);
  runNgCommand(ngArgs);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
