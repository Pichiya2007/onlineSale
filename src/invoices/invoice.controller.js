import Invoice from './invoice.model.js';
import Product from '../products/product.model.js';
import Cart from '../carts/cart.model.js';

export const purchase = async (req, res) => {
    try {

        const userId = req.usuario._id;

        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'El carrito está vacío.'
            })
        }

        let total = 0;

        for (const item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    msg: `Stock insuficiente para el producto ${item.product.name}.`
                })
            }
            total += item.product.price * item.quantity;
        }

        const invoice = new Invoice({
            user: userId,
            products: cart.products,
            status: 'PAID',
            total
        })

        await invoice.save();

        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            })
        }

        await Cart.findByIdAndDelete(cart._id);

        res.status(200).json({
            success: true,
            msg: 'Compra realizada con éxito.',
            invoice
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al realizar la compra.',
            error: error.message
        })
    }
}