module.exports = function(sequelize, DataTypes){
	var Product = sequelize.define("Product", {
		ProductID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ProductName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ProductPrice: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		ProductImage: {
			type: DataTypes.UUID,
			allowNull: false
		},
		ProductImageType: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ProductStatus: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		paranoid: true
	});
	return Product;
};