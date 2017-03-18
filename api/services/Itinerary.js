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
    itineraryType: {
        type: [String]
    },
    month: {
        type: String
    },
    description: {
        type: String
    },
    year: {
        type: Number
    },
    duration: {
        type: Number
    },
    coverPhoto: String,
    isPopular: {
        type: Boolean,
        default: false
    },
    popularRank: {
        type: Number
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    countryVisited: [{
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country',
            index: true
        },
        date: Date,
        from: {
            type: Date
        },
        to: {
            type: Date
        },
        rating: String,
        duration: Number,
        sequenceNo: Number,
        cityVisited: [{
            city: {
                type: Schema.Types.ObjectId,
                ref: 'City',
                index: true
            },
            from: {
                type: Number
            },
            to: {
                type: Number
            },
            duration: {
                type: Number,
                default: 0
            },
            description: String,
            sequenceNo: Number,
            days: [{
                stay: [{
                    name: String
                }],
                ate: [{
                    name: String
                }],
                mustDo: [{
                    name: String
                }]
            }]
        }]
    }],
    currency: {
        type: String,
        default: ""
    },
    cost: {
        type: Number,
        deafult: 0
    },
    uniqueId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    itineraryBy: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    buddies: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        index: true
    }],
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
        index: true
    }],
    userReview: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
        index: true
    }],
    photos: [{
        type: Schema.Types.ObjectId,
        ref: 'Postphotos',
        index: true
    }],
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Postphotos',
        index: true
    }],
    hashtag: [String],
    status: {
        type: Boolean,
        default: true
    },
    type: {
        type: String
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    pre_planned: {
        type: Boolean
    },
    itinerary_of_week: {
        type: Boolean
    },
    suggested_itinerary: {
        type: Boolean
    },
    landing_page: {
        type: Boolean
    },
    shares_count: Number,
    urlSlug: {
        type: String,
        required: true
    }
});
schema.plugin(deepPopulate, {
  populate: {
    'countryVisited.country': {
      select: '_id name'
    },
    'countryVisited.country.cityVisited.city': {
      select: '_id name'
    }
  }
});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Itinerary', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"countryVisited.country","countryVisited.country.cityVisited.city"));
var model = {};
module.exports = _.assign(module.exports, exports, model);