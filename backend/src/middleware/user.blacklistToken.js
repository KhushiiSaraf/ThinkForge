const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token : {type: String, required: true},
    timestamp : {type: Date, default: Date.now, expires: '24h'} // token will be automatically removed after 24 hours
});

const blacklistTokenModel = mongoose.model('BlacklistToken', blacklistTokenSchema);

module.exports = blacklistTokenModel;