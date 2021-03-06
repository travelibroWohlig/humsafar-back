/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

    /****************************************************************************
     *                                                                           *
     * Express middleware to use for every Sails request. To add custom          *
     * middleware to the mix, add a function to the middleware config object and *
     * add its key to the "order" array. The $custom key is reserved for         *
     * backwards-compatibility with Sails v0.9.x apps that use the               *
     * `customMiddleware` config option.                                         *
     *                                                                           *
     ****************************************************************************/

    middleware: {

        /***************************************************************************
         *                                                                          *
         * The order in which middleware should be run for HTTP request. (the Sails *
         * router is invoked by the "router" middleware below.)                     *
         *                                                                          *
         ***************************************************************************/

        order: [
            'startRequestTimer',
            'cookieParser',
            'session',

            'bodyParser',
            'handleBodyParserError',
            'myRequestLogger',
            'compress',
            'methodOverride',
            'poweredBy',
            '$custom',
            'router',
            'www',
            'favicon',
            '404',
            '500'
        ],

        /****************************************************************************
         *                                                                           *
         * Example custom middleware; logs each request to the console.              *
         *                                                                           *
         ****************************************************************************/

        myRequestLogger: function(req, res, next) {
            req.models = req.path.split("/");
            // console.log(req.models);

            req.model = global[_.upperFirst(req.models[2])];
            if (_.upperFirst(req.models[2]) == "User") {
                req.model = mongoose.models["UserAdmin"];
            }
            req.modelName = _.upperFirst(req.models[2]);


            if (req.path.indexOf("/delete") !== -1) {
                if (req.body && req.body.securePassword) {
                    User.findOne({ backendPassword:{$exists:true}}, { backendPassword: 1 }, function(err, foundUser) {
                        if (err) {
                            res.json({
                                error: err,
                                value: false
                            });
                        } else if (!_.isEmpty(foundUser)) {
                            bcrypt.compare(req.body.securePassword,foundUser.backendPassword, function(err, respo2) {
                                if (respo2 === true) {
                                    next();
                                } else {
                                    res.json({
                                        error: "Invalid Password",
                                        value: false
                                    });
                                }
                            });
                        } else {
                            res.json({
                                error: "Invalid Password",
                                value: false
                            });
                        }
                    }, "Get Google");
                } else {
                    res.json({
                        error: "Invalid Params",
                        value: false
                    });
                }
            } else {
                next();
            }
        }


        /***************************************************************************
         *                                                                          *
         * The body parser that will handle incoming multipart HTTP requests. By    *
         * default as of v0.10, Sails uses                                          *
         * [skipper](http://github.com/balderdashy/skipper). See                    *
         * http://www.senchalabs.org/connect/multipart.html for other options.      *
         *                                                                          *
         ***************************************************************************/

        // bodyParser: require('skipper')

    },

    /***************************************************************************
     *                                                                          *
     * The number of seconds to cache flat files on disk being served by        *
     * Express static middleware (by default, these files are in `.tmp/public`) *
     *                                                                          *
     * The HTTP static cache is only active in a 'production' environment,      *
     * since that's the only time Express will cache flat-files.                *
     *                                                                          *
     ***************************************************************************/

    cache: 31557600000
};
