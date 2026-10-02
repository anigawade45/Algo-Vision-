const express = require('express');
const problemWorkspaceController = require('../controllers/problemWorkspace.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all workspace endpoints
router.use(protect);

router.get('/', problemWorkspaceController.getWorkspace);
router.post('/', problemWorkspaceController.createWorkspace);
router.patch('/', problemWorkspaceController.updateWorkspace);

module.exports = router;
