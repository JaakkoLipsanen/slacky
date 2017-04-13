const fs = require("fs");
const path = require("path");

module.exports = {

	// based on http://sequelize.readthedocs.io/en/1.7.0/articles/express/#modelsindexjs
	// basically, imports all models inside the /models folder and calls
	// model._associate in each of them (to define associations/connections between models)
	get(sequelize) {
		const models = { };

		// import all models within /models folder and adds them to models
		fs.readdirSync(__dirname)
		.filter(file => (file.indexOf(".") !== 0) && (file !== "index.js"))
		.forEach(file => {
			const model = sequelize.import(path.join(__dirname, file));
			models[model._name] = model;
		});

		// calls _associate on each model
		for(const modelName of Object.keys(models)) {
			if ("_associate" in models[modelName]) {
				models[modelName]._associate(models);
			}
		}

		return models;
	}
};