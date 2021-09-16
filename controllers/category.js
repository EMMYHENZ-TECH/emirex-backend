const slugify = require("slugify");
const Category = require("../models/Category");
const Products = require("../models/Product");

const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }
  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
};
exports.createCategory = (req, res) => {
  const { name, parentId } = req.body;
  const categoryObj = {
    name: name,
    slug: slugify(name),
  };
  if (parentId) {
    categoryObj.parentId = parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) {
      res.status(400).json({ error });
    }
    if (category) {
      res
        .status(201)
        .json({ category, message: `${name} Category successfully created` });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};

exports.singleCategoryProducts = (req, res) => {
  Category.findOne({ slug: req.params.slug }, (err, category) => {
    if (err) res.status(400).json({ error: err });
    if (category) {
      Products.find({ category: category._id }, (err, products) => {
        if (err) res.status(400).json({ error: err });
        if (products) {
          res.status(200).json({ products });
        }
      });
    }
  });
};


