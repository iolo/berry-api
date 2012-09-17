/*jslint node:true, white:true, nomen:true */
'use strict';

/**
 * 인증 처리 미들웨어.
 *
 * 인증 통과하면 이후 미들웨어에서는
 * `req.user`를 통해 api user 객체를,
 * `req.remoteUser`를 통해 api key(username)를 참조할 수 있음.
 * ```
 * app.use(berry.middle.auth({
 *    path: /secure/,
 *    scheme:'Basic',
 *    realm:'my realm',
 *    users: { 'apikey': { secret: 'secret', ...}, ... });
 * ```
 *
 * @param opts.path {RegExp}
 * @param opts.scheme {string} 인증 스킴. 'Basic' 또는 'Digest'. 현재는 'Basic'만 지원.
 * @param opts.realm {string} 렐름 이름
 * @param opts.users {object<string,object>} 사용자 db. 지정하지 않거나, 비어있으면 인증 안함.
 */
module.exports = function(opts) {
  var path = opts.path,
      scheme = opts.scheme || 'Basic',
      realm = opts.realm || 'Authorization Required',
      users = opts.users,
      authenticateHeader = scheme + ' realm="' + realm + '"';

  if (!users) {
    return function (req, res, next) {
      next();
    };
  }

  return function (req, res, next) {
    var authorization, tokens, credentials, username, password, user;

    console.log('auth=', req.url);

    if (path && !path.test(req.url)) {
        next();
        return;
    }

    if (req.user) {
      next();
      return;
    }

    authorization = req.headers.authorization;

    if (!authorization) {
      res.setHeader('WWW-Authenticate', authenticateHeader);
      throw {status:401, message:'Unauthorized'};
      return;
    }

    tokens = authorization.split(' ');
    if (tokens[0] !== scheme) {
      throw {status:400, message: 'Unsupported Scheme:' + tokens[0]};
    }

    credentials = new Buffer(tokens[1], 'base64').toString().split(':');
    username = credentials[0];
    password = credentials[1];

    user = users[username];
    if (user && password === user.secret) {
      req.user = user;
      req.remoteUser = username;
      next();
    } else {
      res.setHeader('WWW-Authenticate', authenticateHeader);
      throw {status:401, message:'Unauthorized'};
    }
  };
};
