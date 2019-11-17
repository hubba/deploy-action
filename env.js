const github = require('@actions/github');

function getEnv() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  // branch name is GITHUB_HEAD_REF for pull request
  return {
    branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF.replace('refs/heads/', ''),
    sha: github.context.payload.after,
    owner,
    repo,
  };
}

module.exports = getEnv();
