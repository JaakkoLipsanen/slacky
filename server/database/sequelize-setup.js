const Sequelize = require('sequelize');
module.exports = {
	initialize() {
		const sequelize = new Sequelize(process.env.DATABASE_URL, {
			dialect: 'postgres',
			logging: false,

			pool: {
				max: 5,
				min: 0,
				idle: 10000
			},
		});

		sequelize.validateLength = (name, min, max) => (val) => {
			if(val.length < min || val.length > max)
				throw new Error(`${name} is too short or too long!`);
		};

		return sequelize;
	},
}