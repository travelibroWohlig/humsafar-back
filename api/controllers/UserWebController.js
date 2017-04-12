module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getBloggers: function(req, res) {
        if (req.body) {
            if (req.body.page) {
                UserWeb.getBloggers(req.body, res.callback);
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
    editData: function(req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                UserWeb.editData(req.body, res.callback);
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
    deleteUser: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body.accessToken) {
                UserWeb.deleteUser(req.body, res.callback);
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
