/**
 * Here we control the rendering of the main pages and bind their
 * events. Event binding for generated content is done in the templates
 * file.
 */

TVFrik.Pages = {
	shows: {
    	source: 'pages/shows.html',
    	target: '#shows',
    	events: [{
    		target: '#shows',
    		event: 'pageshow',
    		handler: function(e){
    			$.event.trigger(TVFrik.Events.renderShowsEvent);
    		},
    	}],
    },
    search: {
    	source: 'pages/search.html',
    	target: '#search',
    	events: [{
    		target: '#search',
    		event: 'pageshow',
    		handler: function(e){
    			console.log("Showing Search");
    			$('#search-field').off('change');
    			$('#search-field').change(TVFrik.Controller.Search.searchEventHandler);
    		},
    	},{
    		target: '#search-field',
    		event: 'change',
    		handler: TVFrik.Controller.Search.searchEventHandler,
    	}],
    },
    about: {
    	source: 'pages/about.html',
    	target: '#about',
    	events: [{
    		target: '#about',
    		event: 'pageshow',
    		handler: function(e){
    			console.log("Showing About");
    		},
    	}],
    },
    seasons: {
    	source: 'pages/seasons.html',
    	target: '#seasons',
    	events: [],
    },
    episodes: {
    	source: 'pages/episodes.html',
    	target: '#episodes',
    	events: [],
    },
    episode: {
    	source: 'pages/episode.html',
    	target: '#episode',
    	events: [],
    },
    renderAll: function(refresh){
    	$.each(TVFrik.Pages, function(name, template){
    		if (template.source){
    			$(template.target).load(template.source, function(r,s,x){
    				if (refresh){
    					try {
    						$(template.target).trigger('pagecreate');
    					} catch (e) {
    						console.log(e);
    					}
    				}
    				$.each(template.events, function(i, event){
    					console.log("Registering event " + event.target);
    					$(event.target).on(event.event, event.handler);
    				})
    			});
    		}
    	});
    	$.event.trigger(TVFrik.Events.pagesRenderedEvent);
    }
}