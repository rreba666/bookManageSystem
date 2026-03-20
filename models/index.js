import sequelize from "../config/database.js";
import initModels from "./auto/init-models.js";

const models = initModels(sequelize)

export const Books = models.books
export const BooksCategory = models.books_category
export const Todolist  = models.todolist

export { sequelize }