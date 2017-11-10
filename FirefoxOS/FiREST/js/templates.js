FiREST.Templates = {};

FiREST.Templates.templates = {
    request: {
    	source: 'templates/request.html',
    	target: '#request',
    	events: [{
    		target: '#send-request-button',
    		event: 'click',
    		handler: function(e){
    			var event = FiREST.Events.sendRequestEvent
    			event.request = {
    				method: $('#request-http-method').val(),
    				url: $('#request-url').val(),
    				content: $('#request-content').val(),
    				headers: {},
    			};
    			
    			$('.request-header').each(function(){
    				var header = $(this).html().trim().split(':');
    				event.request.headers[header[0]] = header[1];
    			});
    			
    			$.event.trigger(event);
    		}
    	},{
    		target: '#request-http-method',
    		event: 'change',
    		handler: FiREST.Events.selectMethodEvent,
    	},{
    		target: '#add-header-button',
    		event: 'change',
    		handler: FiREST.Events.addHeaderEvent,
    	},{
    		target: '#clear-session-button',
    		event: 'click',
    		handler: function(e){
    			document.cookie = '';
    			alert("Session cleared");
    		}
    	}]
    },
    requests: {
    	source: 'templates/requests.html',
    	target: '#requests',
    	events: [{
    		target: '#requests',
    		event: 'pageshow',
    		handler: FiREST.Events.renderRequestsPageEvent,
    	}]
    },
    history: {
    	source: 'templates/history.html',
    	target: '#history',
    	events: [{
    		target: '#history',
    		event: 'pageshow',
    		handler: FiREST.Events.renderHistoryPageEvent,
    	},{
    		target: '#clear-history-button',
    		event: 'click',
    		handler: FiREST.Events.clearHistoryEvent,
    	}]
    },
    about: {
    	source: 'templates/about.html',
    	target: '#about',
    	events: [{
    		target: '.link-button',
    		event: 'click',
    		handler: FiREST.Events.openLinkEvent.handler
    	}]
    },
};

FiREST.Templates.renderPages = function(refresh){
	$.each(FiREST.Templates.templates, function(name, template){
		$(template.target).load(template.source, function(r,s,x){
			$(template.target).append(FiREST.Templates.Footer(template.target))
			if (refresh){
				try {
					$(template.target).trigger('pagecreate');
				} catch (e) {
					console.log(e);
				}
			}
			
			$.each(template.events, function(i, event){
				$(event.target).on(event.event, event.handler);
			})
		});
	});
	$.event.trigger(FiREST.Events.pagesRenderedEvent);
};

// Rendering Methods

FiREST.Templates.renderHistory = function(history){
	$('#history-list').empty();
	$('.show-history-button').off();
	for ( var i = 0; i < history.length; i++) {
		$('#history-list').append(FiREST.Templates.historyListItem(history[i]));
	}
	$('#history-list').listview('refresh');
	$('.show-history-button').click(FiREST.Events.showHistoryEvent);
};

FiREST.Templates.renderRequests = function(requests){
	$('#requests-list').empty();
	$('.show-request-button').off();
	for ( var i = 0; i < requests.length; i++) {
		$('#requests-list').append(FiREST.Templates.requestListItem(requests[i]));
	}
	$('#requests-list').listview('refresh');
	$('.show-request-button').click(FiREST.Events.showRequestEvent);
};

FiREST.Templates.renderSavedRequest = function(request){
	$('#temporary').empty();
	$('#temporary').html(FiREST.Templates.SavedRequest(request))
	try {
		$('#temporary').trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}finally{
		$('#resend-request-button').click(function(e){
			var event = FiREST.Events.sendRequestEvent
			event.request = request;
			$.event.trigger(event);
		});
		$('#delete-request-button').click(FiREST.Events.deleteRequestEvent);
	}
	
	$.mobile.navigate('#temporary');
};

FiREST.Templates.renderResponsePage = function(result){
	$('#temporary').empty();
	$('#temporary').html(FiREST.Templates.Response(result))
	try {
		$('#temporary').trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}finally{
		$('#save-request-button').click(FiREST.Events.saveRequestEvent);
	}
	$.mobile.navigate('#temporary');
};

FiREST.Templates.renderSingleHistory = function(h){
	$('#temporary').empty();
	$('#temporary').html(FiREST.Templates.HistoryEntry(h))
	try {
		$('#temporary').trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}finally{
		$('#delete-history-button').click(FiREST.Events.deleteHistoryEvent);
		$('#email-history-button').click(FiREST.Events.emailHistoryEvent);
	}
	
	$.mobile.navigate('#temporary');
};

// Templates as JS functions

FiREST.Templates.Footer = function(active){
	var buttons = [
        {title:'Request', icon:'icon-rocket', url: '#request'},
   		{title:'Saved', icon:'icon-download-alt', url: '#requests'},
   		{title:'History', icon:'icon-tasks', url: '#history'},
    	{title:'About', icon:'icon-star', url: '#about'},
    ];
	var html = '<div data-role="footer" data-position="fixed"><div data-role="navbar"><ul>';
	
	$.each(buttons, function(){
		if(active === this.url){
			html += '<li><a href="';
			html += this.url;
			html += '" data-icon="';
			html += this.icon;
			html += '" data-iconpos="top" class="ui-btn-active ui-state-persist">';
			html += this.title;
			html += '</a></li>';
		}else{
			html += '<li><a href="';
			html += this.url;
			html += '" data-icon="';
			html += this.icon;
			html += '" data-iconpos="top">';
			html += this.title;
			html += '</a></li>';
		}
	});
	html += '</ul></div></div>';
	return html;
};

