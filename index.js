const core = require("@actions/core");
const { exec } = require("child_process");

async function executeCommands(commands) {
  const command = commands.shift();
  if (!command) {
    return [];
  }
  const result = await new Promise((resolve, reject) => {
    console.log("Executing the following command: ", command);
    exec(command, function (error, stdout, stderr) {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    })
  });
  const results = await executeCommands(commands);
  results.unshift(result);
  return results;
}

try {
  const image_version = core.getInput("image_version");
  const port = core.getInput("port");
  const ENV_VARIABLE = `MONGO_${port}_${image_version}`;

  const commands = [`docker run -d -p ${port}:${port} mongo:${image_version} --port ${port} --storageEngine ephemeralForTest`];
  executeCommands(commands)
      .then(([dockerId]) => {
        console.log(`::set-env name=${ENV_VARIABLE}::${dockerId}`);
      }).catch((error) => core.setFailed(error.message));
} catch (error) {
  core.setFailed(error.message);
}
