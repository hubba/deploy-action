const github = require('@actions/github');

function getEnv() {
  // branch name is GITHUB_HEAD_REF for pull request
  const [owner, repo] = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REPOSITORY.split('/');

  return {
    branch: process.env.GITHUB_REF.replace('refs/heads/', ''),
    sha: github.context.payload.after,
    owner,
    repo,
  };
}

module.exports = getEnv();
