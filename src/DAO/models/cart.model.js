import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    category: String,
    thumbnails: [String],
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel