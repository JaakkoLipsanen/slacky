const app = require('express')();
app.server = require('http').createServer(app);

require('./server-setup').setup(app);
require('./authentication').setup(app);
require('./server-socket').setup(app);

app.use(require('./routes'));

// must be app.server instead of app because otherwise socket.io doesn't work or smth??
app.server.listen(app.get('port'), () => {
	console.log("Server listening from port", app.get('port'));
});
