# FirefoxOS Bootstrap

A custom Bootstrap implementation made for FirefoxOS. The intent is to
mimic the FirefoxOS Building Blocks look and feel. You can checkout the examples
in http://ubersoldat.github.io/FirefoxOS/

Most of Bootstrap controls are kept as default and to some we append `-ffos` to
customize them, check the bootstrap.less file for more information.

## Colors

Colors are based on the official Mozilla documentation 
on http://www.mozilla.org/en-US/styleguide/identity/firefoxos/color/

## Controls

Some controls are based on Building Blocks as described in http://buildingfirefoxos.com/

# Resources

FirefoxOS Bootstrap uses:

* Twitter's Bootstrap 2.3.2
* FontAwesome 3.1.0
* lessc 1.3.3
* jQuery 2.0.0
* Handlebars (example page)

# Contribute

To build you'll need `lessc` installed. Then, clone this repo and download the
less sources for Bootstrap and FontAwesome. Uncompress the `less` sources in
`FirefoxOS-Bootstrap/less/`. 

Check the file `FirefoxOS-Bootstrap/less/FirefoxOS/bootstrap.less` for the correct paths.