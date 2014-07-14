
var $ = require("jquery");
var Events = require("arale-events");
var InputSpeed = require("./inputspeed");

// 整个文档应该共用用户输入速度计算的对象。
// 用户输入速度是全局的，不是在不同输入框实例中不同。
// 甚至建议后台系统配合存储和初始化用户输入速度个性化数据。
var speed = new InputSpeed();

// 输入节奏智能感知器。
// @param {HTMLElement, String} element or selector.
var RhythmAware = function(element){

  var $element = $(element);
  var evt = new Events();

  //var lastValue = $element.val();
  var timer = null;

  function clearTimer(){
    if(timer){
      window.clearTimeout(timer);
      timer = null;
    }
  }

  //function isChanged(){
    //return _this.value === lastValue;
  //}

  function firePause(){
    clearTimer();
    evt.trigger("pause");
  }

  function fireInput(){
    evt.trigger("input");
  }

  this.on = function(eventName, handler){
    evt.on(eventName, handler, this);
    return this;
  };
  this.off = function(eventName, handler){
    evt.off(eventName, handler);
    return this;
  };

  $element.keydown(function(evt){

    speed.keydown();

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
        speed.timeout();
      }, speed.delay());

      fireInput();
    }

  }).blur(function(){

    firePause();

  }).change(function(){

    firePause();

  });
  //$this.keyup(function(){});

  return this;
};


module.exports = RhythmAware;
