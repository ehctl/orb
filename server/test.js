var crypto = require('crypto');
var hash = crypto.createHash('sha256').update('tl').digest('base64');
console.log(hash);