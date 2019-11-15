module.exports.getReviewAppUrl = (repo, branchName) => {
  const serviceName = getServiceName(repo);

  const domain = serviceName === 'brands' ? 'brands-qa.hubba.com' : 'hubba.gold';

  if (branchName === 'master') {
    return `https://${domain}`;
  }

  return `https://${getReleaseName(serviceName, branchName)}.${
    serviceName !== 'brands' ? 'qa.' : ''
  }${domain}`;
};

module.exports.getReleaseName = (serviceName, branchName) => {
  return `${serviceName}-${branchName.replace(/\//g, '-')}`.substring(0, 53);
};
