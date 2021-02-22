const Product = require('../models/Product');
const mongoose = require('mongoose');

const productToDto = (product) => (
  {
    id: product._id,
    title: product.title,
    images: product.images,
    category: product.category._id,
    subcategory: product.subcategory._id,
    price: product.price,
    description: product.description,
  }
);

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.query.subcategory;
  if (!subcategoryId) {
    return next();
  }
  const products = await Product.find({subcategory: new mongoose.Types.ObjectId(subcategoryId)});
  const productsDto = [];
  products.forEach((product) => {
    productsDto.push(productToDto(product));
  });
  ctx.body = {products: productsDto};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  const productsDto = [];
  products.forEach((product) => {
    productsDto.push(productToDto(product));
  });
  ctx.body = {products: productsDto};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    ctx.throw(400, 'Wrong product Id');
  }
  const product = await Product.findById(productId);
  if (!product) {
    ctx.throw(404, 'Document not found');
  }
  ctx.body = {product: productToDto(product)};
};

