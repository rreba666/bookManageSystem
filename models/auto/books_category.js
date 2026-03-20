import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class books_category extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    cate_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cate_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'books_category',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cate_id" },
        ]
      },
    ]
  });
  }
}
