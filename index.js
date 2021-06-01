const core = require("@actions/core");
const { exec } = require("child_process");

async function executeCommands(commands) {
  const command = commands.shift();
  if (!command) {
    return;
  }
  await new Promise((resolve, reject) => {
    console.log("Executing the following command: ", command);
    exec(command, function (error, stdout, stderr) {
      if (error) {
        reject(error);
        return;
      }
      console.log('>>>>>', stdout);
      resolve();
    })
  });
  await executeCommands(commands);
}

try {
  const image_version = core.getInput("image_version");
  const port = core.getInput("port");

  const commands = [`docker run -d -p ${port}:${port} mongo:${image_version} --port ${port} --storageEngine ephemeralForTest`];
  executeCommands(commands).catch((error) => core.setFailed(error.message));
} catch (error) {
  core.setFailed(error.message);
}
