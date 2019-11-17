const core = require('@actions/core');
const infra = require('../infra');

(async () => {
  try {
    await infra.setup();
    const serviceToDeploy = core.getInput('service');

    await infra.run.deleteReviewApp(serviceToDeploy);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
