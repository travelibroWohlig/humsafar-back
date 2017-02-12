var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
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
    isPopular: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: Date
    },
    urlSlug: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Journey', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getJourney: function (data, callback) {
        data.pagenumber = parseInt(data.pagenumber);
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
            $skip: (data.pagenumber - 1) * 25
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
                callback(null, foundJourney);
            } else {
                callback(null, []);
            }
        });
    },
    editData: function (data, callback) {
        Journey.findOneAndUpdate({
            _id: data._id
        }, {
            $set: {
                isPopular: true
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