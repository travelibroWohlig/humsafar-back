global["GoogleKey"] = "AIzaSyDMgwXi6D38isibUfShc9C2mJyaHZZ2LpE";
global["GoogleclientId"] = "258757721754-hqc2vtr2akmkqi83s0cmaql4rdc9868o.apps.googleusercontent.com";
global["GoogleclientSecret"] = "032IFzxHW2_VVu0nWb15mwoQ";

passport.use(new GoogleStrategy({
        clientId: GoogleclientId,
        clientSecret: GoogleclientSecret,
        callbackURL: global["env"].realHost + "/api/user/loginGoogle",
        accessType: "offline"
    },
    function (accessToken, refreshToken, profile, cb) {
        profile.googleAccessToken = accessToken;
        profile.googleRefreshToken = refreshToken;
        return cb(profile);
    }
));
