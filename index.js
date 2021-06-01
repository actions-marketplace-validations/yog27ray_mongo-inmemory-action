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

  executeCommands([`docker run -d -p ${port}:${port} mongo:${image_version} --port ${port} --storageEngine ephemeralForTest`])
      .then(([dockerId]) => executeCommands([`echo ${dockerId} > /tmp/${ENV_VARIABLE}`]))
      .then(() => executeCommands(['ls /tmp/']))
      .then(() => executeCommands([`cat /tmp/${ENV_VARIABLE}`]))
      .catch((error) => core.setFailed(error.message));
} catch (error) {
  core.setFailed(error.message);
}
