const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const upload = require('../upload');

router.get('/', menuController.getAllMenuItems);
router.post('/', upload.single('image'), menuController.createMenuItem);

module.exports = router;
