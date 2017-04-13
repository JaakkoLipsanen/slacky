module.exports = function(sequelize, DataTypes) {

	const Message = sequelize.define('messages', {
		text: { type: DataTypes.STRING },
		timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
	});

	Message._associate = (models) => { Message.belongsTo(models.User, { as: 'sender' }); };
	Message._name = "Message";
	return Message;
};