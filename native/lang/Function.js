/*<![CDATA[*/
/** 
 * @overview Javascript 核心类Function的扩展。
 * @version 2007/08/22
 * @author 闲耘 (hotoo.cn[AT]gmail.com)
 */

/**
 * 为指定对象创建代理方法。即将method方法代理为instance对象的方法，此时method方法中的this指向instance对象。
 * @param {Object} instance 指定对象。
 * @param {Object} method 指定方法。
 * @return {Function} 返回代理方法。
 */
Function.createDelegate = function(instance, method) {
	//var args = Array.from(arguments).splice(2,arguments.length - 2);
    return function() {
        return method.apply(instance, arguments);
    }
};

/**
 * 取得函数的名称。
 * 只能取得function f(){}这样定义的函数。var f=function(){};这样定义的方式属于匿名函数。
 * @return {String}
 */
Function.prototype.name = function(){
	var s = this.toString().match(/function(?:\s+(\w+))\s*\(/);
	return s?s[1]:"anonymous";
};

/**
 * 
 * @param {Boolean} b 为true则以数组形式返回；否则返回字符串。
 * @return {Array, String}
 */
Function.prototype.stack = 
Function.prototype.stacktrace = function(b){
	var s = [],t="",e="",i=0;
	for(var a = arguments.callee.caller,n; a!=null; a=a.arguments.callee.caller,i++){
		s.splice(0,0,a.name());
		// Because of a bug in Navigator 4.0, we need this line to break.
		// a.caller will equal a rather than null when we reach the end
		// of the stack. The following line works around this.
		if (a.caller == a) break;
	}
	for (i=0,l=s.length,p=""; i<l; i++){
		p="  ".repeat(i);
		t = t+p+"function "+s[i]+"(){"+(i==l-1?"":"\n");
		e = (i==l-1?"":"\n"+p)+"}"+e;
	}
	return b?s:t+e;
};

Function.prototype.curry=function()	{
	if (!arguments.length) return this;
	var	__method = this, args =	$A(arguments);
	return function() {
		return __method.apply(this, args.concat($A(arguments)));
	}
};

// from meizz.
Function.prototype.Extends=function(SuperClass,ClassName){
  var op=this.prototype, i, p=this.prototype=new SuperClass();
  if(ClassName)p._className=ClassName; for(i in op)p[i]=op[i];
  return p;
};

/**
 *  Function.call & applay 兼容ie5  参考prototype.js
 */
if (!Function.prototype.apply) {
Function.prototype.apply = function(object, argu){
    if (!object) {
        object = window;
    }
    
    if (!argu) {
        argu = new Array();
    }
    
    object.__apply__ = this;
    
    var result = eval("object.__apply__(" + argu.join(", ") + ")");
    object.__apply__ = null;
    
    return result;
};

Function.prototype.call = function(object){
    var argu = new Array();
    
    for (var i = 1; i < arguments.length; i++) {
        argu[i - 1] = arguments[i];
    }
    
    return this.apply(object, argu)
};
}

/*]]>*/