TVFrik.Controller = {};

/**
 * Controller for shows
 */
TVFrik.Controller.Shows = {
	renderShows: function(){
		var shows = [];
		TVFrik.DB.getAll('show', function(event){
			var cursor = event.target.result;
			if (cursor) {
				// calculate unwatched show episodes
				var show = cursor.value;
				show.unwatched = 0;
				for ( var j = 0; j < show.episodes.length; j++ ) {
					if (!show.episodes[j].watched){
						show.unwatched += 1;
					}
				}
				shows.push(show);
				cursor.continue();
			} else {
				TVFrik.Templates.shows.render(shows);
			}
		});
	},
	watchAll: function(showId){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			for ( var i = 0; i < show.episodes.length; i++) {
				show.episodes[i].watched = true;
			}
			TVFrik.DB.save('show', show, TVFrik.Events.watchedShowEvent);
		});
	},
	remove : function(showId){
		TVFrik.DB.remove('show', showId, function(e){
			alert(e.success ? 'Deleted' : "Failed to Delete :(");
			$.mobile.navigate(TVFrik.Pages.shows.target);
		});
	},
	update : function(showId, name){
		$.mobile.loading( "show", {
			text:'Updating "' + name + '"', 
			textonly: true, 
			textVisible: true
		});
		
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			var now = new Date();
			var days = (now - show.lastupdate) / (1000*60*60*24);
			
			if (days > -5){ // minimum number of days before updating
				var action = TVFrik.API.routes.serie;
				action.params.seriesid = showId;
				action.params.all = true;
				action.handler = function(response){
					response = JXON.build(response);
					var newShow = TVFrik.DB.Show(response.data);
					newShow.lastupdate = new Date();
					// reset the current status to the new object
					for ( var i = 0; i < show.episodes.length; i++) {
						var episode = show.episodes[i];
						for ( var j = 0; j < newShow.episodes.length; j++) {
							if(newShow.episodes[j].apiId === episode.apiId){
								newShow.episodes[j].watched = episode.watched;
								newShow.episodes[j].downloaded = episode.downloaded;
								break;
							}
						}
					}
					
					TVFrik.DB.save('show', newShow, TVFrik.Events.updatedShowEvent);
				};
				TVFrik.API.call(action);
			}
			
		});
	}
};

TVFrik.Controller.Seasons = {
	renderSeasons: function(showId){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			var seasons = {};
			for ( var int = 0; int < show.seasons.length; int++) {
				var season = show.seasons[int];
				seasons[season] = {
					show: show.apiId,
					season: season,
					unwatched: 0
				};
			}
			
			for (var i = 0; i < show.episodes.length; i++){
				var ep = show.episodes[i];
				console.log(ep);
				if(!ep.watched){
					seasons[ep.season].unwatched += 1;
				}
			}
			TVFrik.Templates.seasons.render(show, seasons);
		});
	}
}

TVFrik.Controller.Episodes = {
	renderEpisodes: function(showId, season){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			var episodes = [];
			for ( var i = 0; i < show.episodes.length; i++) {
				var episode = show.episodes[i];
				if( episode.season === season ){
					episode.show = show.apiId;
					episodes.push(episode);
				}
			}
			TVFrik.Templates.episodes.render(show, season, episodes);
		});
	},
};

TVFrik.Controller.Episode = {
	renderEpisode: function(showId, episodeId){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			for ( var i = 0; i < show.episodes.length; i++) {
				var episode = show.episodes[i];
				if( episode.apiId === episodeId ){
					episode.show = show.apiId;
					TVFrik.Templates.episode.render(show, episode);
				}
			}
		});
	},
	changeStatus: function(showId, episodeId, status){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			for ( var i = 0; i < show.episodes.length; i++) {
				var episode = show.episodes[i];
				if( episode.apiId === episodeId ){
					episode[status] = !episode[status];
					break;
				}
			}
			TVFrik.DB.save('show', show);
		});
	}
};

TVFrik.Controller.Update = {
	update: function(){
		var action = TVFrik.API.routes.time;
		action.handler = TVFrik.Controller.Update.apiHandler;
		TVFrik.API.call(action);
	},
	apiHandler: function(response){
		console.log("Got response");
		response = JXON.build(response);
		var lastUpdate = new Date(response.items.time * 1000);
		TVFrik.DB.save('config', {
			key: 'lastUpdate',
			value: lastUpdate
		}, TVFrik.Events.apiUpdateEvent);
	}
};

TVFrik.Controller.Mirror = {
	update: function(){
		var action = TVFrik.API.routes.mirrors;
		action.handler = this.apiHandler;
		TVFrik.API.call(action);
	},
	apiHandler: function(response){
		response = JXON.build(response);
		var mirror = response.mirrors.mirror.mirrorpath;
		TVFrik.DB.save('config', {
			key: 'mirror',
			value: mirror
		}, TVFrik.Events.apiMirrorEvent);
	}
};

TVFrik.Controller.Search = {
	searchEventHandler: function(searchEvent){
		searchEvent.preventDefault();
		var search = $(this).val();
		if(search.length > 0){
			TVFrik.Controller.Search.search(search);
		}else{
			TVFrik.Templates.search.render([]);
		}
		
	},
	search: function(search){
		var action = TVFrik.API.routes.searchByName;
		action.params.seriesname = search;
		action.handler = this.resultHandler;
		
		$.mobile.loading( "show", {
			text:'Searching "' + search + '"', 
			textonly: true, 
			textVisible: true
		});
		
		TVFrik.API.call(action);
	},
	resultHandler: function(response){
		$.mobile.loading( 'hide' );
		response = JXON.build(response);
		if (response.data.series){
			if (response.data.series.length){
				TVFrik.Templates.search.render(response.data.series);
			}else{
				TVFrik.Templates.search.render([response.data.series]);
			}
		}else{
			alert("No results");
			TVFrik.Templates.search.render([]);
		}
		
	},
	addShowHandler: function(e){
		var name = $(this).html();
		var id = $(this).attr('id');
		e.preventDefault();
		if (confirm('Add "' + name + '" show to your shows?')){
			var action = TVFrik.API.routes.serie;
			action.params.seriesid = id;
			action.params.all = true;
			action.handler = function(response){
				response = JXON.build(response);
				var show = TVFrik.DB.Show(response.data);
				show.lastupdate = new Date();
				TVFrik.DB.save('show', show, TVFrik.Events.savedShowEvent);
			};
			TVFrik.API.call(action);
		}
	}
}