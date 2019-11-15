const core = require('@actions/core');
const github = require('@actions/github');
const { getReviewAppUrl } = require('./helpers');

const octokit = new github.GitHub(core.getInput('GITHUB_PAT'));

function getGitInfo() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  return {
    branch: process.env.GITHUB_HEAD_REF,
    sha: github.context.payload.after,
    owner,
    repo,
  };
}

function createDeployment() {
  const { repo, owner, sha, branch } = getGitInfo();

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
  const { repo, owner, sha, branch } = getGitInfo();

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
  getGitInfo,
  createDeployment,
  setDeploymentStatus,
};
