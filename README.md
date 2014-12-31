xpull
=====

Pull to refresh jQuery plugin for iOS and Android

This is one of the pull to refresh plugins for the web. What distinguishes it from the others is that it is lightweight, extremely easy to use and optimized for Android (mobile Chrome browser) and iOS (mobile safari). It also emulates elastic scroll on both platforms.
All animations and graphics are pure CSS3. Angular friendly.

>This plugin was initially made for [Spreya app](http://spreya.com/ "Spreya")

### Demo:

Open [sjovanovic.github.io/xpull/demo.html](http://sjovanovic.github.io/xpull/demo.html) on your iOS or Android device

### Install

Just include xpull.js and xpull.css in your page. 

Or install via Bower:

```
bower install xpull
```


### Usage:

Include xpull.css and xpull.js then:

 ```
 $('selector').xpull(options);
 ```

 Example

 ```
 $('#container').xpull({
    'callback':function(){
        console.log('Released...');
    }
 });
 ```

### Options:

``` 
{ 
    'pullThreshold':50, // Pull threshold - amount in  pixels required to pull to enable release callback
    'callback':function(){}, // triggers after user pulls the content over pull threshold and releases
    'spinnerTimeout':2000 // timeout in miliseconds after which the loading indicator stops spinning. If set to 0 - the loading will be indefinite
}  
``` 

 To get the instance of Xpull:

 ```
 var xpull = $('selector').data("plugin_xpull");
 ```

### Methods:

 * `reset()` - cancels he spinning and resets the plugin to initial state. Example: `$('#container').data('plugin_xpull').reset();`
 
 
### Angular

Xpull is also easy to use in Angular. Just use this example:

```
/*
  Xpull - pull to refresh jQuery plugin as Angular directive
*/
angular.module("xpull").directive("ngXpull", function() {
  return function(scope, elm, attr) {
    return $(elm[0]).xpull({
      'callback': function() {
        return scope.$apply(attr.ngXpull);
      }
    });
  };
});
```
Then in view add as attribute on your scrollable container:

```
 <div ng-xpull="reload()"></div>

```
