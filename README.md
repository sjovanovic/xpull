xpull
=====

Pull to refresh jQuery plugin for touch devices.

This is one of the pull to refresh plugins for the web. What distinguishes it from the others is that it is lightweight, extremely easy to use and optimized for Android (mobile Chrome browser) and iOS (mobile safari). It also emulates elastic scroll on both platforms.
All animations and graphics are pure CSS3. Angular friendly.

### Demo:

Open [sjovanovic.github.io/xpull/demo.html](http://sjovanovic.github.io/xpull/demo.html) on your iOS or Android device

### Install

Just include xpull.js and xpull.css in your folder. 
Or install via Bower:

```
bower install xpull
```


### Usage:

Include xpull.css and xpull.js in your page
```
    <link rel="stylesheet" href="xpull.css">
    <script src="xpull.js"></script>
```

Add html markup on your page in element where need Pull to refresh feature
```
<div class="xpull">
    <div class="xpull__start-msg">
        <div class="xpull__start-msg-text">Pull Down &amp; Release to Refresh</div>
        <div class="xpull__arrow"></div>
    </div>
    <div class="xpull__spinner">
        <div class="xpull__spinner-circle"></div>
    </div>
</div>
```
Simple for change and styling use HTML and CSS.
Classes used in plugin:
```
.xpull - container for plugin element
.xpull_pulled - add class to .xpull when user pulls the content over pull threshold
.xpull__start-msg - element show when user pulls the content
.xpull__spinner - loader
```

Init plugin with options
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
    paused: false,  // Is the pulling paused ?
    pullThreshold: 50, // Pull threshold - amount in  pixels required to pull to enable release callback
    maxPullThreshold: 50, // Max pull down element - amount in pixels
    spinnerTimeout: 2000 // timeout in miliseconds after which the loading indicator stops spinning. If set to 0 - the loading will be indefinite
    scrollingDom: $(selector), // For arbitrary nesting. The scrolling element is not the same as element that pulls-down on reload. 
    onPullStart: function(){}, // triggers after user start pulls the content 
    onPullEnd: function(){}, // triggers after user end pulls the content 
    callback: function(){}, // triggers after user pulls the content over pull threshold and releases
}
``` 

 To get the instance of Xpull:

 ```
 var xpull = $('selector').data("plugin_xpull");
 ```

### Methods:

 * `reset()` - cancels he spinning and resets the plugin to initial state. Example: `$('#container').data('plugin_xpull').reset();`
 * `destroy()` - destroy plugin and go to initial state. Example: `$('#container').data('plugin_xpull').destroy();`
 
### Pausing:

* You can simply pause the handling of pull event, by simply setting the value of *paused* property, e.g.:
`$('#container').data('plugin_xpull').options.paused = true; // or: false`

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
