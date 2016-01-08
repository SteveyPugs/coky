module.exports = function(sequelize, DataTypes){
	var OrderPiece = sequelize.define("OrderPiece", {
		OrderPieceID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		OrderID: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		OrderPieceQuantity: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
	}, {
		freezeTableName: true,
		paranoid: true
	});
	return OrderPiece;
};