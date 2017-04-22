const sequelize = require('./sequelize-setup').initialize();
const models = require('./models').get(sequelize);

require('./session-table-setup').setup(sequelize);

// TODO: create session table as well automatically (used in auth session storage)

// syncs the tables to the db. force: false doesn't drop the table if it exists
sequelize.sync({ force: false }); //

module.exports = models; // todo: need to export sequelize as well?