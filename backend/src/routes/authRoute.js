import express from 'express';
import {signUp, signIn} from '../controllers/authController.js'

const router = express.Router(); // Tao ra mot Router moi

router.post("/signup", signUp);

router.post("/signin", signIn);

export default router;