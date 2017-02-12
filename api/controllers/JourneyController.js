module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    editData: function (req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                Journey.editData(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Invalid Params"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getJourney: function (req, res) {
        if (req.body) {
            if (req.body.pagenumber) {
                Journey.getJourney(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Invalid Params"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);