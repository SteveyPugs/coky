module.exports = function(sequelize, DataTypes){
	var User = sequelize.define("User", {
		UserID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		UserEmail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserPassword: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserConfirmed:{
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		UserConfirmHash:{
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		paranoid: true
	});
	return User;
};