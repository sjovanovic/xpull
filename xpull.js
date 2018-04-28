/*
 Xpull - pull to refresh jQuery plugin for touch devices
 by Slobodan Jovanovic

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
    paused: false,  // Is the pulling paused ?
    pullThreshold: 50, // Pull threshold - amount in  pixels required to pull to enable release callback
    maxPullThreshold: 50, // Max pull down element - amount in pixels
    spinnerTimeout: 2000 // timeout in miliseconds after which the loading indicator stops spinning. If set to 0 - the loading will be indefinite
    onPullStart: function(){}, // triggers after user start pulls the content
    onPullEnd: function(){}, // triggers after user end pulls the content
    callback: function(){}, // triggers after user pulls the content over pull threshold and releases
}

 To get the thatance of Xpull:

 var xpull = $('selector').data("plugin_xpull");

  Methods:

  reset() - cancels he spinning and resets the plugin to initial state. Example: $('#container').data('plugin_xpull').reset();
  destroy() - destroy plugin and go to initial state. Example: $('#container').data('plugin_xpull').destroy();

*/
;
(function($, window, document) {
    var pluginName = 'xpull',
        defaults = {
            paused: false,
            pullThreshold: 50,
            maxPullThreshold: 50,
            spinnerTimeout: 2000,
            scrollingDom: null, // if null, specified element
            onPullStart: function() {},
            onPullEnd: function() {},
            onPullThreshold: function() {},
            onPullThresholdReverse: function() {},
            callback: function() {}
        };

    function Plugin (element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            var ofstop = 0,
                that = this,
                fingerOffset = 0,
                top = 0,
                hasc = false,
                elm = {};

            that.$element = $(that.element);
            that.elm = elm = that.$element.children(':not(.xpull)');
            that.indicator = that.$element.find('.xpull:eq(0)');
            that.indicator.css({display: 'block'});
            that.spinner = that.indicator.find('.xpull__spinner:eq(0)');
            that.startBlock = that.indicator.find('.xpull__start-msg:eq(0)');
            that.indicatorHeight = that.indicator.outerHeight();

            that._changeStyle(-that.indicatorHeight, true);
            that.$element.css({
                '-webkit-overflow-scrolling': 'touch',
                'overflow-scrolling': 'touch'
            });

            ofstop = that.$element.offset().top;

            that.elast = true;
            that.startBlock.css('visibility', 'hidden');
            that.indicatorHidden = true;
            elm.unbind('touchstart.' + pluginName);
            elm.on('touchstart.' + pluginName, function (ev) {
                if (that.options.paused) {
                    return false;
                }

                that.options.onPullStart.call(this);
                fingerOffset = ev.originalEvent.touches[0].pageY - ofstop;
            });
            elm.unbind('touchmove.' + pluginName);
            elm.on('touchmove.' + pluginName, function(ev) {

                if (that.options.paused) {
                    return false;
                }

                if (elm.position().top < 0 || (that.options.scrollingDom || that.$element).scrollTop() > 0 || document.body.scrollTop > 0) { // trigger callback only if pulled from the top of the list
                    return true;
                }

                if (that.indicatorHidden) {
                    that.startBlock.css('visibility', 'visible');
                    that.indicatorHidden = false;
                }
                top = (ev.originalEvent.touches[0].pageY - ofstop - fingerOffset);

                if (top > 1) {

                    if (that.elast) {
                        $(document.body).on('touchmove.' + pluginName, function(e) {
                            e.preventDefault();
                        });
                        that.elast = false;
                    }

                    if (top <= (parseInt(that.options.pullThreshold) + that.options.maxPullThreshold)) {
                        that._changeStyle((top - that.indicatorHeight), false);
                    }

                    if (top > that.options.pullThreshold && !hasc) {
                        that.indicator.addClass('xpull_pulled');
                        that.options.onPullThreshold.call(this);
                    } else if (top <= that.options.pullThreshold && hasc) {
                        that.indicator.removeClass('xpull_pulled');
                        that.options.onPullThresholdReverse.call(this);                        
                    }

                } else {
                    $(document.body).unbind('touchmove.' + pluginName);
                    that.elast = true;
                }
                hasc = that.indicator.hasClass('xpull_pulled');

            });
            elm.unbind('touchend.' + pluginName);
            elm.on('touchend.' + pluginName, function () {

                if (that.options.paused) {
                    return false;
                }

                that.options.onPullEnd.call(this);
                if (top > 0) {
                    if (top > that.options.pullThreshold) {
                        that.options.callback.call(this);
                        that.startBlock.hide();
                        that.spinner.show();
                        that.options.paused = true;

                        that._changeStyle(0, true);

                        if (that.options.spinnerTimeout) {
                            setTimeout(function () {
                                that.reset();
                            }, that.options.spinnerTimeout);
                        }

                    } else {
                        that._changeStyle(-that.indicatorHeight, true);
                    }
                    top = 0;
                }
                if (!that.indicatorHidden) {
                    that.startBlock.css('visibility', 'hidden');
                    that.indicatorHidden = true;
                }
                setTimeout(function() {
                    elm.css({
                        'transition': ''
                    });
                    that.indicator.css({
                        'transition': ''
                    });
                    $(document.body).unbind('touchmove.' + pluginName);
                    that.elast = true;
                }, 300);
            });
        },

        // manipulate styles for elements
        _changeStyle: function (top, transition) {
            var changeCss = {
                transform: 'translate3d(0px, ' + top + 'px, 0px)',
                transition: 'transform 300ms ease'
            };

            if (!transition) {
                changeCss.transition = '';
            }

            this.indicator.css(changeCss);
            this.elm.css(changeCss);
        },

        // reset
        reset: function() {
            var that = this;

            that._changeStyle(-that.indicatorHeight, true);

            setTimeout(function() {
                that.startBlock.show();
                that.spinner.hide();
                that.options.paused = false;
                that.indicator.removeClass('xpull_pulled');

                that._changeStyle(-that.indicatorHeight, false);
                $(document.body).unbind('touchmove.' + pluginName);
                that.elast = true;
            }, 300);
        },

        // destroy
        destroy: function () {
            var that = this,
                elm = that.elm;

            // remove styles
            that._changeStyle(0);
            that.indicator.css({display: 'none'});

            // off listener
            elm.off('touchstart.' + pluginName);
            elm.off('touchmove.' + pluginName);
            elm.off('touchend.' + pluginName);
            $(document.body).off('touchmove.' + pluginName);

            that.$element.removeData('plugin_' + pluginName);
        }
    };
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
