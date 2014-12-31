/*
 Xpull - pull to refresh jQuery plugin for iOS and Android
 by Slobodan Jovanovic
 Initially made for Spreya app spreya.com

 Usage:

 $('selector').xpull(options);

 Example

 $('#container').xpull({
    'callback':function(){
        console.log('Released...');
    }
 });

 Options:

 {
    'pullThreshold':50, // Pull threshold - amount in pixels after which the callback is activated
    'callback':function(){}, // triggers after user pulls the content over pull threshold
    'spinnerTimeout':2000 // timeout in miliseconds after which the loading indicator stops spinning. If set to 0 - the loading will be indefinite
 }

 To get the instance of Xpull:

 var xpull = $('selector').data("plugin_xpull");

  Methods:

  reset() - cancels he spinning and resets the plugin to initial state. Example: $('#container').data('plugin_xpull').reset();
  
*/

;(function ( $, window, document, undefined ) {
    var pluginName = "xpull",
        defaults = {
            pullThreshold:50,
            spinnerTimeout:2000,
            callback:function(){}
        };
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
        	var inst = this;
            var elm = $(inst.element).children();
            inst.elm = elm;
            elm.parent().find('.pull-indicator').remove();
            elm.parent().prepend('<div class="pull-indicator"><div class="arrow-body"></div><div class="triangle-down"></div><div class="pull-spinner"></div></div>');
            inst.indicator = elm.parent().find('.pull-indicator:eq(0)');
            inst.spinner = elm.parent().find('.pull-spinner:eq(0)');
            inst.arrow = elm.parent().find('.arrow-body:eq(0),.triangle-down:eq(0)');
            inst.indicatorHeight = inst.indicator.outerHeight();
            $(elm).css({
    			'-webkit-transform':"translate3d(0px, -"+inst.indicatorHeight+"px, 0px)"
    		});
            elm.parent().css({
            	'-webkit-overflow-scrolling': 'touch',
    			'overflow-y':'auto'
    		});
            var ofstop = elm.parent().offset().top;
      		var fingerOffset = 0;
      		var top = 0;
      		var hasc = false;
      		inst.elast = true;
            inst.arrow.css('visibility', 'hidden');
            inst.indicatorHidden = true;
      		elm.unbind('touchstart.'+pluginName);
            elm.on('touchstart.'+pluginName, function(ev){
            	fingerOffset = ev.originalEvent.touches[0].pageY - ofstop
            });
            elm.unbind('touchmove.'+pluginName);
        	elm.on('touchmove.'+pluginName, function(ev){
        		if(elm.position().top < 0 || elm.parent().scrollTop() > 0){
        			return true;
        		}
                if(inst.indicatorHidden){
                    inst.arrow.css('visibility', 'visible');
                    inst.indicatorHidden = false;
                }
        		top = (ev.originalEvent.touches[0].pageY - ofstop - fingerOffset);
        		if(top > 1){
        			
        			if(inst.elast){
        				$(document.body).on('touchmove.'+pluginName,function(e){
							e.preventDefault();
						});
						inst.elast = false;
        			}
	        		$(elm).css({
	        			'-webkit-transform': "translate3d(0px, " + (top - inst.indicatorHeight) + "px, 0px)"
	        		});
					inst.indicator.css({
		        		'top': (top - inst.indicatorHeight) + "px"
		        	});
	        		if(top > inst.options.pullThreshold && !hasc){
		        		inst.indicator.addClass('arrow-rotate-180');
		        	}else if(top <= inst.options.pullThreshold && hasc){
		        		inst.indicator.removeClass('arrow-rotate-180');
		        	}
	        	}else{
	        		$(document.body).unbind('touchmove.'+pluginName);
        			inst.elast = true;
	        	}
	        	hasc = inst.indicator.hasClass('arrow-rotate-180');
	        	
        	});
			elm.unbind('touchend.'+pluginName);
        	elm.on('touchend.'+pluginName, function(ev){
        		if(top > 0){
	        		if(top > inst.options.pullThreshold){
	        			inst.options.callback.call(this);
	        			inst.arrow.hide();
	        			inst.spinner.show();
	        			elm.css({
		        			'-webkit-transform':'translate3d(0px, 0px, 0px)',
		        			'-webkit-transition': '-webkit-transform 300ms ease'
		        		});
			        	inst.indicator.css({
			        		'top': "0px",
			        		'-webkit-transition': 'top 300ms ease'
			        	});
			        	if(inst.options.spinnerTimeout){
			        		setTimeout(function(){
			        			inst.reset();
			        		}, inst.options.spinnerTimeout);
			        	}
			        	
	        		}else{
	        			inst.indicator.css({
			        		'top': "-"+inst.indicatorHeight+"px",
			        		'-webkit-transition': 'top 300ms ease'
			        	});
	        			elm.css({
		        			'-webkit-transform':'translate3d(0px, -'+inst.indicatorHeight+'px, 0px)',
		        			'-webkit-transition': '-webkit-transform 300ms ease'
		        		});
	        		}
	        		top = 0;
        		}
                if(!inst.indicatorHidden){
                    inst.arrow.css('visibility', 'hidden');
                    inst.indicatorHidden = true;
                }
        		setTimeout(function(){
        			//inst.indicator.removeClass('arrow-rotate-180');
        			elm.css({
	        			'-webkit-transition': ''
	        		});
	        		inst.indicator.css({
	        			'-webkit-transition': ''
	        		});
	        		$(document.body).unbind('touchmove.'+pluginName);
	        		inst.elast = true;
        		}, 300);
        	});
        },
        reset:function(){
        	var inst = this;
            var elm = inst.elm;
			inst.indicator.css({
        		'top': "-"+inst.indicatorHeight+"px",
        		'-webkit-transition': 'top 300ms ease'
        	});
			elm.css({
    			'-webkit-transform':'translate3d(0px, -'+inst.indicatorHeight+'px, 0px)',
    			'-webkit-transition': '-webkit-transform 300ms ease'
    		});
        	setTimeout(function(){
        		inst.arrow.show();
				inst.spinner.hide();
				inst.indicator.removeClass('arrow-rotate-180');
				elm.css({
        			'-webkit-transition': ''
        		});
        		inst.indicator.css({
        			'-webkit-transition': ''
        		});
        		$(document.body).unbind('touchmove.'+pluginName);
        		inst.elast = true;
        	}, 300);
        },
        insertCss:function (css, id) {
            var el = document.getElementById(id);
            if (el) {
                el.parentNode.removeChild(el);
            }
            var csse = document.createElement('style');
            csse.type = 'text/css';
            csse.id = id;
            if (csse.styleSheet) {
                document.getElementsByTagName("head")[0].appendChild(csse);
                csse.styleSheet.cssText = css;
            }
            else {
                var rules = document.createTextNode(css);
                csse.appendChild(rules);
                document.getElementsByTagName("head")[0].appendChild(csse);
            }
        }
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );