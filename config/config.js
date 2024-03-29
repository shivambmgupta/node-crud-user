// inccase there's some problem in env
const defaulPort = process.env.PORT || 5000;

const stdResponses = {
    success: { status: 200, message: 'OK!' },
    created: { status: 201, message: 'Registered' },
    deleted: { status: 202, message: 'Deleted' },
    badRequest: { status: 400, message: 'Bad request' },
    notFound: { status: 404, messsage: 'Not found' },
    unauthorized: { status: 401, message: 'Unauthorized' },
    forbidden: { status: 403, message: 'Forbidden' },
    notFound: { status: 404, message: 'Resource not found!' },
    notAcceptable: { status: 406, message: 'Not acceptable' },
    deletionFailed: { status: 406, message: 'Deletion failed' },
    internalServerError: { status: 500, message: 'Something went wrong!' },
};

const routes = {
    root: '/',
    login: '/login',
    user: '/user',
    register: '/register',
    delete: '/delete',
    getAll: '/get-all',
    isActive: '/is-active'
};

const activityTime = 60 * 5; // 5 minutes

exports.defaulPort = defaulPort;
exports.stdResponses = stdResponses;
exports.routes = routes;
exports.activityTime = activityTime;
