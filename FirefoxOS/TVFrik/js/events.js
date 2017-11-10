TVFrik.Events = {
	databaseLoadedEvent: {
		type: "databaseLoadedEvent",
		message: "Database Loaded",
		time: new Date()
	},
	apiUpdateEvent: {
		type: "apiUpdateEvent",
		message: "Database Loaded",
		time: new Date()
	},
	apiMirrorEvent: {
		type: "apiMirrorEvent",
		message: "API Updated",
		time: new Date()
	},
	pagesRenderedEvent: {
		type: "pagesRenderedEvent",
		message: "Pages rendered",
		time: new Date()
	},
	savedShowEvent: {
		type: "savedShowEvent",
		message: "Correctly saved show",
		time: new Date(),
		handler: function(e){
			if (e.success){
				alert('Added "' + e.entity.name + '" to your shows');
			}else{
				alert('Failed to add show "' + e.entity.name + '"');
			}
		}
	},
	renderSearchEvent: {
		type: "renderSearchEvent",
		message: "Rendering Search Page",
		time: new Date(),
		handler: function(e){
			TVFrik.Controller.Show.renderSearchEventHandler();
		}
	},
	renderShowsEvent: {
		type: "renderShowsEvent",
		message: "Rendering Shows Page",
		time: new Date(),
		handler: function(e){
			TVFrik.Controller.Shows.renderShows();
		}
	},
	renderSeasonsEvent: {
		type: "renderSeasonsEvent",
		message: "Rendering seasons for show",
		time: new Date(),
		showId: null,
		handler: function(e){
			var showId = parseInt($(this).data('show'));
			TVFrik.Controller.Seasons.renderSeasons(showId);
		}
	},
	renderEpisodesEvent: {
		type: "renderEpisodesEvent",
		message: "Rendering Episodes list for Season",
		time: new Date(),
		showId: null,
		seasonId: null,
		handler: function(e){
			var showId = parseInt($(this).data('show'));
			var season = parseInt($(this).data('season'));
			TVFrik.Controller.Episodes.renderEpisodes(showId, season);
		}
	},
	renderEpisodeEvent: {
		type: "renderEpisodeEvent",
		message: "Rendering Episode",
		time: new Date(),
		showId: null,
		season: null,
		episodeId: null,
		handler: function(e){
			var showId = parseInt($(this).data('show'));
			var episodeId = parseInt($(this).data('episode'));
			TVFrik.Controller.Episode.renderEpisode(showId, episodeId);
		}
	},
	changeEpisodeStatusEvent: {
		type: "changeEpisodeStatusEvent",
		message: "Changing episode status",
		time: new Date(),
		handler: function(e){
			$(this).attr("checked", !$(this).attr("checked"));
			var showId = parseInt($(this).data('show'));
			var episodeId = parseInt($(this).data('episode'));
			var _status = $(this).data('status');
			TVFrik.Controller.Episode.changeStatus(showId, episodeId, _status);
		}
	},
	markShowWatchedEvent: {
		type: "markShowWatchedEvent",
		message: "Changing Show to watched",
		time: new Date(),
		handler: function(e){
			var showId = parseInt($(this).data('show'));
			var showName = $(this).data('show-name');
			if ( confirm("Are you sure you've seen all \"" + showName + "\" episodes?") ){
				TVFrik.Controller.Shows.watchAll(showId);
			}
		}
	},
	watchedShowEvent: {
		type: "watchedShowEvent",
		message: "Correctly watched show",
		time: new Date(),
		handler: function(e){
			if (e.success){
				alert('You\'ve watched all episodes of "' + e.entity.name + '"');
			}else{
				alert('Failed :(');
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
	deleteShowEvent: {
		type: "deleteShowEvent",
		message: "Deleting Show",
		time: new Date(),
		handler: function(e){
			var showId = parseInt($(this).data('show'));
			var showName = $(this).data('show-name');
			if ( confirm("Are you sure you want to delete \"" + showName + "\"?") ){
				TVFrik.Controller.Shows.remove(showId);
			}
		}
	},
	updateShowEvent: {
		type: "updateShowEvent",
		message: "Updating Show",
		time: new Date(),
		handler: function(e){
			var showId = parseInt($(this).data('show'));
			var showName = $(this).data('show-name');
			TVFrik.Controller.Shows.update(showId, showName);
		}
	},
	updatedShowEvent: {
		type: "updatedShowEvent",
		message: "Updated Show",
		time: new Date(),
		handler: function(e){
			$.mobile.loading("hide");
			$.mobile.navigate(TVFrik.Pages.shows.target);
			alert(e.success ? 'Updated' : "Failed to Update :(");
		}
	}
};

TVFrik.registerEvents = function(){
	$.each(TVFrik.Events, function(name, event){
		if(event.handler){
			$(document).on(event.type, event.handler);
		}
	});
};