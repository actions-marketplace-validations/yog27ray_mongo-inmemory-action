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
  executeCommands([`[ -f /tmp/${ENV_VARIABLE} ] && cat /tmp/${ENV_VARIABLE}`])
      .then(([dockerId]) => {
        console.log('>>>>>DockerId:', dockerId);
        if (!dockerId) {
          return Promise.resolve();
        }
        return executeCommands([`docker stop ${dockerId}`, `docker rm ${dockerId}`])
      })
      .catch((error) => core.setFailed(error.message));
} catch (error) {
  core.setFailed(error.message);
}
