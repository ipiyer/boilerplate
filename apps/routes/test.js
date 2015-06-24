'use strict';

module.exports = function(routes) {
    routes.get("", function(req, res) {
        return res.render("index", {});
    });

    return routes;
}