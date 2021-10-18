const { stdResponses } = require('../config/config');

const users = [{
    email: "shivam", password: "gupta"
}];

const getPassword = (email) => {
    if (!email) return null;
    for (let i = 0; i < users.length; ++i) {
        if (users[i].email === email) return users[i].password;
    }
    return null;
};

exports.errorHandler = (res, err, response = stdResponses.internalServerError) => {
    // log the error
    const { status, message } = response;
    res.status(status).send(message);
}

exports.validate = ({ email, password }) => {
    const userPassword = getPassword(email);
    if (!userPassword) return stdResponses.notFound;
    // apply password decryption
    if (userPassword === password) return stdResponses.success;
    return stdResponses.forbidden;
};
