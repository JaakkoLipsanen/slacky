## slack clone
[![Build Status](https://travis-ci.org/JaakkoLipsanen/slacky.svg?branch=master)](https://travis-ci.org/JaakkoLipsanen/slacky)

[**You can try it here!**](https://flai.xyz/slacky/)

### Technologies used:
- [**vuejs**](https://vuejs.org/) front-end framework
- [**express/node**](http://expressjs.com/) back-end framework
- [**socket.io**](http://socket.io/) for web-sockets
- [**passport**](http://passportjs.org/) for authentication
- [**PostgreSQL**](https://www.postgresql.org/) for database
- [**sequelize**](sequelizejs.com) for database ORM

### How to run locally?  
*Setting up is not very easy so I would not recommend it :P*  

**Requirements:** yarn, postgres  
**Step 1.** Clone the repository  
**Step 2.** Build with `yarn install` (or npm, but I'm not 100% sure it works)  
**Step 3.** Create postgres database and set `DATABASE_URL` enviroment variable 
			to link to that database  
			*for example: `DATABASE_URL=postgres://username:password@localhost/database_name`*  
**Step 4.** Run app with `yarn run dev` *(and hope for the best!)*
