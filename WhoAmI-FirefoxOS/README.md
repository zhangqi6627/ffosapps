## Who Am I ?
===========================

##About

This app was meant to be used at the point of sale of Firefox OS devices. It will display the device hardware information and a short animated intro of the Foxy.
Instead of keeping the device with the screen turned off, we provide a charming solution that will attract buyers for sure.

##Live Demo
An up-to-date version of the app can be found at
http://marcussaad.com/whoami/foxy.html

##Supported Devices

- Alcatel One Touch Fire
- LG Fireweb
- ZTE Open

Support for new devices will be added as they are released. Feel free to contribute to us.

##Next Steps

- Documentation
- Marketplace link

##Contribute to us

If you care about the Open Web and Open Plataforms, you are one of us. Please, feel free to fork and PR your changes. We'll be glad to update and sharpen this app.

## L10N this app!

Want to contribute but you not comfortable with coding? Say no more. You can help us localizing this app to your native language, so that it can be used around the world! It's simple and easy, let's learn how it's possible.

This app uses gaia's localizing library known as webl10n (Thanks Fabien Cazenave for such a powerful tool), and uses .properties files with the strings that will be translated automagically.

###Step 1
	- Inside the locales folder, create a file following the name pattern such as "pt-BR.properties", "es.properties" etc.
	- Inside this file you'll find key/value strings. Keep the same structure, but only translate what is after the = symbol.
	- Ex: An en-US to es translation would be 
    	general.specification = Especificaciones   


###Step 2
	- Find the file locales.ini, inside the locales folder.
	- Edit the file and include an import rule, like the following @import url(your language ISO-639-1 code here.properties)
    - Above the import rule, include the language iso code inside square brackets. Like [en-US], [pt-BR], [es] etc.

###Step 3

If you made to here, Thank you very much! If you know how to use github, please send us a pull request. If not, you can email us your translation and we'll add it to the app.

##License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

##Special Thanks

Thanks to

- Bruno Vilar for testing the app and contributing with ideas to make it better.
- Luigui Delyer for helping with the design and contributing with ideas too.





