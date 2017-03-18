const Authentication = require('./controllers/aurhentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function(app) {
    app.get('/', requireAuth, function(req, res) {
        res.send({hi: 'there'});
    });
    app.post('/sign-in', requireSignIn, Authentication.signIn);
    app.post('/sign-up',Authentication.signUp);
};