# Patterns matching CSS files that should be minified. Files with a -min.css
# suffix will be ignored.
CSS_FILES = assets/css/fonts.css assets/css/ratchet.css assets/css/app.css

# Patterns matching JS files that should be minified. Files with a -min.js
# suffix will be ignored.
JS_FILES = $(filter-out %-min.js js.js %deflate.js %inflate.js,$(wildcard \
	assets/js/**/*.js \
	assets/js/*.js \
))


# Command to run to execute the YUI Compressor.
YUI_COMPRESSOR = java -jar yuicompressor-2.4.8.jar

# Flags to pass to the YUI Compressor for both CSS and JS.
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose

CSS_MINIFIED = $(CSS_FILES:.css=-min.css)
JS_MINIFIED = $(JS_FILES:.js=-min.js)

# target: minify - Minifies CSS and JS.
#minify: minify-css minify-js
minify: minify-css minify-js

# target: minify-css - Minifies CSS.
minify-css: $(CSS_FILES) $(CSS_MINIFIED)

# target: minify-js - Minifies JS.
minify-js: $(JS_FILES) $(JS_MINIFIED)

app: concat_css
	mkdir -p app/assets/css
	cp -r assets/fonts app/assets/fonts
	cp -r assets/img app/assets/img
	cp -r assets/js app/assets/js
	mv concat_css app/assets/css/css.css
	cp -r index.html app/index.html
	perl -pi -e 's#<link href="assets/css/app.css" rel="stylesheet" />#<link href="assets/css/css.css" rel="stylesheet" />#' app/index.html
	cp -r locales app/locales
	cp -r manifest.webapp app/manifest.webapp
	rm -f assets/css/css.css
	terminal-notifier -title "Make" -message "The target all: is complete"

zip: app
	cd app/ && zip -r -9 ../eBook.zip *

concat_css: $(CSS_MINIFIED)
	perl -pi -e 's#\@import[^;]*;##gis' $^
	cat $^ >$@
	rm -f $(CSS_MINIFIED)

%-min.css: $(filter-out %-min.css css.css, %.css)
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type css $< >$@
	@echo

# target: clean - Removes minified CSS and JS files.
clean:
	rm -rf app/
	rm -f eBook.zip

# target: help - Displays help.
help:
	@egrep "^# target:" Makefile
