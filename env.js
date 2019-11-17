const github = require('@actions/github');

function getEnv() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  return {
    branch: process.env.GITHUB_REF.replace('refs/heads/', ''),
    sha: github.context.payload.after,
    owner,
    repo,
  };
}

module.exports = getEnv();
