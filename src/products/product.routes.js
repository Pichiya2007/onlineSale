import { Router } from 'express';
import { check } from 'express-validator';
import { addProduct, getProducts, searchProduct, getOutOfStockProducts, getBestSellingProducts, searchProductsByName, deleteProduct } from './product.controller.js';
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
    '/ventas',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    getBestSellingProducts
)

router.get(
    '/nombre',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE', 'CLIENT_ROLE')
    ],
    searchProductsByName
)

router.get(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    searchProduct
)

router.delete(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    deleteProduct
)

export default router;