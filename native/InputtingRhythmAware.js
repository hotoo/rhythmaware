/*<![CDATA[*/
/**
 * @class 输入节奏感知器。
 * @namespace org.xianyun.elements.utils;
 * @extends Object
 * @constructor new InputtingRhythmAware(HTMLElement);
 * @param {HTMLElement} inputElement 支持节奏感知的目标元素对象。
 * @since IE5.0, Firefox1.0, Opera8.0, Netscape8.0
 *
 * @author 闲耘 (xianyun.org, mail@xianyun.org)
 * @version 0.8, 2007/11/23
 */
var InputtingRhythmAware = function(inputElement){
	this._element = inputElement;
	this.lastPauseValue = inputElement.value||""; // 输入框最后一次感知停顿时的文本值。
	this.isBusy = false;
	this.delay = 1000; // 1.0 sec. 停顿1.0秒时执行任务。

	this.handlers = {
		keypress:Function.createDelegate(this, this.onKeypress),
		keydown:Function.createDelegate(this, this.onKeydown),
		keyup:Function.createDelegate(this, this.onKeyup),
		focus:Function.createDelegate(this, this.onFocus),
		blur:Function.createDelegate(this, this.onBlur),
		change:Function.createDelegate(this, this.onChange),
		pause:Function.createDelegate(this, this.onPause)
	};

	//Event.addEventListener(this._element, "keypress", this.handlers.keypress);
	Event.addEventListener(this._element, "keydown", this.handlers.keydown);
	Event.addEventListener(this._element, "keyup", this.handlers.keyup);
	//Event.addEventListener(this._element, "focus", this.handlers.focus);
	Event.addEventListener(this._element, "blur", this.handlers.blur);
	Event.addEventListener(this._element, "change", this.handlers.change);
};

/**
 * {protected}
 * 取消输入过程的中断/暂停事件。
 * @ignore
 */
InputtingRhythmAware.prototype.clearPause = function(){
	if (this.__pause){
		window.clearTimeout(this.__pause);
		this.__pause = null;
	}
};

/**
 * 判断当前输入框中文本在最后一次输入中断/暂停后是否被改变。
 * @return {Boolean}
 */
InputtingRhythmAware.prototype.isChanged = function(){
	return this._element.value!==this.lastPauseValue;
};

/**
 * {protected}
 * 键盘按下。
 */
InputtingRhythmAware.prototype.onKeydown = function(evt){
	this.clearPause();

	var k = Event.keyCode(window.event||evt);
	if ([Event.KEY_DOWN, Event.KEY_LEFT,
		Event.KEY_RIGHT, Event.KEY_UP].contains(k)){
		return;
	} else if (Event.KEY_RETURN===k) {
		this.onPause();
	} else {
		this.__pause = window.setTimeout(this.handlers.pause, this.delay);
		if (this._element.uoninput instanceof Function) this._element.uoninput();
	}
};

//InputtingRhythmAware.prototype.onKeypress = function(evt){};

/**
 * {protected}
 * 键盘弹起。
 * @param {Object} evt
 */
InputtingRhythmAware.prototype.onKeyup = function(evt){
};

//InputtingRhythmAware.prototype.onFocus = function(){};

/**
 * {protected}
 * 输入框失去焦点。
 */
InputtingRhythmAware.prototype.onBlur = function(){
	this.clearPause();
};

/**
 * {protected}
 * 输入框内容被改变。
 */
InputtingRhythmAware.prototype.onChange = function(){
	this.onPause();
};

/**
 * {protected}
 * 输入过程中断/暂停。
 */
InputtingRhythmAware.prototype.onPause = function(){
    this.clearPause();
	//if (this.__pause) this.__pause = null;
	if (this._element.uonpause instanceof Function) this._element.uonpause();
	this.lastPauseValue = this._element.value;
};
/*]]>*/
