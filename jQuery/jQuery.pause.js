(function($){
    $.fn.pause = function(fn, delay){
        this.each(function(){
            var _this=this, $this=$(this);
            var lastValue = this.value;
            if(!delay){delay = 1000;}

            var timer = null;

            function clearTimer(){
                if(timer){
                    window.clearTimeout(timer);
                    timer = null;
                }
            }
            function isChanged(){
                return _this.value==lastValue;
            }
            function firePause(){
                clearTimer();
                fn.call(_this);
            }

            $this.keydown(function(evt){
                switch(evt.keyCode){
                case 37: // LEFT.
                case 38: // UP.
                case 39: // RIGHT.
                case 40: // DOWN.
                    break;
                case 13: // RETURN.
                    firePause();
                    break;
                default:
                    clearTimer();
                    timer = window.setTimeout(firePause, delay);
                    // inputting...
                }
            });
            //$this.keyup(function(){});
            $this.blur(function(){
                clearTimer();
            });
            $this.change(function(evt){
                firePause();
            });
        });
    };
})(jQuery);
