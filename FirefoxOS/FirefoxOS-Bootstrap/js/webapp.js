(function() {
	
	var templates = [
	  {template:'back', target:'#back-navbar-template', data:{}},
	  {template:'edit', target:'#edit-navbar-template', data:{}},
	  {template:'buttons', target:'#buttons-template', data:{}},
	  {template:'tables', target:'#tables-template', data:{}},
	  {template:'ffos_table', target:'#ffos-table-template', data:{}},
	  {template:'forms', target:'#forms-template', data:{}},
	  {template:'alerts', target:'#alerts-template', data:{}},
	  {template:'progress', target:'#progress-template', data:{}},
	  {template:'accordion', target:'#accordion-template', data:{id:1}},
	  {template:'accordion', target:'#full-accordion-template', data:{id:2,isFull:true}},
	  {template:'modal', target:'#modal-template', data:{}},
    ];
	
	$.each(templates, function(i, el){
		$(el.target).html(render(el.template, el.data));
	});
	
})();

function render(tmpl_name, tmpl_data) {
    if ( !render.tmpl_cache ) { 
        render.tmpl_cache = {};
    }

    if ( ! render.tmpl_cache[tmpl_name] ) {
        var tmpl_dir = 'templates';
        var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

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
        render.tmpl_cache[tmpl_name] = Handlebars.compile(tmpl_string);
    }

    return render.tmpl_cache[tmpl_name](tmpl_data);
}
