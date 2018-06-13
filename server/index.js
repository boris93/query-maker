'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const PORT = process.env.API_PORT || process.env.PORT || 8080;

const requestBodyLimit = '2kb';

/* Config */
/* Support JSON-encoded bodies */
app.use(bodyParser.json({
	limit: requestBodyLimit
}));
/* Support URL-encoded bodies */
app.use(bodyParser.urlencoded({
	limit: requestBodyLimit,
	extended: true
}));

require('./controller/queryHandler')(app, express);

/* Exception handling */
app.use(function(err, req, res, next) {
	if (err) {
		console.error(err.stack);
		res.status(500).send(err.message);
	}
	else {
		next();
	}
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
