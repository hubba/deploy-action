const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');

(async () => {
  try {
    const serviceToDeploy = core.getInput('service');
    const GITHUB_PAT = core.getInput('GITHUB_PAT')

    await exec('gcloud auth configure-docker --quiet');
    await exec('cd ..');
    await exec(
      `git clone https://hubba-build:${GITHUB_PAT}@github.com/hubba/infrastructure-2020.git`
    );
    await exec(`cd ${github.context.repo.name}`);

    await exec('cat ../hubba-infrastructure/scripts/deploy.sh');
  } catch (error) {
    core.setFailed(error.message);
  }
})();
