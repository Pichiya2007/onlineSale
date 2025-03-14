import { Router } from 'express';
import { check } from 'express-validator';
import { addCategory, updateCategory, getCategories, getProductsByCategory, deleteCategory } from './category.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/role-validator.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        tieneRole('ADMIN_ROLE'),
        validarCampos
    ],
    addCategory
)

router.get('/', getCategories)

router.get(
    '/products/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE', 'CLIENT_ROLE')
    ],
    getProductsByCategory
)

router.put(
    '/:id',
    [
        validarJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        tieneRole('ADMIN_ROLE'),
        validarCampos
    ],
    updateCategory
)

router.delete(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    deleteCategory
)

export default router;