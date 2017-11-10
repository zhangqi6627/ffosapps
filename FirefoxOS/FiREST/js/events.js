FiREST.Events = {
	databaseLoadedEvent: {
		type: "databaseLoadedEvent",
		message: "Database Loaded",
		time: new Date()
	},
	pagesRenderedEvent: {
		type: "pagesRenderedEvent",
		message: "Pages rendered",
		time: new Date()
	},
	renderRequestsPageEvent: {
		type: "renderRequestsPageEvent",
		message: "Rendering Requests Page",
		time: new Date(),
		handler: function(e){
			var requests = [];
			FiREST.DB.getAll('request', function(event){
				var cursor = event.target.result;
				if (cursor) {
					requests.push(cursor.value);
					cursor.continue();
				}else{
					FiREST.Templates.renderRequests(requests);
				}
			});
		}
	},
	renderHistoryPageEvent: {
		type: "renderHistoryPageEvent",
		message: "Rendering History Page",
		time: new Date(),
		handler: function(e){
			var history = [];
			FiREST.DB.getAll('history', function(event){
				var cursor = event.target.result;
				if (cursor) {
					history.push(cursor.value);
					cursor.continue();
				}else{
					FiREST.Templates.renderHistory(history);
				}
			});
		}
	},
	renderAboutPageEvent: {
		type: "renderAboutPageEvent",
		message: "Rendering About Page",
		time: new Date(),
		handler: function(e){
			FiREST.Templates.renderAboutPage();
		}
	},
	addHeaderEvent: {
		type: "addHeaderEvent",
		message: "Adding header",
		time: new Date(),
		handler: function(e){
			var option = $(this).val();
			var sign = null;
			if( option.length > 0 ){
				if (option === 'custom'){
					sign = prompt("Add a new HTTP Header");
				}else{
					sign = option;
				}
			}
			
			if(sign != null && sign.length > 0){
				var uuid = FiREST.UUID();
				var elId = 'remove-' + uuid;
				var html = '<li id="' + uuid + '">';
				html += '<a href="#" class="request-header" id="' + elId + '" data-li-id="' + uuid + '">';
				html += sign;
				html += '</a></li>';
				$('#headers-list').append(html).listview('refresh');
				$('#' + elId).click(FiREST.Events.deleteHeaderEvent);
			}
		}
	},
	deleteHeaderEvent: {
		type: "deleteHeaderEvent",
		message: "Deleting header",
		time: new Date(),
		handler: function(e){
			if ( confirm("Are you sure you want to delete this header?") ){
				var liId = $(this).data('li-id');
				$("#" + liId).remove();
				$('#headers-list').listview('refresh');
			}
		}
	},
	sendRequestEvent: {
		type: "sendRequestEvent",
		message: "Sending Request",
		time: new Date(),
		url: null,
		handler: function(e){
			$.mobile.loading( "show", {
				text:'Sending Request', 
				textonly: true, 
				textVisible: true
			});
			
			var method = e.request.method;
			var url = e.request.url;
			var entryContent = e.request.content;
			
			var historyEntry = {
				uuid: FiREST.UUID(),
				datetime: new Date(),
				method: method,
				url: url,
				headers: e.request.headers,
				content: entryContent,
				response: null
			};
			
			var xhr = new XMLHttpRequest({mozSystem: true});
			xhr.open(method, url, true);
			
			for(var k in e.request.headers){
				var v = e.request.headers[k];
				xhr.setRequestHeader(k, v);
			}
			var start = new Date().getTime();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                	$.mobile.loading( 'hide' );
                	var duration = (new Date().getTime()) - start;
                	var result = {
            			uuid: historyEntry.uuid,
            			duration: duration,
            			response:{
                			status: xhr.status,
                			headers: xhr.getHeaders(),
                			body: xhr.response,
            			}
                	};
                	historyEntry.response = result.response;
                	historyEntry.duration = duration;
                	
                	if(xhr.status !== 0){
                    	FiREST.Templates.renderResponsePage(result);
                	}
                	FiREST.DB.save('history', historyEntry);
                }
            };

            xhr.onerror = function () {
                alert("Failed");
            };
            
            xhr.send(entryContent);
		}
	}, 
	deleteHistoryEvent: {
		type: "deleteHistoryEvent",
		message: "Deleting History",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			if ( confirm("Are you sure you want to delete this entry?") ){
				var hId = $(this).data('history-id');
				$("#" + hId).remove();
				$('#history-list').listview('refresh');
				FiREST.DB.remove('history', hId);
			}
		}
	},
	emailHistoryEvent: {
		type: "emailHistoryEvent",
		message: "Emailing History",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			var hId = $(this).data('history-id');
			FiREST.DB.get('history', hId, function(event){
	        	var createEmail = new MozActivity({
	                name: "new",
	                data: {
	                    type : "mail",
	                    url: "mailto:",
	                    subject: "FiREST Request",
	                    body: event.target.result,
	                }
	            });
	        	createEmail.onsuccess = function() {
        			console.log("Email Sent");
    			};
        		 
    			createEmail.onerror = function() {
        			console.log(this.error);
        		};
			});
		}
	},
	showHistoryEvent: {
		type: "showHistoryEvent",
		message: "Showing History",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			var hId = $(this).data('history-id');
			FiREST.DB.get('history', hId, function(event){
	        	FiREST.Templates.renderSingleHistory(event.target.result);
			});
		}
	},
	clearHistoryEvent: {
		type: "clearHistoryEvent",
		message: "Clearing History",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			
			if ( !confirm("Are you sure you want to clear the history?") ){
				return;
			}
			
			var h = [];
			FiREST.DB.getAll('history', function(event){
				var cursor = event.target.result;
				if (cursor) {
					h.push(cursor.value);
					cursor.continue();
				}else{
					FiREST.DB.remove('history', h.map(
						function(el){
							return el.uuid;
						})
					);
					$.event.trigger(FiREST.Events.renderHistoryPageEvent);
				}
			});
		}
	},
	selectMethodEvent: {
		type: "selectMethodEvent",
		message: "Selected HTTP Method event",
		time: new Date(),
		handler: function(e){
			var method = $(this).val();
			if (method === 'POST' || method === 'PUT'){
				$('#request-content-container').show();
			}else{
				$('#request-content-container').hide();
			}
		}
	},
	saveRequestEvent: {
		type: "saveRequestEvent",
		message: "Saving Request event",
		time: new Date(),
		handler: function(e){
			var hId = $(this).data('history-id');
			FiREST.DB.get('history', hId, function(event){
				var entry = event.target.result;
				var request = {
					content: entry.content,
					headers: entry.headers,
					method: entry.method,
					url: entry.url,
					uuid: FiREST.UUID()
				}
				FiREST.DB.save('request', request);
				alert("Request Saved");
			});
		}
	},
	showRequestEvent: {
		type: "showRequestEvent",
		message: "Showing Request event",
		time: new Date(),
		handler: function(e){
			var id = $(this).data('request-id');
			FiREST.DB.get('request', id, function(event){
				FiREST.Templates.renderSavedRequest(event.target.result);
			});
		}
	},
	deleteRequestEvent: {
		type: "deleteRequestEvent",
		message: "Deleting Request",
		time: new Date(),
		handler: function(e){
			if ( confirm("Are you sure you want to delete this saved request?") ){
				var hId = $(this).data('request-id');
				FiREST.DB.remove('request', hId);
				$.mobile.navigate(FiREST.Templates.templates.requests.target);
			}
		}
	},
	openLinkEvent: {
		type: "openLinkEvent",
		message: "Going to Browser",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			var url = $(this).attr('href');
			var activity = new MozActivity({
				name: "view",
				data: {
					type: "url",
					url: url
				}
			});
	 
			activity.onsuccess = function() {
				console.log("Page visited");
			};
			 
			activity.onerror = function() {
				console.log(this.error);
			};
		}
	},
};

FiREST.registerEvents = function(){
	$.each(FiREST.Events, function(name, event){
		if(event.handler){
			$(document).on(event.type, event.handler);
		}
	});
};