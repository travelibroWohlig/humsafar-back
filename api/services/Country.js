var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
        railsId: Number,
    railsName: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    countryCode: String,
    UTC: {
        type: Date
    },
    sequenceNo: Number,
    capital: String,
    currency: String,
    weather: String,
    temperature: String,
    flag: String,
    countryCoverPhoto: String,
    countryItineraryBanner: String,
    featuredCities: [{
        type: Schema.Types.ObjectId,
        ref: "City",
        index: true
    }],
    bestTime: String,
    city: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "City",
            index: true
        }],
        index: true
    },
    mustDo: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Mustdocountry",
            index: true
        }],
        index: true
    },
    sequenceNo: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Countries', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'Countries', 'Countries'));
var model = {};
module.exports = _.assign(module.exports, exports, model);