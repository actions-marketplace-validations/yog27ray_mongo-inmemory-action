# mongo-memory-action

[![GitHub Actions status](https://github.com/yog27ray/mongo-inmemory-action/workflows/mongo-inmemory-action%20CI/badge.svg)](https://github.com/yog27ray/mongo-inmemory-action/actions) [![GitHub Releases](https://img.shields.io/github/release/yog27ray/mongo-inmemory-action.svg)](https://github.com/yog27ray/mongo-inmemory-action/releases)

**mongo-inmemory-action** is a Github Action which creates a mongo Docker container with storageEngine as ephemeralForTest using the official [Dockerhub image](https://hub.docker.com/_/mongo). The MongoDB instance's port will be exposed to other containers and also to the host running the Github Workflow.

## Inputs

### `image-version`

**Optional:** The `mongo` Docker image version to use. Default: `"latest"`. Refer to the official [Dockerhub image page](https://hub.docker.com/_/mongo).

### `port`

**Optional:** The `mongo` port to use. Default: `27017`.

## Example usage

```yaml
on: [push]

jobs:
  test_mongo_action:
    runs-on: ubuntu-latest
    name: Test mongo-inmemory-action
    steps:
      - name: Create mongo Docker container
        id: build_mongo_docker
        uses: yog27ray/mongo-inmemory-action@v1.0.3
        with:
          image-version: latest
          port: 27017
      - name: Test mongo connection
        id: test_mongo_connection
        run: "sudo mongo localhost:27017"
```
