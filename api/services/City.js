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
    name: {
        type: String,
        required: true
    },
    UTC: {
        type: Date
    },
    sequenceNo: Number,
    weather: String,
    temperature: String,
    description: String,
    cityCoverPhoto: String,
    cityOTGCoverPhoto: String,
    cityDisplayPhoto: String,
    cityItineraryPhoto: String,
    bestMonth: String,
    bestWeather: String,
    bestSeason: String,
    country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        index: true,
        key: "city"
    },
    mustDo: [{
        type: Schema.Types.ObjectId,
        ref: "Mustdocity",
        index: true
    }],
    hotel: [{
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        index: true
    }],
    restaurant: [{
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        index: true
    }],
    googlePlaceId: String,
    sequenceNo: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('City', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);