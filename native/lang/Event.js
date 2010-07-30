/*<![CDATA[*/

if (!window.Event) var Event = new Object();

Event = {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,

  element: function(event) {
    return event.target || event.srcElement;
  },
  
  keyCode : function(event){
  	return event.keyCode||event.which;
  },

  isLeftClick: function(event) {
    return (event.which===1 || event.button===1);
	//return (((event.which) && (event.which == 1)) ||
    //        ((event.button) && (event.button == 1)));
  },

  pointerX: function(event) {
    return event.pageX || (event.clientX + 
      (document.documentElement.scrollLeft || document.body.scrollLeft));
  },

  pointerY: function(event) {
    return event.pageY || (event.clientY + 
      (document.documentElement.scrollTop || document.body.scrollTop));
  },

  stop: function(event) {
    if (event.preventDefault) { 
      event.preventDefault(); 
      event.stopPropagation(); 
    } else {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  },

  // find the first node with the given tagName, starting from the
  // node the event was triggered on; traverses the DOM upwards
  findElement: function(event, tagName) {
    var element = Event.element(event);
    while (element.parentNode && (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
    return element;
  },

  observers: false,
  
  _observeAndCache: function(element, name, observer, useCapture) {
    if (!this.observers) this.observers = [];
    if (element.addEventListener) {
      this.observers.push([element, name, observer, useCapture]);
      element.addEventListener(name, observer, useCapture);
    } else if (element.attachEvent) {
      this.observers.push([element, name, observer, useCapture]);
      element.attachEvent('on' + name, observer);
    }
  },
  
  unloadCache: function() {
    if (!Event.observers) return;
    for (var i = 0; i < Event.observers.length; i++) {
      Event.stopObserving.apply(this, Event.observers[i]);
      Event.observers[i][0] = null;
    }
    Event.observers = false;
  },

  observe: function(element, name, observer, useCapture) {
    //var element = $(element);
    useCapture = useCapture || false;
    
    if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
        || element.attachEvent))
      name = 'keydown';
    
    this._observeAndCache(element, name, observer, useCapture);
  },

  stopObserving: function(element, name, observer, useCapture) {
    //var element = $(element);
    useCapture = useCapture || false;
    
    if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
        || element.detachEvent))
      name = 'keydown';
    
    if (element.removeEventListener) {
      element.removeEventListener(name, observer, useCapture);
    } else if (element.detachEvent) {
      element.detachEvent('on' + name, observer);
    }
  }
};
/**
 * 为target对象注册事件监听。
 * @param {HTMLElement} target DOM Element, 注册事件的目标对象。
 * @param {String} evt 事件名称。
 * @param {Function} handler 事件触发时的处理程序。
 */
Event.addEventListener = function(target, evt, handler){
    if (target.addEventListener) { // Firefox.
        target.addEventListener(evt, handler, false);
    } else if (target.attachEvent) { // IE.
        target.attachEvent("on" + evt, handler);
    } else {
        //target["on" + evt] = handler;
		//if (!Event.Listener["on"+evt]) Event.Listener["on"+evt] = new Array();
		//Event.Listener["on"+evt][Event.Listener["on"+evt].length] = handler;
    }
};
/**
 * 为target元素对象取消事件监听。
 * @param {HTMLElement} target 被注册元素对象。
 * @param {String} evt 被注册事件名。
 * @param {Function} handler 事件处理函数。
 */
Event.removeEventListener = function (target, evt, handler) {
    if (target.removeEventListener) {
        target.removeEventListener(evt, handler, false);
    } else if (target.detachEvent) {
        target.detachEvent("on" + evt, handler);
    } else {
        //target["on" + evt] = null;
    }
};
/**
 * 触发对象o(如按钮)的事件名为n(如：click)的事件。
 * @param {Object} o 目标触发对象。
 * @param {String} n 被触发事件名称。
 */
Event.fire = function(o,n){
    if (o && o.fireEvent) { //document.all
        o.fireEvent("on"+n);
    }else {
        var e = document.createEvent('MouseEvent');
        e.initEvent(n, false, false);
        o.dispatchEvent(e);
    }
};

/**
 * 用户自定义事件对象。
 * 为HTML元素(HTMLElement)绑定/取消绑定用户自定义事件的名字空间对象。
 * @namespace org.xianyun.system;
 * @extends Object
 * @constructor {static} UserDefinedEvent
 * 
 * @author 闲耘 (xianyun.org, mail[AT]xianyun.org)
 * @version 1.0, 2007/11/24
 */
var UserDefinedEvent = new Object();

/**
 * 为HTML元素绑定用户自定义事件(非浏览器的预定义事件)。
 * @param {HTMLElement} target 附着事件的目标HTML元素对象。
 * @param {String} evt 事件名称/类型。
 * @param {Function} handler 被附着事件的引用。
 */
UserDefinedEvent.addEventListener = function(target, evt, handler){
	if (!target["uon"+evt]){
		target["uon"+evt] = function(){
			for (var i=0; i<target["uon"+evt]._listeners.length; i++){
				target["uon"+evt]._listeners[i]();
			}
		};
		target["uon"+evt]._listeners = new Array();
	}
	target["uon"+evt]._listeners.push(handler);
};
/**
 * 为HTML元素对象取消绑定用户自定义事件。
 * @param {HTMLElement} target 附着事件的目标HTML元素对象。
 * @param {String} evt 事件名称/类型。
 * @param {Function} handler 被附着事件的引用。
 */
UserDefinedEvent.removeEventListener = function(target, evt, handler){
	if (!target["uon"+evt]) return;
	target["uon"+evt]._listeners.remove(handler);
};

/*]]>*/