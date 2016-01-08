module.exports = function(sequelize, DataTypes){
	var Category = sequelize.define("Category", {
		CategoryID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		CategoryName: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		paranoid: true
	});
	return Category;
};