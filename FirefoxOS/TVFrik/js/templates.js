if (!Handlebars.templates){
	console.log("Load Templates with AJAX");
	Handlebars.templates = {};
	var names = ['shows', 'seasons', 'episodes', 'episode', 'search'];
	var tmpl_dir = 'templates';
    
	for ( var i = 0; i < names.length; i++) {
		var tmpl_url = tmpl_dir + '/' + names[i] + '.handlebars';
        var tmpl_string;
        $.ajax({
            url: tmpl_url,
            method: 'GET',
            dataType: 'html',
            async: false,
            success: function(data) {
                tmpl_string = data;
            }
        });
		Handlebars.templates[names[i]] = Handlebars.compile(tmpl_string);
	}
}

TVFrik.Templates = {
	shows: {
		template: Handlebars.templates.shows,
		target: '#shows-list',
		render: function(shows){
			var self = this;
			$(self.target).html(self.template({shows:shows}));
			$(self.target).listview('refresh');
			$('.show-button').click(TVFrik.Events.renderSeasonsEvent);
		}
	},
	seasons: {
		template: Handlebars.templates.seasons,
		target: '#seasons-list',
		page: '#seasons',
		render: function(show, seasons){
			var self = this;
			$(self.target).html(self.template({
				show: show,
				seasons: seasons
			}));
			$(self.target).listview('refresh');
			$(self.page).trigger('pagecreate');
			$('.season-button').click(TVFrik.Events.renderEpisodesEvent.handler);
			$('#mark-as-seen-button').click(TVFrik.Events.markShowWatchedEvent.handler);
			$('#delete-show-button').click(TVFrik.Events.deleteShowEvent.handler);
			$('#update-show-button').click(TVFrik.Events.updateShowEvent.handler);
			$('.link-button').click(TVFrik.Events.openLinkEvent.handler);
		}
	},
	episodes: {
		template: Handlebars.templates.episodes,
		target: '#episodes-content',
		page: '#episodes',
		render: function(show, season, episodes){
			var self = this;
			$(self.target).html(self.template({
				show: show,
				season: season,
				episodes: episodes
			}));
			$(self.page).trigger('pagecreate');
			$('.episode-button').click(TVFrik.Events.renderEpisodeEvent.handler);
		}
	},
	episode: {
		template: Handlebars.templates.episode,
		target: '#episode-content',
		page: '#episode',
		render: function(show, episode){
			var self = this;
			$(self.target).html(self.template({
				show: show,
				episode: episode
			}));
			$(self.page).trigger('pagecreate');
			$('#watched-checkbox, #downloaded-checkbox').click(
				TVFrik.Events.changeEpisodeStatusEvent.handler
			);
		}
	},
	search: {
		template: Handlebars.templates.search,
		target: '#search-results',
		render: function(series){
			var self = this;
			$(self.target).html(self.template({
				series: series
			}));
			$(self.target).listview("refresh");
			$('.add-dialog').click(TVFrik.Controller.Search.addShowHandler);
		}
	}
};