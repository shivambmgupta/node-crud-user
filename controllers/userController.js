const bcrypt = require('bcrypt');
const { errorHandler } = require('../util/common');
const { stdResponses, cookieOption } = require('../config/config');
const { Users } = require('../model/user');
const { config } = require('dotenv');
const { APP_CONSTANTS } = require('../constants/constants');
config();

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password)
            return errorHandler(res, {}, stdResponses.badRequest);

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
                return errorHandler(res, err ?? {}, stdResponses.badRequest);
            if (!await bcrypt.compare(password, user.password))
                return errorHandler(res, {}, stdResponses.unauthorized);
            const { success: { status, message } } = stdResponses;
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
                return errorHandler(res, err ?? {}, stdResponses.badRequest);
            if (!await bcrypt.compare(password, user.password))
                return errorHandler(res, {}, stdResponses.unauthorized)
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
                errorHandler(res, err, stdResponses.badRequest);
                res.status(stdResponses.success.status).send(data);
            })
    } catch (err) {
        errorHandler(res, err);
    }
};

exports.whoAmI = (req, res) => {
    try {
        console.log(req.cookies[APP_CONSTANTS.WHO_AM_I]);
    } catch (err) {
        errorHandler(res, err);
    }
};
