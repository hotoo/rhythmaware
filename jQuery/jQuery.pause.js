(function($){
    var InputSpeed = function(speed){
        var time = speed||0,
            maxTime = 5000,
            startAt = null,
            endAt = null,
            counter = 0,
            scale = 0.618;

        // reset inputting process.
        function reset(){
            startAt = null;
            endAt = null;
            counter = 0;
        };
        function exec(){
            if (!!startAt && !!endAt){ // this.__inRunning
                var t = (endAt-startAt)/(counter-1);
                t = time===0?t:(time*(1-scale)+t*scale); // 毫秒每次击键(ms/pre)
                if (t<maxTime){time = t;}
            }
            return time;
        }
        this.keydown = function(){
            var now = new Date().valueOf();
            if (!!startAt && !endAt){
                if (now-startAt>=maxTime){reset();}
            }

            if (!startAt){startAt = now;}
            counter++;
            if (now-startAt>0){
                endAt = now;
                exec();
            }
        };
        this.timeout = function(){
            t = null;
            if (!!endAt){
                reset();
            }
        };
        this.delay = function(){
            return time===0?800:(time+Math.sqrt(time)+180);
        };
    };
    var Speed = new InputSpeed();
    $.fn.rhythmaware = function(options){
        var defaults = {
            pause:function(){},
            input:function(){},
            hover:function(){},
            delay:800
        };
        var settings = $.extend(settings, defaults, options);
        this.each(function(){
            var _this=this, $this=$(this);
            var lastValue = this.value;

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
                settings.pause.call(_this);
            }
            function fireInput(){
                settings.input.call(_this);
            }

            $this.keydown(function(evt){
                Speed.keydown();
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
                    timer = window.setTimeout(function(){
                        firePause();
                        Speed.timeout();
                    }, Speed.delay());

                    fireInput();
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
    $.fn.pause = function(fn){
        this.rhythmaware({"pause":fn});
    };
    $.fn.input = function(fn){
        this.rhythmaware({"input":fn});
    };
})(jQuery);
