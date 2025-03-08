import { Router } from 'express';
import { purchase, getInvoicesByUser } from './invoice.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/purchase',
    [
        validarJWT
    ],
    purchase
)

router.get(
    '/',
    [
        validarJWT
    ],
    getInvoicesByUser
)

export default router;