const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const path = require('path');

(async () => {
  try {
    const serviceToDeploy = core.getInput('service');
    const GITHUB_PAT = core.getInput('GITHUB_PAT');

    console.log('configure docker');
    await exec('gcloud auth configure-docker --quiet');

    console.log('clone infra');
    await exec(`git clone https://hubba-build:${GITHUB_PAT}@github.com/hubba/infrastructure-2020.git`, [], {
      cwd: path.resolve(process.cwd(), '../'),
    });

    console.log('run deploy script');

    process.env.BRANCH_NAME = github.context.ref;
    process.env.SHORT_SHA = github.context.sha;

    await exec('bash ../infrastructure-2020/scripts/deploy.sh backend');
  } catch (error) {
    core.setFailed(error.message);
  }
})();
