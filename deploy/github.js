const core = require('@actions/core');

const octokit = new github.GitHub(core.getInput('GITHUB_PAT'));

function getGitInfo() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  return {
    branchName: process.env.GITHUB_HEAD_REF,
    sha: github.context.payload.after,
    owner,
    repo,
  };
}

function createDeployment() {
  const { repo, owner, sha } = getGitInfo();

  console.log('creating github deployment');
  return octokit.repos.createDeployment({
    ref: sha,
    repo,
    owner,
    environment: branchName === 'master' ? 'production' : branchName,
    transient_environment: branchName !== 'master',
    auto_merge: false,
    required_contexts: [],
    mediaType: {
      previews: ['ant-man'],
    },
  });
}

function setDeploymentStatus(deployment, status) {
  const { repo, owner, sha } = getGitInfo();

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
  });
}

module.exports = {
  getGitInfo,
  createDeployment,
  setDeploymentStatus,
};
