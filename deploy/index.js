const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const path = require('path');

(async () => {
  try {
    const serviceToDeploy = core.getInput('service');
    const GITHUB_PAT = core.getInput('GITHUB_PAT');
    const INFRA_PATH = path.resolve(process.cwd(), '../');

    console.log('configuring docker');
    await exec('gcloud auth configure-docker --quiet');

    console.log('cloning infra');
    await exec(`git clone https://hubba-build:${GITHUB_PAT}@github.com/hubba/infrastructure-2020.git`, [], {
      cwd: INFRA_PATH,
    });

    console.log('downloading helm');
    await exec('curl', [
      '-o',
      'get_helm.sh',
      'https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get',
    ]);

    console.log('installing helm');
    await exec('chmod +x get_helm.sh');
    await exec('./get_helm.sh -v v3.0.0-beta.5');

    console.log('running deploy script');
    process.env.BRANCH_NAME = github.context.ref;
    process.env.SHORT_SHA = github.context.sha;

    await exec('bash', ['scripts/deploy.sh', serviceToDeploy], { cwd: INFRA_PATH });
  } catch (error) {
    core.setFailed(error.message);
  }
})();
