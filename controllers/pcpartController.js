var PcPart = require('../models/pcpart');
var Category = require("../models/category");
var Manufacturer = require('../models/manufacturer');

var async = require("async");

// Display list of all Pcparts.
exports.pcpart_list = function(req, res, next) {
    
    PcPart.find()
        .sort({name : 1})
        .exec(function (err, list_pcparts) {
            if(err) { return next(err); }
            
            res.render("pcpart_list", { title: "PC parts List", pcpart_list: list_pcparts });
        });
};

// Display detail page for a specific Pcpart.
exports.pcpart_detail = function(req, res, next) {
    
    async.parallel({
        pcpart: function(callback) {
            PcPart.findById(req.params.id)
                .populate("manufacturer")
                .populate("category")
                .exec(callback);
        },
    },
        function(err, results) {
            if(err) { return next(err) }

            if(results.pcpart == null) {
                var err = new Error("Part not found")
                err.status = 404
                return next(err)
            }

            res.render("pcpart_detail", {
                title: results.pcpart.title,
                pcpart: results.pcpart,
            })
        }
    )
};

// Display Pcpart create form on GET.
exports.pcpart_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart create GET');
};

// Handle Pcpart create on POST.
exports.pcpart_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart create POST');
};

// Display Pcpart delete form on GET.
exports.pcpart_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart delete GET');
};

// Handle Pcpart delete on POST.
exports.pcpart_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart delete POST');
};

// Display Pcpart update form on GET.
exports.pcpart_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart update GET');
};

// Handle Pcpart update on POST.
exports.pcpart_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart update POST');
};