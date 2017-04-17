module.exports = function(sequelize, DataTypes) {

	const Room = sequelize.define('rooms', {
		name: {
			type: DataTypes.STRING, allowNull: false, unique: true,
			validate: { isLengthValid: sequelize.validateLength("Room name", 3, 18) }
		}
	});

	Room._associate = (models) => { Room.hasMany(models.Message); };
	Room._name = "Room";
	return Room;
};