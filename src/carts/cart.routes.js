import { Router } from 'express';
import { addToCart, getCart } from './cart.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT
    ],
    addToCart
)

router.get(
    '/',
    [
        validarJWT
    ],
    getCart
)


export default router;