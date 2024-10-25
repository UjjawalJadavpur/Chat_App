import express from 'express';
import { signUp, login, logout, allUsers } from '../Controller/userController.js';
import secureRoute from '../Middleware/secureRoute.js';

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login",login);
router.post("/logout",logout);
router.get("/allUsers", secureRoute, allUsers);

export default router;
