const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const House = require('../models/House');


router.get('/listings', async (req, res) => {
    const houses = await req.storage.getAll();

    res.render('house/listings', { houses });
});

router.get('/create', async (req, res) => {
    res.render('house/create');
});

router.post('/create', async (req, res) => {
    try {
        const houseData = {
            name: req.body.name,
            type: req.body.type,
            year: req.body.year,
            city: req.body.city,
            title: req.body.title,
            homeImage: req.body.homeImage,
            propertyDescription: req.body.propertyDescription,
            availablePieces: req.body.availablePieces,
            rentedHome: [],
            owner: req.user._id
        }

        await req.storage.createHouse(houseData);

        res.redirect('/house/listings');
    } catch (err) {
        // console.log(Object.values(err.errors).map(e => e.properties.message));
        console.log(err.message);
        const ctx = {
            errors: [err.message],
            houseData: {
                name: req.body.name,
                type: req.body.type,
                year: req.body.year,
                city: req.body.city,
                title: req.body.title,
                homeImage: req.body.homeImage,
                propertyDescription: req.body.propertyDescription,
                availablePieces: req.body.availablePieces,
            }

        };
        res.render('house/create', ctx);
    }
});

router.get('/details/:id', isUser(), async (req, res) => {
    const house = await req.storage.getOne(req.params.id);
    const isAuthor = req.user && house.owner == req.user._id;
    let isRented = false;
    if (house.rentedHome.find(x => x._id == req.user._id)) {
        isRented = true;

    }
    res.render('house/details', { house, isAuthor, isRented });
});

router.get('/rent/:id', async (req, res) => {
    try {
        const house = await req.storage.getOne(req.params.id);
        if (!house.rentedHome.find(x => x._id == req.user._id)) {
            await req.storage.rentHouse(req.user._id, req.params.id);
        }
        res.redirect('/house/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
    }
});

router.get('/edit/:id', async (req, res) => {
    const house = await req.storage.getOne(req.params.id);
    const ctx = {
        houseData: {
            _id: house._id,
            name: house.name,
            type: house.type,
            year: house.year,
            city: house.city,
            title: house.title,
            homeImage: house.homeImage,
            propertyDescription: house.propertyDescription,
            availablePieces: house.availablePieces,
        }
    }
    res.render('house/edit', ctx);
});

router.post('/edit/:id', async (req, res) => {
    try {
        const house = await req.storage.getOne(req.params.id);

        const houseData = {
            name: req.body.name,
            type: req.body.type,
            year: req.body.year,
            city: req.body.city,
            homeImage: req.body.homeImage,
            propertyDescription: req.body.propertyDescription,
            availablePieces: req.body.availablePieces,
        }

        const save = await req.storage.editHouse(req.params.id, houseData);
        console.log(save);

        res.redirect('/house/details/' + house._id);
    } catch (err) {
        // console.log(Object.values(err.errors).map(e => e.properties.message));
        console.log(err.message);
        const ctx = {
            errors: [err.message],
            houseData: {
                _id: req.params.id,
                name: req.body.name,
                type: req.body.type,
                year: req.body.year,
                city: req.body.city,
                homeImage: req.body.homeImage,
                propertyDescription: req.body.propertyDescription,
                availablePieces: req.body.availablePieces,
            }

        };
        res.render('house/edit', ctx);
    }
});

router.get('/delete/:id', async (req, res) => {
    const houseId = req.params.id;
    await req.storage.deleteHouse(houseId);
    res.redirect('/house/listings');
});

router.get('/search', async (req, res) => {
    let isPost = false;
    let houses;
    res.render('house/search', {houses, isPost});
});

router.post('/search', async (req, res) => {
    try {
        const houses = await req.storage.getHouseByHousingType(req.body.search);
        let isPost = true;
        console.log(houses)
        res.render('house/search',  {houses, isPost} );


    } catch (err) {

    }
});



module.exports = router;
