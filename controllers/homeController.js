const router = require('express').Router();

router.get('/', async (req, res) => {
    const houses = await req.storage.getTopListings();
    res.render('home',{houses});
});

module.exports = router;