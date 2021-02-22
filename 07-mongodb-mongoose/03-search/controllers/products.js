const Product = require('../models/Product');

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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query;
  const products = await Product
      .find({$text: {$search: query}}, {score: {$meta: 'textScore'}})
      .sort({score: {$meta: 'textScore'}});

  const productsDto = [];
  products.forEach((product) => {
    productsDto.push(productToDto(product));
  });
  ctx.body = {products: productsDto};
};
