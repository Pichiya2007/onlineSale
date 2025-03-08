import { Router } from 'express';
import { purchase } from './invoice.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/purchase',
    [
        validarJWT
    ],
    purchase
)

export default router;