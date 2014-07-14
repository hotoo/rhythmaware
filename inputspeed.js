
var InputSpeed = function(speed){

  var time = speed || 0;
  var maxTime = 2000;
  var startAt = null;
  var endAt = null;
  var counter = 0;
  var scale = 0.618;

  // reset inputting process.
  function reset(){
    startAt = null;
    endAt = null;
    counter = 0;
  }

  function exec(){
    if (!!startAt && !!endAt){ // this.__inRunning
      var t = (endAt - startAt) / (counter - 1);
      t = time===0 ? t : (time * (1 - scale) + t * scale); // 毫秒每次击键(ms/pre)
      if (t < maxTime){time = t;}
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
    if (now - startAt > 0){
      endAt = now;
      exec();
    }
  }

  this.timeout = function(){
    if (!!endAt){
      reset();
    }
  };

  this.delay = function(){
    return time===0?200:(time+Math.sqrt(time)+120);
  };
};

module.exports = InputSpeed;
