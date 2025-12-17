import express from 'express';
import { getUser, updateUser, listUsers, deleteUser } from '../controllers/usersController.js';

const router = express.Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
