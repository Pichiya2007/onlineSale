import Product from './product.model.js';
import Category from '../categories/category.model.js';

export const addProduct = async (req, res) => {
    try {

        const data = req.body;
        const category = await Category.findById(data.category);

        const product = new Product({
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: category._id
        })

        await product.save();

        res.status(200).json({
            success: true,
            msg: 'Producto agregado exitosamente.',
            product
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al agregar producto.',
            error: error.message
        })
    }
}

export const getProducts = async (req, res) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const products = await Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

        const productsWithCategories = await Promise.all(products.map(async (product) => {
            const productCategory = await Category.findById(product.category);
            return {
                ...product.toObject(),
                category: productCategory ? productCategory.name : 'Categoría no encontrada.'
            }
        }))

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            products: productsWithCategories
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los productos.'
        })
    }
}

export const searchProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product || !product.status) {
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado.'
            })
        }

        const productCategory = await Category.findById(product.category);

        res.status(200).json({
            success: true,
            product: {
                ...product.toObject(),
                category: productCategory ? productCategory.name : 'Categoría no encontrada.'
            }
        })
        
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener el producto.',
            error: error.message
        })
    }
}

export const getOutOfStockProducts = async (req, res) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, stock: 0 };

        const products = await Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

        const productsWithCategories = await Promise.all(products.map(async (product) => {
            const productCategory = await Category.findById(product.category);
            return {
                ...product.toObject(),
                category: productCategory ? productCategory.name : 'Categoría no encontrada.'
            }
        }))

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            products: productsWithCategories
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los productos agotados.',
            error: error.message
        })
    }
}

export const getBestSellingProducts = async (req, res) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const products = await Product.find(query)
            .sort({ sold: -1 }) // Ordenar por cantidad vendida en orden descendente
            .skip(Number(desde))
            .limit(Number(limite));

        const productsWithCategories = await Promise.all(products.map(async (product) => {
            const productCategory = await Category.findById(product.category);
            return {
                ...product.toObject(),
                category: productCategory ? productCategory.name : 'Categoría no encontrada.'
            }
        }))

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            products: productsWithCategories
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los productos más vendidos.',
            error: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado.'
            })
        }

        product.status = false;

        await product.save();

        res.status(200).json({
            success: true,
            msg: 'Producto eliminado exitosamente.',
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar el producto.',
            error: error.message
        })
    }
}