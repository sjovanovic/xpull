xpull
=====

Pull to refresh jQuery plugin for iOS and Android

>This plugin was initially made for [Spreya app](http://spreya.com/ "Spreya")

### Demo:

Open [sjovanovic.github.io/xpull/demo.html](http://sjovanovic.github.io/xpull/demo.html) on your iOS or Android device

### Usage:

Include xpul.css and xpull.js then:

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
     'pullThreshold':50, // Pull threshold - amount in  pixels after which the callback is activated
    'callback':function(){}, // triggers after user pulls the content over pull threshold
    'spinnerTimeout':2000 // timeout in miliseconds after which the loading indicator stops spinning. If set to 0 - the loading will be indefinite
}  
``` 

 To get the instance of Xpull:

 ```
 var xpull = $('selector').data("plugin_xpull");
 ```

### Methods:

 * `reset()` - cancels he spinning and resets the plugin to initial state. Example: `$('#container').data('plugin_xpull').reset();`
