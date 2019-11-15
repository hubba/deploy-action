const core = require('@actions/core');
const { exec } = require('@actions/exec');
const { getBackendUrl, getReviewAppUrl } = require('./helpers');
const path = require('path');
const env = require('./env');
const { createDeployment, setDeploymentStatus } = require('./github');

(async () => {
  try {
    const serviceToDeploy = core.getInput('service');
    const GITHUB_PAT = core.getInput('GITHUB_PAT');

    console.log('cloning infra');
    await exec(`git clone https://hubba-build:${GITHUB_PAT}@github.com/hubba/infrastructure-2020.git`, [], {
      cwd: path.resolve(process.cwd(), '../'),
    });

    await exec('git checkout actions', [], { cwd: path.resolve(process.cwd(), '../infrastructure-2020') });

    console.log('downloading helm');
    await exec('curl', [
      '-o',
      'get_helm.sh',
      'https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get',
    ]);

    console.log('installing helm');
    await exec('chmod +x get_helm.sh');
    await exec('./get_helm.sh -v v3.0.0');

    const deployment = await createDeployment();
    await setDeploymentStatus(deployment, 'in_progress');

    // console.log('running deploy script');
    // const { branch, sha, repo } = env;
    // process.env.BRANCH_NAME = branch;
    // process.env.SHORT_SHA = sha;
    // await exec('bash', ['../infrastructure-2020/scripts/deploy.sh', serviceToDeploy]);

    await setDeploymentStatus(deployment, 'success');

    core.setOutput('frontendUrl', getReviewAppUrl());
    core.setOutput('backendUrl', getBackendUrl(serviceToDeploy));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
