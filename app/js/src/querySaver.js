function getWorkspaceKey(workspace){
	return "workspace_" + workspace;
}

function getWorkspaceNames(callback){
	
}

function getWorkspaceQueries(workspace, callback){
	localforage.getItem(getWorkspaceKey(workspace), function (err, value) {
		if(err) callback(err);
		else {
			value = value || {};
			callback(
				null, 
				Object.keys(value).map(function(queryName){
					return {
						name: queryName,
						query: value[queryName].query,
						saveTime: value[queryName].saveTime
					}
				}).sort(function(a, b){
					// most recent query first
					return b.saveTime - a.saveTime;
				})
			);
		}
	});
}

function setWorkspaceQuery(workspace, queryName, query, callback){
	var workspaceKey = getWorkspaceKey(workspace);
	
	localforage.getItem(workspaceKey, function (err, value) {
		if(err) callback(err);
		else {
			value = value || {};
			value[queryName] = {
				query: query,
				saveTime: Date.now()
			};
			localforage.setItem(workspaceKey, value, callback);
		}
	});
}

module.exports = function(){
	
	/* Save queries */
	var saveQueryWorkspace = $('#query-workspace');
	var saveQueryName = $('#query-name');
	var queryBox = $('#query-box');
	
	$('#save-query-form').submit(function(){
		if(
			saveQueryName.val() 
			&& saveQueryWorkspace.val()
			&& queryBox.val()
		){
			setWorkspaceQuery(
				saveQueryWorkspace.val().trim().toLowerCase(), 
				saveQueryName.val().trim().toLowerCase(),
				queryBox.val().trim().toLowerCase(),
				function(err){
					if(err) {
						alert("Error saving query: " + err);
						console.error(err);
					}
					else alert("Query saved");
				}
			)
		}
	});
	
	
	/* Fetch saved queries */
	var queryWorkspaceGet = $('#query-workspace-get');
	var workspaceQueriesBox = $('#workspace-queries-box');
	
	$('#get-query-form').submit(function(){
		if(queryWorkspaceGet.val()){
			workspaceQueriesBox.html("");
			
			getWorkspaceQueries(queryWorkspaceGet.val(), function(err, queries){
				if(err) {
					alert("Error fetching queries: " + err);
					console.error(err);
				}
				else {
					var table = $('<table class="table table-hover"></table');
					var tableBody = $('<tbody></tbody');
					
					tableBody.append(queries.map(function(queryObj){
						var tr = $('<tr class="saved-query"></tr>');
						var td = $("<td></td>");
						td.text(queryObj.name);
						tr.attr("query", queryObj.query);
						tr.append(td);
						tr.click(function(){
							queryBox.text(queryObj.query);
							saveQueryWorkspace.val(queryWorkspaceGet.val());
							saveQueryName.val(queryObj.name);
							$('#run-query-btn').click();
						});
						return tr;
					}));
					
					table.append(tableBody);
					
					workspaceQueriesBox.html(table);
				}
			});
		}
	});
};
