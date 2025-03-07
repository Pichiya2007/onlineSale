import { Schema, model} from 'mongoose';

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [30, 'Cant be overcome 30 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxLength: [150, 'Cant be overcome 150 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be greater than 0']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock must be greater than 0']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Product', ProductSchema);