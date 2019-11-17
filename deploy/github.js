const core = require('@actions/core');
const github = require('@actions/github');
const env = require('../env');
const { getReviewAppUrl } = require('./helpers');

const octokit = new github.GitHub(core.getInput('GITHUB_PAT'));

function createDeployment() {
  const { repo, owner, sha, branch } = env;

  console.log('creating github deployment');
  return octokit.repos.createDeployment({
    ref: sha,
    repo,
    owner,
    environment: branch === 'master' ? 'production' : branch,
    transient_environment: branch !== 'master',
    auto_merge: false,
    required_contexts: [],
    mediaType: {
      previews: ['ant-man'],
    },
  });
}

function setDeploymentStatus(deployment, status) {
  const { repo, owner, sha } = env;

  console.log(`setting deployment status to ${status}`);
  return octokit.repos.createDeploymentStatus({
    repo,
    owner,
    sha,
    deployment_id: deployment.data.id,
    state: status,
    mediaType: {
      previews: ['ant-man', 'flash'],
    },
    environment_url: getReviewAppUrl()
  });
}

module.exports = {
  createDeployment,
  setDeploymentStatus,
};
