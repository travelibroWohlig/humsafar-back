var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    railsId: {
        type: Number,
        index: true
    },
    name: {
        type: String,
        required: true,
        default: ""
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    startLocation: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: true
    },
    startLocationPic: String,
    isPopular: {
        type: Boolean,
        default: false
    },
    popularRank: {
        type: Number
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    onGoing: {
        type: Boolean,
        default: true
    },
    kindOfJourney: [{
        type: String
    }],
    journeyCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    uniqueId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    post: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
        index: true
    }],
    buddies: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    coverPhoto: String,
    countryVisited: [{
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country',
            index: true
        },
        date: Date,
        counter: Number
    }],
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
        index: true
    }],
    location: {
        lat: String,
        long: String
    },
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    userReview: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
        index: true
    }],
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        index: true
    }],
    landing_page: {
        type: Boolean
    },
    shares_count: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Journey', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getJourney: function (data, callback) {
        data.page = parseInt(data.page);
        var respo = {};
        respo.results = [];
        respo.options = {};
        respo.options.count = 0;
        respo.total = 0;
        var sortObj = {
            postCount: -1,
            likeCount: -1,
            createdAt: -1
        };
        if (data.type) {
            if (data.type === "byLikes") {
                delete sortObj.postCount;
                delete sortObj.createdAt;
            } else if (data.type === "byTime") {
                delete sortObj.postCount;
                delete sortObj.likeCount;
            } else if (data.type === "byPost") {
                delete sortObj.likeCount;
                delete sortObj.createdAt;
            }
        }
        async.parallel([
            function (callback) {
                Journey.aggregate([{
                    $match: {
                        "post.0": {
                            $exists: true
                        },
                        status: true
                    }
                }, {
                    $project: {
                        _id: 1,
                        name: 1,
                        user: 1,
                        urlSlug: 1,
                        likeCount: {
                            $size: {
                                "$ifNull": ["$like", []]
                            }
                        },
                        postCount: {
                            $size: {
                                "$ifNull": ["$post", []]
                            }
                        },
                        startLocation: 1,
                        startTime: 1,
                        createdAt: 1
                    }
                }, {
                    $sort: sortObj
                }, {
                    $skip: (data.page - 1) * 25
                }, {
                    $limit: 25
                }, {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                }, {
                    $unwind: "$user"
                }, {
                    $project: {
                        _id: 1,
                        name: 1,
                        urlSlug: 1,
                        "user._id": 1,
                        "user.name": 1,
                        "user.urlSlug": 1,
                        likeCount: 1,
                        postCount: 1,
                        startLocation: 1,
                        startTime: 1,
                        createdAt: 1
                    }
                }]).exec(function (err, foundJourney) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (foundJourney && foundJourney.length > 0) {
                        respo.results = foundJourney;
                        respo.options.count = foundJourney.length;
                        callback(null, "Done");
                    } else {
                        respo.options.count = foundJourney.length;
                        callback(null, "Done");
                    }
                });
            },
            function (callback) {
                Journey.count({
                    "post.0": {
                        $exists: true
                    },
                    status: true
                }).lean().exec(function (err, foundJourney) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (foundJourney && foundJourney.length > 0) {
                        respo.total = foundJourney;
                        callback(null, "Done");
                    } else {
                        respo.total = 0;
                        callback(null, "Done");
                    }
                });
            }
        ], function (err, done) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, respo);
            }
        });
    },
    editData: function (data, callback) {
        Journey.findOneAndUpdate({
            _id: data._id
        }, {
            $set: {
                isPopular: data.status,
                popularRank: data.popularRank
            }
        }).lean().exec(function (err, updated) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (!_.isEmpty(updated)) {
                callback(null, "Updated");
            } else {
                callback("Journey not found", null);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);