(function() {
	console.log("App Init");
	
	Handlebars.registerHelper('stars', function(rating){
		var res = "";
		for (var i = 0; i <= 10; i++){
			if (i < rating){
				res += '<i class="ui-icon-icon-star"></i>';
			}else{
				res += '<i class="ui-icon-icon-star-empty"></i>';
			}
		}
		return new Handlebars.SafeString(res);
	});
	
	// Initialize DB and API
	$('#landing').on('pageinit', function(){
		TVFrik.DB.load();
	});
	
	// timeout after 10 seconds
	if ( $.mobile.path.parseUrl(document.URL).hash.length == 0){
		var tries = 0, steps = 20;
		var intervalId = window.setInterval(function(){
			if (tries < steps){
				tries++;
			}else{
				window.clearInterval(intervalId);
				alert("Failed to contact TheTVDB.com. Try again later.");
			}
			
		}, 1000);
		
		$(document).on(TVFrik.Events.databaseLoadedEvent.type, function(e){
			console.log(e.message);
			updateProgressBar(2);
			TVFrik.Controller.Update.update();
		});
		
		$(document).on(TVFrik.Events.apiUpdateEvent.type, function(e){
			console.log(e.message);
			updateProgressBar(3);
			TVFrik.Controller.Mirror.update();
		});
		
		$(document).on(TVFrik.Events.apiMirrorEvent.type, function(e){
			console.log(e.message);
			updateProgressBar(4);
			TVFrik.Pages.renderAll(true);
		});
		
		$(document).on(TVFrik.Events.pagesRenderedEvent.type, function(e){
			console.log(e.message);
			updateProgressBar(5);
			window.clearInterval(intervalId);
			$.mobile.navigate(TVFrik.Pages.shows.target);
		});
	}else{
		TVFrik.Pages.renderAll(true);
	}
	
	TVFrik.registerEvents();
	
})();

function updateProgressBar(step){
	var steps = 5;
	$('#progress-bar').val(step * 100/steps);
	$('#progress-bar').slider('refresh');
}