import express from 'express';

import {
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
