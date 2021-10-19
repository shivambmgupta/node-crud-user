const { stdResponses } = require('../config/config');

exports.errorHandler = (res, err, response = stdResponses.internalServerError) => {
    // log the error
    const { status, message } = response;
    res.status(status).send(message);
};
