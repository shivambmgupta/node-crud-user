const express = require('express');
const { routes } = require('../config/config');
const {
    loginHandler,
    register,
    deleteUser,
    getAllUsers,
    whoAmI
} = require('../controllers/userController');

const router = express.Router();

router.post(routes.login, loginHandler);
router.post(routes.register, register);
router.post(routes.delete, deleteUser);
router.get(routes.getAll, getAllUsers);
router.get(routes.whoAmI, whoAmI);

exports.router = router;
