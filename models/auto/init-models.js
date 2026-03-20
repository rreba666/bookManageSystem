import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _books from  "./books.js";
import _books_category from  "./books_category.js";
import _todolist from  "./todolist.js";

export default function initModels(sequelize) {
  const books = _books.init(sequelize, DataTypes);
  const books_category = _books_category.init(sequelize, DataTypes);
  const todolist = _todolist.init(sequelize, DataTypes);

  // 一本书一个种类 一对一
  books.belongsTo(books_category, { as: "category", foreignKey: "cate_id"});
  // 一个种类多本书 一对多
  books_category.hasMany(books, { as: "books", foreignKey: "cate_id"});

  return {
    books,
    books_category,
    todolist,
  };
}
