const bcrypt = require('bcrypt');
const { errorHandler } = require('../util/common');
const { stdResponses } = require('../config/config');
const { Users } = require('../model/user');
const { ActiveUsers } = require('../model/activeUser');
const { config } = require('dotenv');
const { APP_CONSTANTS, ERROR_MESSAGES } = require('../constants/constants');
config();

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return errorHandler(
                res,
                { message: ERROR_MESSAGES.INVALID_REQUEST },
                stdResponses.badRequest
            );
        }

        // apply other validations
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const encryptedPassword = await bcrypt.hash(password, salt);
        new Users({ email, password: encryptedPassword })
            .save((err, user) => {
                return err
                    ? errorHandler(res, err, stdResponses.notAcceptable)
                    : res.status(stdResponses.created.status).send(stdResponses.created.message);
            });
    } catch (err) {
        errorHandler(res, err);
    }
};

exports.loginHandler = (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password)
            return errorHandler(res, {}, stdResponses.badRequest);

        // validate inputs
        Users.findOne({ email }, async (err, user) => {
            if (err || !user)
                return errorHandler(res, { message: ERROR_MESSAGES.INVALID_REQUEST }, stdResponses.badRequest);
            if (!await bcrypt.compare(password, user.password))
                return errorHandler(res, {}, stdResponses.unauthorized);
            const { success: { status, message } } = stdResponses;
            ActiveUsers.findOneAndUpdate(
                { email: email.toString() },
                { loginTime: Date.now() },
                {
                    new: true,
                    upsert: true
                }
            ).exec();
            res.status(status).send(message);
        })
    } catch (err) {
        errorHandler(res, err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password)
            return errorHandler(res, {}, stdResponses.badRequest);

        // apply other validations
        Users.findOne({ email }, async (err, user) => {
            if (err || !user)
                return errorHandler(res, { message: ERROR_MESSAGES.INVALID_REQUEST }, stdResponses.badRequest);
            if (!await bcrypt.compare(password, user.password))
                return errorHandler(res, {}, stdResponses.unauthorized);
            await ActiveUsers.deleteOne({ email: email.toString() });
            Users.deleteOne({ email }, async (err, { deletedCount }) => {
                if (!err && deletedCount)
                    return res.status(stdResponses.deleted.status).send(stdResponses.deleted.message)
                return errorHandler(res, err, stdResponses.deletionFailed);
            });
        });
    } catch (err) {
        errorHandler(res, err);
    }
};

exports.getAllUsers = (req, res) => {
    try {
        // validate admin credentials
        Users
            .find({})
            .select({ "email": 1, "_id": 1 })
            .exec((err, data) => {
                if (err)
                   return errorHandler(res, err, stdResponses.badRequest);
                res.status(stdResponses.success.status).send(data);
            })
    } catch (err) {
        errorHandler(res, err);
    }
};

exports.isUserActive = async (req, res) => {
    try {
        let { email } = req.query || {};
        if (!email) {
            return errorHandler(
                res,
                { message: ERROR_MESSAGES.INVALID_QUERY },
                stdResponses.badRequest
            );
        }
        email = email.toString();
        ActiveUsers.findOne({ email }, (err, data) => {
            if (err)
                return errorHandler(res, err, stdResponses.badRequest);
            if (!data) {
                const { notFound: { message } } = stdResponses;
                return errorHandler(res, { message }, stdResponses.notFound);
            }
            return res.status(200).send(APP_CONSTANTS.FOUND);
        });
    } catch (err) {
        errorHandler(res, err);
    }
};
