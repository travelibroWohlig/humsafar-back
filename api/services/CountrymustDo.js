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
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        index: true,
        key: "mustDo"
    },
    mainPhoto: {
        type: String
    },
    imageCredit: {
        type: String
    },
    sequenceNo: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CountrymustDo', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'mustDo', 'mustDo'));
var model = {};
module.exports = _.assign(module.exports, exports, model);