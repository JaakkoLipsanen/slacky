const sequelize = require('./sequelize-setup').initialize();
const models = require('./models').get(sequelize);

// syncs the tables to the db. force: false doesn't drop the table if it exists
sequelize.sync({ force: false }); //

module.exports = models; // todo: need to export sequelize as well?