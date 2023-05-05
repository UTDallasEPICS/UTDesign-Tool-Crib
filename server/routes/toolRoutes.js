const express = require('express');
const router = express.Router();
const {getTools, setTools, deleteTools, exportTools} = require('../controllers/toolController');

// available to admin only
router.get('/', getTools);
router.post('/', setTools);
router.delete('/:id', deleteTools);
// router.post('/', exportTools)

module.exports = router;