const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const path = require('path');
const helpers = require('./helpers');

(async () => {
  try {
    const serviceToDeploy = core.getInput('service');
    const GITHUB_PAT = core.getInput('GITHUB_PAT');
    const octokit = new github.GitHub(GITHUB_PAT);
    const branchName = process.env.GITHUB_HEAD_REF;
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const sha = github.context.payload.after;

    // console.log('configuring docker');
    // await exec('gcloud auth configure-docker --quiet');

    // console.log('cloning infra');
    // await exec(`git clone https://hubba-build:${GITHUB_PAT}@github.com/hubba/infrastructure-2020.git`, [], {
    //   cwd: path.resolve(process.cwd(), '../'),
    // });

    // await exec('git checkout actions', [], { cwd: path.resolve(process.cwd(), '../infrastructure-2020') });

    // console.log('downloading helm');
    // await exec('curl', [
    //   '-o',
    //   'get_helm.sh',
    //   'https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get',
    // ]);

    // console.log('installing helm');
    // await exec('chmod +x get_helm.sh');
    // await exec('./get_helm.sh -v v3.0.0');

    console.log(sha, owner, repo)

    console.log('creating github deployment');
    const deployment = await octokit.repos.createDeployment({
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
    
    console.log(deployment.data)

    console.log('creating deployment status');
    await octokit.repos.createDeploymentStatus({
      repo,
      owner,
      sha,
      deployment_id: deployment.data.id,
      state: 'in_progress',
      mediaType: {
        previews: ['ant-man', 'flash'],
      },
    });

    // console.log('running deploy script');
    // process.env.BRANCH_NAME = branchName;
    // process.env.SHORT_SHA = sha;
    // await exec('bash', ['../infrastructure-2020/scripts/deploy.sh', serviceToDeploy]);

    console.log('updating deployment status');
    await octokit.repos.createDeploymentStatus({
      repo,
      owner,
      sha,
      deployment_id: deployment.data.id,
      state: 'success',
      environment_url: helpers.getReviewAppUrl(repo, branchName),
      mediaType: {
        previews: ['ant-man', 'flash'],
      },
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();
