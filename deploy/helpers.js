const { getGitInfo } = require('./github');

function getServiceName() {
  const { repo } = getGitInfo();

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
  const { branch } = getGitInfo();
  return `${serviceName}-${branch.replace(/\//g, '-')}`.substring(0, 53);
}

function getReviewAppUrl() {
  const { branch, repo } = getGitInfo();
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
