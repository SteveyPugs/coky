module.exports = function(sequelize, DataTypes){
	var Admin = sequelize.define("Admin", {
		AdminID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		AdminEmail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		AdminPassword: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		paranoid: true
	});
	return Admin;
};