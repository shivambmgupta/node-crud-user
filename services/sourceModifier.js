const { APP_CONSTANTS } = require('../constants/constants');

exports.sourceModifier = (req, res, next) => {
    if (req.method === 'POST')
        req.headers['SOURCE'] = APP_CONSTANTS.DEFAULT_SOURCE;
    next();
};
