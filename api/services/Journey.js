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
    },
};
module.exports = _.assign(module.exports, exports, model);