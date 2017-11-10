// Comunicate with TheTVDB.com API

TVFrik.API = {};

TVFrik.API.constants = {
	url: 'http://thetvdb.com/api/',
	key: '7D1853FEBCEF99FA'
//	url: 'http://localhost/TVFrik/xml',
//	key: ''
};

TVFrik.API.routes = {
	mirrors: {
		url: TVFrik.API.constants.url + TVFrik.API.constants.key + '/mirrors.xml',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {},
		getUrl: function(){
			return this.url;
		}
	},
	time: {
		url: TVFrik.API.constants.url + 'Updates.php',
//		url: TVFrik.API.constants.url + TVFrik.API.constants.key + '/update.xml',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			type: 'none',	//or all
			time: null		//optional
		},
		getUrl: function(){
			if (this.time != null)
				return this.url + '?type=' + this.params.type + '&time=' + this.params.time;
			else
				return this.url + '?type=' + this.params.type;
		}
	},
	searchByName: {
		url: TVFrik.API.constants.url + 'GetSeries.php',
//		url: TVFrik.API.constants.url + '/search.xml',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			seriesname: null,
			user: null,
			language: 'en'
		},
		getUrl: function(){
			return this.url + '?seriesname=' + this.params.seriesname + '&language=' + this.params.language;
		}
	},
	searchByRemoteID: {
		url: TVFrik.API.constants.url + 'GetSeriesByRemoteID.php',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			imdbid: null,
			zap2itid: null,
			language: 'en'
		},
	},
	serie: {
		// .../series/{seriesid}/{lang}.xml
		// .../series/{seriesid}/all/{lang}.xml
		url: TVFrik.API.constants.url + TVFrik.API.constants.key + '/series/',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			seriesid: null,
			language: 'en',
			all: false
		},
		getUrl: function(){
			if(this.params.all){
				return this.url + this.params.seriesid + "/all/" + this.params.language + ".xml";
			}else{
				return this.url + this.params.seriesid + "/" + this.params.language + ".xml";
			}
		}
	},
	episode: {
		// .../episodes/{episodeid}/{lang}.xml
		// .../episodes/{episodeid}/all/{lang}.xml
		url: TVFrik.API.constants.url + TVFrik.API.constants.key + '/episodes/',
		handler: function(xml){
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			episodeid: null,
			language: 'en',
			all: false
		},
		getUrl: function(){
			if(all){
				return this.url + this.params.episodeid + "/all/" + this.params.language + ".xml";
			}else{
				return this.url + this.params.episodeid + "/" + this.params.language + ".xml";
			}
		}
	},
	
	// Ratings
	
	userRatings: {
		url: TVFrik.API.constants.url + '/GetRatingsForUser.php',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			apikey: TVFrik.API.constants.key,
			accountid: null,
		},
	},
	userEpisodesRatings: {
		url: TVFrik.API.constants.url + '/GetRatingsForUser.php',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			apikey: TVFrik.API.constants.key,
			accountid: null,
			seriesid: null
		},
	},
	rate: {
		url: TVFrik.API.constants.url + '/User_Rating.php',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			accountid: null,
			itemtype: 'series', //or episode
			itemid: null, // seriesid or episodeid
			rating: null // from 0 to 10
		},
	},
	
	// Favorites
	
	favorites: {
		url: TVFrik.API.constants.url + '/User_Favorites.php',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			accountid: null,
		},
	},
	favorite: {
		url: TVFrik.API.constants.url + '/User_Favorites.php',
		handler: function(xml){ 
			TVFrik.API.GenericHandler(xml); 
		},
		params: {
			accountid: null,
			type: 'add', //or remove
			seriesid: null
		},
	},
};

TVFrik.API.call = function(route){
	console.log("Calling " + route.getUrl());
//	$.get(route.getUrl(), route.handler);
	
	var xhr = new XMLHttpRequest({mozSystem: true});
	xhr.open("GET", route.getUrl(), true);
	xhr.overrideMimeType("text/xml");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if(xhr.status === 200){
				route.handler(xhr.responseXML);
			}else{
				alert("Failed to call " + route.getUrl());
			}
		}
	}
	xhr.send();
	
};

TVFrik.API.GenericHandler = function(xml){
	var response = JXON.build(xml);
	console.log(response);
};