/*<![CDATA[*/
/**
 * @overview 比较两个对象是否相等时, 需要穿插使用其他对象的equals方法,
 * 这里将Javascript核心对象的equals方法扩展集合于此, 用于方便实现其他对象的equals方法,
 * 建议所有用户创建类中都实现equals方法. 该方法在比较数组等对象时尤为有用.
 * @version 2007/8/3, 2007/10/2, 2008/4/14
 * @author 闲耘 (mail@xianyun.org)
 */


/**
 * 比较当前对象与指定对象是否相等。
 * 覆写并扩展基类(Object)，方便子类(如：Array)扩展此方法。
 * 这个方法可能用到string, number, function等基本数据类型的wapper类(String, Number, Function)的equals方法。
 * @param {Object} o 被比较对象。
 * @return {Boolean} 仅参数obj类型为Object且各成员属性/方法相等时返回true。
 */
Object.prototype.equals = function(o){
	if (this===o){return true;}
//	null is typeof object, but not instanceof Object.
	if (!(o instanceof Object)||o===undefined||o===null){return false;}
	var i = 0; // object property counter.
	for (var k in this){
		i++; var o1=this[k], o2=o[k];
		if((o2===undefined||o2===null)){if(o1!==o2){return false;}}
		else if(!o2.equals(o1)){return false;}// inner object.
	}
	for (var k in o){i--;} // compare object property counter.
	return i===0;
};


/**
 * 比较当前函数对象与指定对象的<b>值</b>是否完全相等（包括数据类型）。
 * 函数的比较比较复杂和怪异，两个构造完全一致的函数的valueOf()值并不相同，这个可以理解。
 * 而使用toString()方法，是否也应该先将他们的无效空格和换行去掉？似乎问题变得复杂了。
 * 最大的问题是，new Function()和function(){}的toString()方法在不同浏览器中表现不同，详情见附注。
 * 出于简单性，一致性和函数的特殊性考虑，函数仅且仅在和本身比较时才相等（一般不会扩展/继承Function类，但此处的实现不受此限制）。
 * @param {Object} f 被比较对象（一般为函数(Function)）。
 * @return {Boolean} 仅参数fun为函数对象时返回true。
 */
Function.prototype.equals = function(f){
    return this===f ||
		(f instanceof Function && this.valueOf()===f.valueOf());
	// new Function().valueOf() is not equals new Function().valueOf().
};
/*
附注：
=========================================
(this.toString()==fun.toString());
!important:function(){}和new Function()的toString方法在不同浏览器中具有不确定性：
=========================================
 IE6:new Function().toString():
	function anonymous() {
	
	}
- - - - - - - - - - - - - - - - - - - - -
 IE6:function(){}.toString():
	function(){}
=========================================
 FF1:new Function().toString():
	function anonynous() {
	}
- - - - - - - - - - - - - - - - - - - - -
 FF1:function(){}.toString():
	function () {
	}
=========================================
	Opera9:new Function().toString():
	function ()
	{
	  }
- - - - - - - - - - - - - - - - - - - - -
	Opera9:function(){}.toString():
	function ()
	{
	  }
==========================================
*/


/**
 * 比较当前字符串对象与指定对象的<b>值</b>是否相等。
 * @param {Object} s 被比较（一般为字符串{String}）对象。
 * @param {Boolean} i 是否忽略大小写(Ignore Case Sensitive)，为true则忽略大小写，否则对大小写敏感。
 * @return {Boolean} 仅当参数s为字符串类型对象且值相等时返回true。
 */
String.prototype.equals = function(s, i){
	return this===s ||
		((s instanceof String||typeof s==="string")&&
		(i?this.toLowerCase()===s.toLowerCase():this.valueOf()===s.valueOf()));
};


/**
 * 比较当前数字对象与指定对象是否完全相等（包括数据类型）。
 * @param {Object} n 被比较的对象（一般为数字{Number}）。
 * @return {Boolean} 仅参数number类型为数字，且值与比较源对象相等时返回true。
 */
Number.prototype.equals = function(n){
	return this===n ||
		(((n instanceof Number) || (typeof(n)==="number")) &&
		this.valueOf()===n.valueOf());
};


/**
 * 比较当前布尔对象与指定对象的值是否完全相等（包括数据类型）。
 * @param {Object} b 被比较的对象（一般为布尔{Boolean}型）。
 * @return {Boolean}
 */
Boolean.prototype.equals = function(b){
	return this===b ||
		((b instanceof Boolean||typeof b==="boolean")&&
		this.valueOf()===b.valueOf());
};


/**
 * 当前日期对象与另一日期对象的值相比较。
 * @param {Object} d 相比较的对象（一般为日期{Date}型）。
 * @return {Boolean} 被比较对象的类型是日期型，且是否与比较源对象的值相等时返回true，否则返回false。
 */
Date.prototype.equals = function(d){
	return this===d || (d instanceof Date&&this.valueOf()===d.valueOf());
};


/**
 * 当前正则表达式与指定对象比较是否相等。
 * @param {RegExp} r 被比较的正则表达式对象。
 * @return {Boolean}
 * @version 2007-10-2
 */
RegExp.prototype.equals = function(r){
	return this===r ||
		((r instanceof RegExp)&&
		(this.source===r.source)&&
		(this.global===r.global)&&
		(this.ignoreCase===r.ignoreCase)&&
		(this.multiline===r.multiline));
};


/**
 * 判断当前数组对象的值是否与指定对象的值相等。
 * 数组的值可以是任意对象（字符/串，数值，日期，数值[即支持多维数组]）。
 * @using org.xianyun.system.Object.prototype.equals(obj);
 * @param {Object} a 目标比较对象。
 * @return {Boolean} 相比较对象的<b>值</b>相等时返回true，否则返回false。
 * @version 2007/07/03, 2008/3/18
 */
Array.prototype.equals = function(a){
	if (this===a){return true;}
	if (!(a instanceof Array)){return false;}
	var l = this.length;
	if (l!==a.length){return false;}
	if (l===0) return true;
	for (var i=0,o1,o2; i<l; i++){
		o1=this[i]; o2=a[i];
		if (o1===undefined||o1===null){if(o1!==o2){return false;}}
		else if(!o1.equals(o2)){return false;} // inner array.
	}
	return true;
};

/*]]>*/