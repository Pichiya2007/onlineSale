import Cart from './cart.model.js';
import Product from '../products/product.model.js';

export const addToCart = async (req, res) => {
    try {

        const user = req.usuario._id;
        const { product, quantity } = req.body;

        const productData = await Product.findById(product);
        if (!productData || productData.stock < quantity) {
            return res.status(400).json({
                success: false,
                msg: 'Producto no disponible o stock insuficiente.'
            })
        }

        let cart = await Cart.findOne({ user });
        
        if (!cart) {
            cart = new Cart({ user, products: [{ product, quantity }] });
        } else {
            const productIndex = cart.products.findIndex(product => product.product.toString() === product);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }
        }

        await cart.save();

        res.status(200).json({
            success: true,
            msg: 'Producto agregado al carrito.',
            cart: {
                ...cart.toObject(),
                products: cart.products.map(p => ({
                    product: {
                        _id: p.product,
                        name: productData.name
                    },
                    quantity: p.quantity
                }))
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al agregar producto al carrito.',
            error: error.message
        })
    }
}

export const getCart = async (req, res) => {
    try {

        const userId = req.usuario._id;
        const cart = await Cart.findOne({ user: userId }).populate('products.product');

        res.status(200).json({
            success: true,
            cart: {
                ...cart.toObject(),
                products: cart.products.map(p => ({
                    product: {
                        _id: p.product._id,
                        name: p.product.name
                    },
                    quantity: p.quantity
                }))
            }
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No tienes un carrito creado aún.',
            error: error.message
        })
    }
}