FiREST.Templates.Response = function(result){
	var html = '<div data-role="header">';
	html += '<div class="left-header-button"><a href="#" data-rel="back">';
	html += '<i class="ui-icon-icon-chevron-left"></i></a></div>'
	html += '<h1>FiREST Response</h1>';
	html += '<div class="right-header-button"><a href="#" data-history-id="';
	html += result.uuid;
	html += '" id="save-request-button">Save</a></div></div>';
	html += '<div data-role="content">';
	html += '<div class="response-metadata">';
	html += '<ul data-role="listview">';
	html += '<li data-role="list-divider">Status & Latency</li>';
	html += '<li>' + result.response.status + ' after ' + result.duration + ' ms</li>';
	html += '<li data-role="list-divider">Headers</li>';
	
	$.each(result.response.headers, function(k,v){
		html += '<li>' + k + ': ' + v + '</li>';
	});
	
	html += '<li data-role="list-divider">Response</li>';
	html += '</ul></div><div class="response-body"><textarea readonly="readonly">';
	html += result.response.body;
	html += '</textarea></div></div>';
	return html;
};

FiREST.Templates.historyListItem = function(history){
	var html = '<li id="' + history.uuid + '">';
	html += '<a href="#" class="show-history-button" data-history-id="' + history.uuid + '">';
	html += '<p>' + history.method + ' ' + history.datetime.toLocaleString() + '</p>';
	html += '<p>' + history.url + '</p>';
	html += '</a></li>';
	return html;
}

FiREST.Templates.requestListItem = function(request){
	var html = '<li id="' + request.uuid + '">';
	html += '<a href="#" class="show-request-button" data-request-id="' + request.uuid + '">';
	html += request.method + ' ' + request.url;
	html += '</a></li>';
	return html;
}

FiREST.Templates.SavedRequest = function(request){
	var html = '<div data-role="header"><div class="left-header-button">';
	html += '<a href="#" data-rel="back"><i class="ui-icon-icon-chevron-left"></i>';
	html += '</a></div><h1>FiREST Request</h1><div class="right-header-button">';
	html += '<a href="#" data-history-id="' + request.uuid + '" id="resend-request-button">Send</a>';
	html += '</div></div><div data-role="content"><div class="request-metadata">';
	html += '<ul data-role="listview"><li data-role="list-divider">';
	html += request.method;
	html += ' Request</li>';
	html += '<li>' + request.url + '</li>';
	
	if(!$.isEmptyObject(request.headers)){
		html += '<li data-role="list-divider" data-theme="c">Headers</li>';
		$.each(request.headers, function(k,v){
			html += '<li>' + k + ': ' + v + '</li>';
		});
	}
	
	html += '</ul></div><div class="response-body"><textarea readonly="readonly">';
	html += request.content;
	html += '</textarea></div>';
	html += '<a data-role="button" href="#" id="delete-request-button" ';
	html += 'data-request-id="' + request.uuid + '">Delete</a>';
	html += '</div>';
	return html;
};

FiREST.Templates.HistoryEntry = function(h){
	var html = '<div data-role="header"><div class="left-header-button">';
	html += '<a href="#" data-rel="back"><i class="ui-icon-icon-chevron-left"></i>';
	html += '</a></div><h1>FiREST History</h1><div class="right-header-button">';
	html += '<a href="#" data-history-id="';
	html += h.uuid;
	html += '" id="delete-history-button">Delete</a>';
	html += '</div></div><div data-role="content"><div class="request-metadata">';
	html += '<ul data-role="listview"><li data-role="list-divider">';
	html += h.method;
	html += ' Request ';
	
	if (h.response.status === 0){
		html += '<i class="ui-icon-icon-flag" style="color: red;"></i>';
	}else if (h.response.status === 200){
		html += '<i class="ui-icon-icon-ok-sign"></i>';
	}else{
		html += '<i class="ui-icon-icon-info-sign"></i>';
	}
	
	html += '<li>' + h.url + '</li>';
	html += '<li>' + h.datetime.toLocaleString() + '</li>';
	
	if(!$.isEmptyObject(h.headers)){
		html += '<li data-role="list-divider" data-theme="c">Headers</li>';
		$.each(h.headers, function(k,v){
			html += '<li>' + k + ': ' + v + '</li>';
		});
	}
	
	if( h.content != null && h.content.length > 0){
		html += '<li data-role="list-divider" data-theme="c">Content</li></ul></div>';
		html += '<div class="response-body"><textarea readonly="readonly">' + h.content + '</textarea></div>';
	}else{
		html += '</ul></div>';
	}
	
	html += '<div class="request-metadata" style="margin-top:20px;">';
	html += '<ul data-role="listview"><li data-role="list-divider">Response ' + h.response.status  + ' after ' + h.duration + ' ms</li>';
	
	html += '<li data-role="list-divider" data-theme="c">Headers</li>';
	$.each(h.response.headers, function(k,v){
		html += '<li>' + k + ': ' + v + '</li>';
	});
	
	html += '<li data-role="list-divider" data-theme="c">Response</li></ul></div>';
	html += '<div class="response-body"><textarea readonly="readonly">';
	html += h.response.body;
	html += '</textarea></div>';
	html += '<a data-role="button" href="#" id="email-history-button" ';
	html += 'data-history-id="' + h.uuid + '">Send by Email</a>';
	html += '</div>';
	return html;
};