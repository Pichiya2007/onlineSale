import { Router } from 'express';
import { check } from 'express-validator';
import { addProduct, getProducts, searchProduct, getOutOfStockProducts } from './product.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/role-validator.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        validarCampos,
        check('category', 'No es una categoría válida.').isMongoId(),
        tieneRole('ADMIN_ROLE')
    ],
    addProduct
)

router.get(
    '/',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    getProducts
)

router.get(
    '/agotados',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    getOutOfStockProducts
)

router.get(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    searchProduct
)

export default router;