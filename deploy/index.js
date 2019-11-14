const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const path = require('path');

(async () => {
  try {
    const serviceToDeploy = core.getInput('service');
    const GITHUB_PAT = core.getInput('GITHUB_PAT');

    await exec('gcloud auth configure-docker --quiet');
    await exec(`git clone https://hubba-build:${GITHUB_PAT}@github.com/hubba/infrastructure-2020.git`, [], {
      cwd: path.resolve(process.cwd, '../')
    });
    console.log(process.cwd)
    await exec('cat ../hubba-infrastructure/scripts/deploy.sh');
  } catch (error) {
    core.setFailed(error.message);
  }
})();
