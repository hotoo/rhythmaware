/*<![CDATA[*/

/**
 * 高级输入节奏感知器，能够根据用户的平均输入速率自动调整合理的停顿时间。
 * @namespace org.xianyun.elements.utils;
 * @extends org.xianyun.elements.utils.InputtingRhythmAware;
 * @constructor new AdvancedInputRhythmAware(HTMLElement);
 * @param {HTMLElement} inputElement 支持高级节奏感知的目标元素对象。
 * @since IE6.0, Firefox1.0, Opera8.0, Netscape8.0
 * @author 闲耘 (xianyun.org, mail[AT]xianyun.org)
 * @version 0.8, 2007/11/24
 */
var AdvancedInputRhythmAware = function(inputElement){
	InputtingRhythmAware.call(this, inputElement);
	this.inputer = new InputSpeed(inputElement); // 用户平均输入频率：每次输入间隔时间(单位：毫秒ms)。
};
AdvancedInputRhythmAware.prototype = new InputtingRhythmAware({});

AdvancedInputRhythmAware.prototype.onKeydown = function(evt){
	//if (this.delay<this.inputer.timeout)
		this.delay = this.inputer.getDelay();
	InputtingRhythmAware.prototype.onKeydown.call(this, evt);
};
/*AdvancedInputRhythmAware.prototype.onKeyup = function(evt){
	InputtingRhythmAware.prototype.onKeyup.call(this, evt);
	if (this.delay<this.inputer.timeout)
		this.delay = this.inputer.timeout;
};*/

/*]]>*/