
// based on http://stackoverflow.com/a/24089729
const querySessionTableExists = (sequelize) => {
	return new Promise((resolve, reject) => {
		sequelize.query(
			`SELECT EXISTS (
				SELECT 1
				FROM   information_schema.tables
				WHERE  table_name = 'session'
			);`)
			.then(result => {
				const tableExists = result[0][0].exists;
				resolve(tableExists);
			})
			.catch(reject);
	});
}

// create table for node-connect-pg-simple session storage (see also: /authentication/session-setup.js)
// see also:
// https://github.com/voxpelli/node-connect-pg-simple
// https://github.com/voxpelli/node-connect-pg-simple/blob/master/table.sql
const createSessionTable = (sequelize) => {
	return new Promise((resolve, reject) => {
		sequelize.query(
			`CREATE TABLE "session" (
				"sid" varchar NOT NULL COLLATE "default",
				"sess" json NOT NULL,
				"expire" timestamp(6) NOT NULL
			)
			WITH (OIDS=FALSE);
			ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`)
			.then(result => {
				// i think that if the above command fails, then it will get rejected
				// so no need to check any values from 'result'
				resolve();
			})
			.catch(reject);
	});
}

// creates "session" table if doesn't exists
const setup = async (sequelize) => {
	try {
		const sessionTableExists = await querySessionTableExists(sequelize);
		if(sessionTableExists) {
			return;
		}

		await createSessionTable(sequelize);
	}
	catch(error) { console.log("Something went wrong in initializing session-table", error); }
};

module.exports = {
	setup: setup,
}
