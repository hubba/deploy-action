const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');

try {
  const serviceToDeploy = core.getInput('service');
  
  await exec('gcloud auth configure-docker');
  await exec('cd ../');
  await exec(
    'git clone https://hubba-build:${{ secrets.GITHUB_PAT }}@github.com/hubba/infrastructure-2020.git'
  );
  await exec(`cd ${github.context.repo.name}`);

  await exec('cat ../hubba-infrastructure/scripts/deploy.sh');
} catch (error) {
  core.setFailed(error.message);
}
