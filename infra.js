const core = require('@actions/core');
const { exec } = require('@actions/exec');
const path = require('path');
const env = require('./env');
const { getReleaseName } = require('./deploy/helpers');

const { branch, sha } = env;
process.env.BRANCH_NAME = branch;
process.env.SHORT_SHA = sha;
const infraFolderPath = path.resolve(process.cwd(), '../infrastructure-2020');

module.exports.setup = async () => {
  const GITHUB_PAT = core.getInput('GITHUB_PAT');

  console.log('cloning infra');
  await exec(`git clone https://hubba-build:${GITHUB_PAT}@github.com/hubba/infrastructure-2020.git`, [], {
    cwd: path.resolve(process.cwd(), '../'),
  });

  await exec('git checkout actions', [], { cwd: infraFolderPath });

  console.log('downloading helm');
  await exec('curl', [
    '-o',
    'get_helm.sh',
    'https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get',
  ]);

  console.log('installing helm');
  await exec('chmod +x get_helm.sh');
  await exec('./get_helm.sh -v v3.0.0');
};

module.exports.run = {
  deploy(serviceToDeploy) {
    return exec('bash', [`${infraFolderPath}/scripts/deploy.sh`, serviceToDeploy]);
  },

  async deleteReviewApp(serviceToDeploy) {
    await exec('bash', [`${infraFolderPath}/scripts/connect-cluster.sh`, 'qa']);
    await exec('helm', ['delete', getReleaseName(serviceToDeploy)]);
  },
};
