import staticFiles from './static.js';

export function handler(event, ctx, callback) {
  const request = event.Records[0].cf.request;

  if (request.method !== 'GET') {
    callback(null, request);
    return;
  }

  let uri = request.uri;
  if (!uri.includes('.') && uri.slice(-1) !== '/') {
    uri += '/';
  }

  if (staticFiles.includes(uri)) {
    request.uri = uri;
    const domainName = request.origin.custom.customHeaders['s3-static-host'][0].value;
    request.origin.custom.domainName = domainName;
    request.origin.custom.path = '';
    request.headers['host'] = [{ key: 'host', value: domainName }];
  }
  else if (uri.startsWith('/upload/')) {
    request.uri = uri.replace('/upload/', '/');
    const domainName = request.origin.custom.customHeaders['s3-content-host'][0].value;
    request.origin.custom.domainName = domainName;
    request.origin.custom.path = '';
    request.headers['host'] = [{ key: 'host', value: domainName }];
  }

  callback(null, request);
}
