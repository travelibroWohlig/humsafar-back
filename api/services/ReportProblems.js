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
    user: {
    type: Schema.Types.ObjectId,
    ref:"User",
    index:true
    },
    problem: {
        type: String,
        required: true
    },
    device:Schema.Types.Mixed
});

schema.plugin(deepPopulate, {
      populate: { 'user': {
      select: '_id name'
    }
}
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ReportProblems', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"user","user"));
var model = {};
module.exports = _.assign(module.exports, exports, model);