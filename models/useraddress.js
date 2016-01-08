module.exports = function(sequelize, DataTypes){
	var UserAddress = sequelize.define("UserAddress", {
		UserAddressID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		UserAddressFullName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserAddressStreet: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserAddressCity: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserAddressState: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserAddressZip: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserAddressDefault: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
	}, {
		freezeTableName: true,
		paranoid: true
	});
	return UserAddress;
};