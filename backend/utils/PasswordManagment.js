const crypto = require('crypto');

module.exports = {
    HashMyPassword : (data) => {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}