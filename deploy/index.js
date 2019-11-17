const core = require('@actions/core');
const { exec } = require('@actions/exec');
const { getBackendUrl, getReviewAppUrl } = require('./helpers');
const env = require('../env');
const { createDeployment, setDeploymentStatus } = require('./github');
const infra = require('../infra');

(async () => {
  try {
    const serviceToDeploy = core.getInput('service');

    await infra.setup();

    const deployment = await createDeployment();
    await setDeploymentStatus(deployment, 'in_progress');

    console.log('running deploy script');
    const { branch, sha } = env;
    process.env.BRANCH_NAME = branch;
    process.env.SHORT_SHA = sha;
    await exec('bash', ['../infrastructure-2020/scripts/deploy.sh', serviceToDeploy]);

    await setDeploymentStatus(deployment, 'success');

    core.setOutput('frontendUrl', getReviewAppUrl());
    core.setOutput('backendUrl', getBackendUrl(serviceToDeploy));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
