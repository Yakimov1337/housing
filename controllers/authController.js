const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const {isGuest} = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

router.post(
    '/register',
    isGuest(),
    body('name')
    .custom((value, {req})=>{
        let name = value.split(' ');
        if(name.length==2){
            return true;
        }else {
            return false;
        }
    })
    .withMessage("Full name must be in format: First Last!")
    .bail(),
    body('username')
    .isLength({ min: 5 }).withMessage("Username must be at least 5 characters long!").bail()
    .isAlphanumeric().withMessage('Username may contain only English letters and digits'), //CHANGE ACCORDING TO REQ
body('password')
    .isLength({ min: 4 }).withMessage("Password must be at least 4 characters long!").bail()
    .isAlphanumeric().withMessage('Password may contain only English letters and digits'),
body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords dont match');
        }
        return true;
    }),

    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                //TO DO IMPROVE ERROR MSG
                throw new Error(Object.values(errors).map(e=>e.msg).join('\n'));
            }
            await req.auth.register(req.body.name, req.body.username, req.body.password);
            res.redirect('/'); //TO DO CHANGE REDIRECT

        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    name: req.body.name,
                    username: req.body.username
                }
            }
            res.render('register', ctx);
        }

    }
)

router.get('/login',isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);
        res.redirect('/') //TODO CHANGE REDIRECT IF NEEDED
    } catch(err) {
        console.log(err.message);
        let errors = [err.message];
        if (err.type == 'credential') {
            errors= ['Incorrect username or password!'];
        }
        const ctx = {
            errors,
            userData: {
                username: req.body.username
            }
        }
        res.render('login', ctx);
    }
});


router.get('/logout', (req,res) => {
    req.auth.logout();
    res.redirect('/');
});




module.exports = router;