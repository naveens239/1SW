var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy,//TODO: google oauth2 is being retired, so google plus login should be implemented.
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy    = require('passport-local').Strategy,
    passport         = require('passport'),
    config           = require('./config.js'),
    viewUtil         = require('./view_util');

module.exports = {
    page_routes: function (router) {
        router.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.email']}));
        router.get('/auth/google/callback', passport.authenticate('google', {
            successRedirect: '/auth/success',
            failureRedirect: '/auth/failure'
        }));
        router.get('/auth/facebook', passport.authenticate('facebook'));//TODO: check param display
        router.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect: '/auth/success',
            failureRedirect: '/auth/failure'
        }));

        router.get('/auth/success', function (req, res) {
            console.log('in /auth/success, req.user:' + JSON.stringify(req.user));
            viewUtil.renderPageModule('after_auth', res, {
                state: 'success',
                user : req.user ? JSON.stringify(req.user) : null
            });
        });
        router.get('/auth/failure', function (req, res) {
            console.log('in /auth/failure');
            viewUtil.renderPageModule('after_auth', res, {state: 'failure', user: null});
        });
        router.get('/logout', function (req, res) {
            req.logout();
            /*if (req.session.passport && req.session.passport.user) {
                req.session.passport.user = null;
            }*/
            res.redirect('/');
        });

        router.post('/login', passport.authenticate('local_login', {
            successRedirect: '/loginSuccess',
            failureRedirect: '/loginFailure',
            failureFlash: true
        }));

        router.post('/signup', passport.authenticate('local_signup', {
            successRedirect: '/loginSuccess',
            failureRedirect: '/loginFailure',
            failureFlash: true
        }));

        router.get('/loginFailure', function (req, res, next) {
            res.redirect("/");
        });

        router.get('/loginSuccess', function (req, res, next) {
            console.log('in loginSuccess, user:' + req.user);
            console.log('req.session.passport.user:' + JSON.stringify(req.session.passport.user));
            //req.session.passport.user.oauth_id = req.session.passport.user.username;
            res.redirect("/vendor_profile");
        });
    }
}

passport.use(new FacebookStrategy({
    clientID    : config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret,
    callbackURL : config.oauth.facebook.callbackURL
}, callback));

passport.use(new GoogleStrategy({
    clientID    : config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret,
    callbackURL : config.oauth.google.callbackURL
}, callback));

function callback(accessToken, refreshToken, profile, done) {
    console.log('-------------------------------------------------------------------');
    console.log('[accessToken:', accessToken, ']\n[refreshToken:', refreshToken, ']\n');//'[profile:', profile, ']');
    console.log('-------------------------------------------------------------------');
    config.db.getVendorAccount(profile.id, function (err, user) {
        console.log('err:' + err);
        console.log('user:' + user);
        if (err) {
            console.log('in callback err:' + err);
            return done(err);
        }
        if (user != null) {
            console.log('in callback found user:' + user);
            return done(null, user);
        }
        config.db.createVendorAccount({
                oauth_id: profile.id,
                name    : profile.displayName,
                created : Date.now(),
                json    : profile._json
            },
            function (err, insertedUser) {
                console.log('inserted user:' + insertedUser);
                return done(err, insertedUser);
            });

    });
}

passport.use('local_login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, callbackLocalLogin));

passport.use('local_signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, callbackLocalSignUp));

function callbackLocalLogin(username, password, done) {
    config.db.getVendorAccount(username, function (err, user) {
        console.log('err:' + err);
        console.log('user:' + user);
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        if (user.password != password) {
            return done(null, false, {message: 'Incorrect password.'});
        }
        else {
            return done(null, user);
        }
    });
}

function callbackLocalSignUp(username, password, done) {
    config.db.getVendorAccount(username, function (err, user) {
        console.log('err:' + err);
        console.log('user:' + user);
        if (err) {
            return done(err, user);
        }
        if (user != null) {
            return done(null, false, {message: 'User already signed up.'});
        }
        //return done(new Error("User exists"), false);
        config.db.createVendorAccount({
                oauth_id      : username,
                password      : password,
                is_local_login: true,
                created       : Date.now()
            },
            function (err, insertedUser) {
                console.log('inserted user:' + insertedUser);
                return done(err, insertedUser);
            });
    });
}

//serialize and deserialize
passport.serializeUser(function (user, done) {
    console.log('serializeUser: ' + user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('deserializeUser: ' + user);
    done(null, user);
    /*config.db.getVendorAccount(oauth_id, function (err, user) {
     console.log(user);
     if (!err) {done(null, user);}
     else {done(err, null);}
     });*/
});
