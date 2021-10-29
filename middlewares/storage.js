const houseService = require('../services/houseService');



module.exports = () => (req, res, next) => {
    req.storage = {
        ...houseService
    };
    next();
};