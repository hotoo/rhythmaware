/*<![CDATA[*/
/**
 * 用户输入频率/速度。
 * @namespace org.xianyun.elements.utils;
 * @extends Object
 * @constructor new InputSpeed(HTMLElement);
 * @param {HTMLElement} element
 * @since IE5.0, Firefox1.0, Opera8.0, Netscape8.0
 * 
 * @author 闲耘 (mail[AT]xianyun.org)
 * @version 0.9, 2007/11/24
 */
var InputSpeed = function(element){
	this._element = element;
	this.time = 0; // 毫秒每按键，用户平均输入一个字符需要的时间。
	this.maxTime = 5000; // 最大毫秒每按键时间，计算结果超过此值则忽略。
	this.__startAt = null; // 连续输入的起始时间。
	this.__endAt = null; // 连续输入的结束时间。
	this.__counter = 0; // 连续按键过程中，已按键次数。
	this.__scale = 0.618; // 最近的平均速度与之前的平均速度的比例，这里取黄金分割点。
	
	this.handler = {
		keydown:Function.createDelegate(this, this.onKeydown),
		keyup:Function.createDelegate(this, this.onKeyup),
		keypress:Function.createDelegate(this, this.onKeypress)
	};
	
	Event.addEventListener(element, "keydown", this.handler.keydown);
	Event.addEventListener(element, "keypress", this.handler.keypress);
	Event.addEventListener(element, "keyup", this.handler.keyup);
};
/**
 * 根据用户输入速度计算下次超时时间。
 * 默认起始状态下用户超过1000毫秒未输入则视为一次输入过程结束，系统运行时将根据用户的输入速度自动调整。
 * @return {Number} 正常情况下平均一次按键动作需要的时间 + 延迟时间（延迟时间根据用户输入速度调整）。
 * @ignore
 */
InputSpeed.prototype.getDelay = function(){
	//return Math.sqrt((this.time+(this.time<=1000?1000:Math.sqrt(this.time/1000)*1000))/1000)*1000;
	return this.time===0?1000:(this.time+Math.sqrt(this.time)+180);
};
/**
 * 初始化一次输入过程状态标识。
 */
InputSpeed.prototype.__initInputProcess = function(){
	this.__startAt = null; // 连续输入的起始时间。
	this.__endAt = null; // 连续输入的结束时间。
	this.__counter = 0; // 连续按键过程中，已按键次数。
};
InputSpeed.prototype.clearTimeout = function(){
	if (this.__t){
		window.clearTimeout(this.__t);
		this.__t = null;
	}
};
InputSpeed.prototype.onKeydown = function(evt){
	var now = new Date().valueOf();
	// 严重超时。
	// 输入速度较慢的用户第一次按键和第一次按键超时，但仍在最大超时范围maxTime内，则调整超时范围。
	if (!!this.__startAt && !this.__endAt){
		if (now-this.__startAt>=this.maxTime)
			this.__initInputProcess();
	}
		
	this.clearTimeout();
	if (!this.__startAt) this.__startAt = now;
	this.__counter++;
	if (now-this.__startAt>0){
		this.__endAt = now;
		this._doTime();
	}
	this.__t = window.setTimeout(Function.createDelegate(this, this.onTimeout), this.getDelay());
};
InputSpeed.prototype.onKeypress = function(){
	// 使用Google，智能ABC等拼音输入法时不触发此事件，代码已调整到onKeydown函数中。
};
InputSpeed.prototype.onKeyup = function(){
	//if (this._element.oninput instanceof Function) this._element.oninput();
};
InputSpeed.prototype.onTimeout = function(){
	this.__t = null;
	// 普通超时后，有两次以上的按键则视为一次连续输入过程结束，并初始化输入状态标识。see:onKeydown的严重超时部分。
	// 这是为了在输入速度慢于之前状态时，将延时时间增加。
	if (!!this.__endAt){
		this.__initInputProcess();
	}
};
/**
 * 计算平均一次按键所需的时间（单位：毫秒）
 * @return {Number} 平均一次按键时间，并直接改变this.time的值。
 * @ignore
 */
InputSpeed.prototype._doTime = function(){
	if (!!this.__startAt && !!this.__endAt){ // this.__inRunning
		var t = (this.__endAt-this.__startAt)/(this.__counter-1);
		t = this.time===0?t:(this.time*(1-this.__scale)+t*this.__scale); // 毫秒每次击键(ms/pre)
		if (t<this.maxTime) this.time = t; // 大于最大超时时间则忽略计算结果。
	}
	return this.time;
};
/*]]>*/