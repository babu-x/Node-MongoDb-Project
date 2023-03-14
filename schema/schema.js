import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Product = mongoose.model('Products', productSchema)

export default Product
