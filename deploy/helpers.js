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

function getReleaseName(serviceName, branch) {
  return `${serviceName}-${branch.replace(/\//g, '-')}`.substring(0, 53);
}

function getReviewAppUrl(repo, branch) {
  const serviceName = getServiceName(repo);

  const domain = serviceName === 'brands' ? 'brands-qa.hubba.com' : 'hubba.gold';

  if (branch === 'master') {
    return `https://${domain}`;
  }

  return `https://${getReleaseName(serviceName, branch)}.${
    serviceName !== 'brands' ? 'qa.' : ''
  }${domain}`;
}

module.exports = {
  getServiceName,
  getReviewAppUrl,
  getReleaseName,
};
