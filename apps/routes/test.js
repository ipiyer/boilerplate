'use strict';

module.exports = function(routes) {
    routes.get("", function(req, res) {
        res.send("Hello world");
    });

    return routes;
}