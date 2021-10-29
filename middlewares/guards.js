function isUser() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redicrect('/auth/login');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.redicrect('/auth/login');
        }
    };
}

module.exports = {
    isUser,
    isGuest
}