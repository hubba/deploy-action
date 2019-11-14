const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

try {
  const serviceToDeploy = core.getInput('service');
  console.log(`Hello ${serviceToDeploy}!`);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
