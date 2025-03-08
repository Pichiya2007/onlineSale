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

export const getInvoicesByUser = async (req, res) => {
    try {

        const userId = req.usuario._id;
        const invoices = await Invoice.find({ user: userId }).populate('products.product');

        res.status(200).json({
            success: true,
            invoices
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las facturas.',
            error: error.message
        })
    }
}

export const updateInvoice = async (req, res) => {
    try {

        const { id } = req.params;
        const { products, status } = req.body;

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                msg: 'Factura no encontrada.'
            })
        }

        // Revierte el stock y las ventas de los productos de la factura original
        for (const item of invoice.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, sold: -item.quantity }
            })
        }

        let total = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    msg: `Stock insuficiente para el producto ${product.name}.`
                })
            }
            total += product.price * item.quantity;
        }

        // Actualiza el stock y las ventas de los productos nuevos
        for (const item of products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            })
        }

        invoice.products = products;
        invoice.total = total;
        invoice.status = status;

        await invoice.save();

        res.status(200).json({
            success: true,
            msg: 'Factura actualizada con éxito.',
            invoice
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la factura.',
            error: error.message
        })
    }
}