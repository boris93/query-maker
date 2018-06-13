module.exports = function(){
	var queryBox = $('#query-box');
	var queryResultBox = $('#query-result-box');

	$('#run-query-btn').click(function(){
		queryResultBox.html("Running query...");
		
		$.ajax({
			url: "http://localhost:8080/query?q=" + encodeURIComponent(queryBox.val()),
			method: 'GET',
			dataType: "json"
		}).done(function(data){
			
			var header = "<tr><th>" + data.fields.map(function(fieldObj){
				return (fieldObj.table ? fieldObj.table + "." : "") + fieldObj.name
			}).join("</th><th>") + "</th></tr>";
			
			var body = data.result.map(function(row){
				return "<tr><td>" + data.fields.map(function(fieldObj){
					return row[fieldObj.name];
				}).join("</td><td>") + "</td></tr>";
			}).join("");

			queryResultBox.html('<table class="table table-striped">' + header + body + '</table>');
			
		}).fail(function(xhr, textStatus, err){
			queryResultBox.html('<div class="alert alert-danger">' +
				(
					(
						xhr.responseJSON ? 
							(xhr.responseJSON.sqlMessage || xhr.responseText)
							: xhr.responseText
					)
					|| textStatus
				)
				+ '</div>'
			);
		});
	});
};
