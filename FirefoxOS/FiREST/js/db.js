FiREST.DB = {
	db: null,
	dbName: "FiRESTDB",
	version: 1,
	tables: [       // I know this aren't tables
		{
			name:'config',
			key:'key',
			indexes: []
		},{
			name: 'request',
			key:'uuid',
			indexes: [
	            {name: "name", field:"name", options:{unique:true}},
            ]
		},{
			name: 'history',
			key:'uuid',
			indexes: [
	            {name: "datetime", field:"datetime", options:{unique:true}},
            ]
		}
	],
	load: function(){
		self = this;

		var request = window.indexedDB.open(FiREST.DB.dbName, FiREST.DB.version);
		request.onerror = function(e) {
			alert("Unable to create DB");
		};
		request.onsuccess = function(e) {
			console.log("Created DB");
			FiREST.DB.db = request.result;
			$.event.trigger(FiREST.Events.databaseLoadedEvent);
		};
		request.onupgradeneeded = function(e) {
			console.log("Upgraded DB");
			FiREST.DB.db = e.target.result;
			
			$.each(FiREST.DB.tables, function(i, table){
				var store = FiREST.DB.db.createObjectStore(table.name, {keyPath:table.key});
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
		var tx = FiREST.DB.db.transaction([store], action);
		
		tx.oncomplete = function(e) {
			console.log("TX completed succesfully");
		};
		 
		tx.onerror = function(e) {
			console.log("TX failed");
		};
		return tx;
	},
	
	save: function(store, entity, event){
		if (FiREST.DB.db != null) {
			var tx = FiREST.DB.getTransaction(store, true);
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
			FiREST.DB.load();
		}
	},
	remove: function(store, key){
		if (FiREST.DB.db != null) {
			var tx = FiREST.DB.getTransaction(store, true);
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
			FiREST.DB.load();
		}
	},
	get: function(store, key, callback){
		if (FiREST.DB.db != null) {
			var tx = FiREST.DB.getTransaction(store, true);
			var request = tx.objectStore(store).get(key);
			request.onsuccess = callback;
			request.onerror = callback;
		}else{
			console.log("db not loaded");
			FiREST.DB.load();
		}
	},
	getWithEvent: function(store, key, event){
		if (FiREST.DB.db != null) {
			var tx = FiREST.DB.getTransaction(store, true);
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
			FiREST.DB.load();
		}
	},
	getAll: function(store, callback){
		if (FiREST.DB.db != null) {
			var tx = FiREST.DB.getTransaction(store, true);
			var request = tx.objectStore(store).openCursor();
			request.onsuccess = callback;
			request.onerror = callback;
		}else{
			console.log("db not loaded");
			FiREST.DB.load();
		}
	},
	getByIndex: function(store, index, value, callback){
		if (FiREST.DB.db != null) {
			var tx = FiREST.DB.getTransaction(store, true);
			var request = tx.objectStore(store).index(index).get(value);
			request.onsuccess = callback;
			request.onerror = callback;
		}else{
			console.log("db not loaded");
			FiREST.DB.load();
		}
	},
	UUID: function (){
		var ts = new Date().getTime().toString();
		return Math.floor((1 + Math.random()) * 0x10000).toString(16) + ts;
	}
};