const env = require('./env');

function getServiceName() {
  const { repo } = env;

  const services = {
    'prototype-2020': 'backend',
    'prototype-2020-frontend': 'frontend',
    frontend: 'brands',
  };

  if (repo in services) {
    return services[repo];
  }

  return '';
}

function getReleaseName(serviceName) {
  const { branch } = env;
  return `${serviceName}-${branch.replace(/\//g, '-')}`.substring(0, 53);
}

function getReviewAppUrl() {
  const { branch, repo } = env;
  const serviceName = getServiceName(repo);

  const domain = serviceName === 'brands' ? 'brands-qa.hubba.com' : 'hubba.gold';

  if (branch === 'master') {
    return `https://${domain}`;
  }

  return `https://${getReleaseName(serviceName)}.${serviceName !== 'brands' ? 'qa.' : ''}${domain}`;
}

function getBackendUrl(service) {
  const frontendUrl = getReviewAppUrl();
  const serviceName = getReleaseName(service);

  return frontendUrl.replace(serviceName, `${serviceName}-api`);
}

module.exports = {
  getServiceName,
  getReviewAppUrl,
  getReleaseName,
  getBackendUrl,
};
