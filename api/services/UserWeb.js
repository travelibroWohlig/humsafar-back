var schema = new Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true
    },
    isBlogger: {
        type: Boolean,
        default: false
    },
    isPhotographer: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    forgotpassword: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "public"
    },
    facebookID: {
        type: String,
        default: ""
    },
    googleID: {
        type: String,
        default: ""
    },
    homeCity: {
        type: String,
        default: ""
    },
    homeCountry: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        index: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    dob: {
        type: Date
    },
    accessToken: {
        type: String,
        index: true,
        select: false
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    popularRank: {
        type: Number
    },
    travelConfig: {
        kindOfHoliday: {
            type: [String],
            default: []
        },
        usuallyGo: {
            type: [String],
            default: []
        },
        preferToTravel: {
            type: [String],
            default: []
        },
        holidayType: {
            type: [String],
            default: []
        }
    },
    countriesVisited: [{
        countryId: {
            type: Schema.Types.ObjectId,
            ref: 'Country',
            index: true
        },
        visited: [{
            year: Number,
            times: Number
        }]
    }],
    provider: {
        type: String
    },
    bucketList: [{
        type: Schema.Types.ObjectId,
        ref: 'Country',
        index: true
    }],
    userBadgeName: {
        type: String,
        default: "newbie"
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    deviceId: [String],
    UTC: {
        type: Date
    },
    railsId: {
        type: Number,
        index: true
    },
    alreadyLoggedIn: {
        type: Boolean,
        default: false
    },
    localPost: {
        type: Boolean,
        default: false
    },
    travelPost: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: "User"
    },
    profession: {
        type: String
    },
    favorite_city: {
        type: String
    },
    favorite_country: {
        type: String
    },
    dream_destination: {
        type: String
    },
    deactivate_account: {
        type: Boolean,
        default: false
    },
    deactivation_reason: {
        type: String
    },
    blog_link: {
        type: String
    },
    address: {
        type: String
    },
    company_name: {
        type: String
    },
    specializations: {
        type: String
    },
    website: {
        type: String
    },
    confirmed_at: {
        type: Date
    },
    unsubscribed: {
        type: Boolean,
        default: false
    },
    access_token: {
        type: String,
        select: false
    },
    data_upload: {
        type: String,
        enum: ["wifi&cellular", "wifi"]
    }
});
schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {
    getBloggers: function(data, callback) {
        data.page = parseInt(data.page);
        var respo = {};
        respo.results = [];
        respo.options = {};
        respo.options.count = 0;
        respo.total = 0;
        async.parallel([
            function(callback) {
                UserWeb.find({
                    isBlogger: true
                }).sort({
                    name: 1
                }).skip((data.page - 1) * 25).limit(25).lean().exec(function(err, foundUser) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (foundUser && foundUser.length > 0) {
                        respo.results = foundUser;
                        respo.options.count = foundUser.length;
                        callback(null, foundUser);
                    } else {
                        respo.options.count = foundUser.length;
                        callback(null, []);
                    }
                });
            },
            function(callback) {
                UserWeb.count({
                    isBlogger: true
                }).lean().exec(function(err, foundUser) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (foundUser > 0) {
                        respo.total = foundUser;
                        callback(null, "Done");
                    } else {
                        respo.total = 0;
                        callback(null, "Done");
                    }
                });
            }
        ], function(err, done) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, respo);
            }
        });
    },
    editData: function(data, callback) {
        UserWeb.findOneAndUpdate({
            _id: data._id
        }, {
            $set: {
                isPopular: data.status,
                popularRank: data.popularRank
            }
        }).lean().exec(function(err, updated) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (!_.isEmpty(updated)) {
                callback(null, "Updated");
            } else {
                callback("User not found", null);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);
