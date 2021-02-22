const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({}).populate('Category.subcategories');
  const categoriesDto = [];
  categories.forEach((category) => {
    const dto = {
      id: category._id,
      title: category.title,
      subcategories: [],
    };
    category.subcategories.forEach((subcategorie) => {
      dto.subcategories.push({
        id: subcategorie._id,
        title: subcategorie.title,
      });
    });
    categoriesDto.push(dto);
  });
  ctx.body = {categories: categoriesDto};
  return next();
};
