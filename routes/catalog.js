var express = require('express');
var router = express.Router();

// Require controller modules.
var category_controller = require('../controllers/categoryController');
var manufacturer_controller = require('../controllers/manufacturerController');
var pcpart_controller = require('../controllers/pcpartController');

/// CATEGORIES ROUTES ///

// GET catalog home page.
router.get('/', category_controller.index);

// GET request for creating a category. NOTE This must come before routes that display category (uses id).
router.get('/category/create', category_controller.category_create_get);

// POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category items.
router.get('/categories', category_controller.category_list);

/// MANUFACTURER ROUTES ///

// GET request for creating manufacturer. NOTE This must come before route for id (i.e. display manufacturer).
router.get('/manufacturer/create', manufacturer_controller.manufacturer_create_get);

// POST request for creating manufacturer.
router.post('/manufacturer/create', manufacturer_controller.manufacturer_create_post);

// GET request to delete manufacturer.
router.get('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_get);

// POST request to delete manufacturer.
router.post('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_post);

// GET request to update manufacturer.
router.get('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_get);

// POST request to update manufacturer.
router.post('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_post);

// GET request for one manufacturer.
router.get('/manufacturer/:id', manufacturer_controller.manufacturer_detail);

// GET request for list of all manufacturers.
router.get('/manufacturers', manufacturer_controller.manufacturer_list);

/// PCPART ROUTES ///

// GET request for creating pcpart. NOTE This must come before route for id (i.e. display pcpart).
router.get('/pcpart/create', pcpart_controller.pcpart_create_get);

// POST request for creating pcpart.
router.post('/pcpart/create', pcpart_controller.pcpart_create_post);

// GET request to delete pcpart.
router.get('/pcpart/:id/delete', pcpart_controller.pcpart_delete_get);

// POST request to delete pcpart.
router.post('/pcpart/:id/delete', pcpart_controller.pcpart_delete_post);

// GET request to update pcpart.
router.get('/pcpart/:id/update', pcpart_controller.pcpart_update_get);

// POST request to update pcpart.
router.post('/pcpart/:id/update', pcpart_controller.pcpart_update_post);

// GET request for one pcpart.
router.get('/pcpart/:id', pcpart_controller.pcpart_detail);

// GET request for list of all pcparts.
router.get('/pcparts', pcpart_controller.pcpart_list);

module.exports = router;