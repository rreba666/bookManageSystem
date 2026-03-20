import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class books extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    books_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "主键"
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "标题"
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      comment: "价格"
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "描述"
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "封面"
    },
    date: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('unix_timestamp')
    },
    cate_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'books_category',
        key: 'cate_id'
      }
    }
  }, {
    sequelize,
    tableName: 'books',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "books_id" },
        ]
      },
      {
        name: "books_books_category_cate_id_fk",
        using: "BTREE",
        fields: [
          { name: "cate_id" },
        ]
      },
    ]
  });
  }
}
