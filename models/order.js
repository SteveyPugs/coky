module.exports = function(sequelize, DataTypes){
	var Order = sequelize.define("Order", {
		OrderID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		OrderGUID: {
			type: DataTypes.UUID,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4
		},
		OrderShipCode: {
			type: DataTypes.STRING
		},
		OrderPaid: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		OrderPaidConfirmation: {
			type: DataTypes.STRING,
			allowNull: false
		},
		OrderTotal: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		OrderTax: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		OrderShipping: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		OrderSubTotal: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		paranoid: true
	});
	return Order;
};