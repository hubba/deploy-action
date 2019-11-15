function getServiceName(repo) {
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

function getReleaseName(serviceName, branchName) {
  return `${serviceName}-${branchName.replace(/\//g, '-')}`.substring(0, 53);
}

function getReviewAppUrl(repo, branchName) {
  const serviceName = getServiceName(repo);

  const domain = serviceName === 'brands' ? 'brands-qa.hubba.com' : 'hubba.gold';

  if (branchName === 'master') {
    return `https://${domain}`;
  }

  return `https://${getReleaseName(serviceName, branchName)}.${
    serviceName !== 'brands' ? 'qa.' : ''
  }${domain}`;
}

module.exports = {
  getServiceName,
  getReviewAppUrl,
  getReleaseName,
};
