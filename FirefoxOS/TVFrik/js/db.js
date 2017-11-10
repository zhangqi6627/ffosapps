TVFrik.DB = {
	db: null,
	dbName: "TVFrickDB",
	version: 1,
	tables: [       // I know this aren't tables
		{
			name:'config',
			key:'key',
			indexes: []
		},{
			name: 'show',
			key:'apiId',
			indexes: [
	            {name: "name", field:"name", options:{unique:true}},
	            {name: "genres", field:"genres", options:{multiEntry:true}},
	            {name: "seasons", field:"seasons", options:{multiEntry:true}},
            ]
		}
	],
	load: function(){
		self = this;

		var request = window.indexedDB.open(TVFrik.DB.dbName, TVFrik.DB.version);
		request.onerror = function(e) {
			alert("Unable to create DB");
		};
		request.onsuccess = function(e) {
			console.log("Created DB");
			TVFrik.DB.db = request.result;
			$.event.trigger(TVFrik.Events.databaseLoadedEvent);
		};
		request.onupgradeneeded = function(e) {
			console.log("Upgraded DB");
			TVFrik.DB.db = e.target.result;
			
			$.each(TVFrik.DB.tables, function(i, table){
				var store = TVFrik.DB.db.createObjectStore(table.name, {keyPath:table.key});
				$.each(table.indexes, function(j, index){
					store.createIndex(
						index.name,
						index.field,
						index.options
					);
				});
			});
		};
	},
	
	getTransaction: function(store, write){
		write = write ? true : false;
		var action = write ? "readwrite" : "readonly";
		var tx = TVFrik.DB.db.transaction([store], action);
		
		tx.oncomplete = function(e) {
			console.log("TX completed succesfully");
		};
		 
		tx.onerror = function(e) {
			console.log("TX failed");
		};
		return tx;
	},
	
	save: function(store, entity, event){
		if (TVFrik.DB.db != null) {
			var tx = TVFrik.DB.getTransaction(store, true);
			var objectStore = tx.objectStore(store);
			
			// entity can be an array or not, so we treat all as array
			var entities = new Array().concat(entity);
			
			for ( var i in entities ){
				var ent = entities[i];
				var request = objectStore.put(ent);
				
				request.onsuccess = function(e){
					console.log("saved entity");
					if (event){
						event.success = true;
						event.entity = entity;
						$.event.trigger(event);
					}
				};
				
				request.onerror = function(e){
					console.log(e);
					if (event){
						event.success = false;
						event.entity = entity;
						$.event.trigger(event);
					}
				};
			}
		}else{
			console.log("db not loaded");
			TVFrik.DB.load();
		}
	},
	remove: function(store, key){
		if (TVFrik.DB.db != null) {
			var tx = TVFrik.DB.getTransaction(store, true);
			var objectStore = tx.objectStore(store);
			
			// entity can be an array or not, so we treat all as array
			var keys = new Array().concat(key);
			
			for ( var i in keys ){
				var request = objectStore.delete(keys[i]);
				
				request.onsuccess = function(e){
					console.log("deleted entity " + keys[i]);
				};
				
				request.onerror = function(e){
					console.log(e);
				};
			}
		}else{
			console.log("db not loaded");
			TVFrik.DB.load();
		}
	},
	get: function(store, key, callback){
		if (TVFrik.DB.db != null) {
			var tx = TVFrik.DB.getTransaction(store, true);
			var request = tx.objectStore(store).get(key);
			request.onsuccess = callback;
			request.onerror = callback;
		}else{
			console.log("db not loaded");
			TVFrik.DB.load();
		}
	},
	getWithEvent: function(store, key, event){
		if (TVFrik.DB.db != null) {
			var tx = TVFrik.DB.getTransaction(store, true);
			var request = tx.objectStore(store).get(key);
			request.onsuccess = function(e){
				event.success = true;
				event.result = request.result;
				console.log(event);
				$.event.trigger(event);
			};
			request.onerror = function(e){
				event.success = false;
				$.event.trigger(event);
			};
		}else{
			console.log("db not loaded");
			TVFrik.DB.load();
		}
	},
	getAll: function(store, callback){
		if (TVFrik.DB.db != null) {
			var tx = TVFrik.DB.getTransaction(store, true);
			var request = tx.objectStore(store).openCursor();
			request.onsuccess = callback;
			request.onerror = callback;
		}else{
			console.log("db not loaded");
			TVFrik.DB.load();
		}
	},
	getByIndex: function(store, index, value, callback){
		if (TVFrik.DB.db != null) {
			var tx = TVFrik.DB.getTransaction(store, true);
			var request = tx.objectStore(store).index(index).get(value);
			request.onsuccess = callback;
			request.onerror = callback;
		}else{
			console.log("db not loaded");
			TVFrik.DB.load();
		}
	},
	UUID: function (){
		var ts = new Date().getTime().toString();
		return Math.floor((1 + Math.random()) * 0x10000).toString(16) + ts;
	}
};

TVFrik.DB.Show = function(data){
	var episodes = [];
	var seasons = [];
	
	for (var i in data.episode){
		var ep = data.episode[i];
		episodes.push({
			apiId: ep.id,
			imdbId: ep.imdb_id,
			name: ep.episodename,
			number: ep.episodenumber,
			overview: ep.overview,
			rating: ep.rating,
			ratingCount: ep.rating_count,
			poster: ep.filename,
			seasonId: ep.seasonid,
			season: ep.seasonnumber,
			poster: ep.filename,
			language: ep.language,
			watched: false,
			downloaded: false,
			rated: false,
		});
		
		if (seasons.indexOf(ep.seasonnumber) === -1){
			seasons.push(ep.seasonnumber);
		}
	}
	
	return {
		apiId: data.series.id,
		imdbId: data.series.imdb_id,
		name: data.series.seriesname,
		status: data.series.status,
		genres: data.series.genre.replace(/\|/g,' ').trim().split(' '),
		overview: data.series.overview,
		rating: data.series.rating,
		ratingCount: data.series.ratingcount,
		poster: data.series.poster,
		language: data.series.language,
		episodes: episodes,
		seasons: seasons,
		rated: false,
	};
};