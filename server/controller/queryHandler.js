const sql = require("./../service/sql");

module.exports = function(app, express) {

    app.get('/query', (req, res) => {
    	sql.readOnlyQuery(req.query.q, (err, result) => {
    		if(err) res.status(500).send(err);
    		else res.send(result);
    	});
    });
}
