import { Router } from 'express';
import { purchase, getInvoicesByUser, updateInvoice } from './invoice.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/role-validator.js';

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

router.put(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    updateInvoice
)

export default router;