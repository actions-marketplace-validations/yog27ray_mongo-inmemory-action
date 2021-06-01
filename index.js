const core = require("@actions/core");
const { exec } = require("child_process");

try {
  const image_version = core.getInput("image_version");
  const port = core.getInput("port");

  const command = `docker run -d -p ${port}:${port} mongo:${image_version} --port ${image_version} --storageEngine ephemeralForTest`;

  console.log("Executing the following command: ");
  console.log(command);

  dir = exec(command, function (err, stdout, stderr) {
    if (err) {
      core.setFailed(err.message);
    }
  });
} catch (error) {
  core.setFailed(error.message);
}
