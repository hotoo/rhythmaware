/*<![CDATA[*/
/**
 * @overview 扩展系统数组方法
 * @namespace org.xianyun.lang;
 * @author 闲耘 (mail[AT]xianyun.org)
 * @version 2006/06/15
 */

/**
 * 将参数（如：函数中的arguments）转为数组。
 * @param {arguments} 参数使用方式同Array。
 * @return {Array}
 * @exception {Error} 不能对例如getElementsByTagName方法获得的对象（具有length属性）操作。
 * @example <code>$A(arguments)</code>
 */
var $A=function(){
	return Array.apply(this,arguments[0]);
//!	return Array.apply(this,arguments); // @example $A.apply(this,arguments)
};
/**
 * 将指定对象以数组形式返回。
 * @param {Object} iterable 指定的源对象。
 * @return {Array} 返回的数组对象。
 */
Array.from = function(iterable) {
	if (!iterable) return [];
	if (iterable.toArray) {
		return iterable.toArray();
	} else { // 例如argumengs可以用索引操作，但它不是数组对象。
		var results = [];
		for (var i = 0; i < iterable.length; i++)
		  	results.push(iterable[i]);
		return results;
	}
};

/**
 * 将数组字符串解析为数组对象。
 * @param {String} 指定的字符串
 * @return {Array} 返回解析得到的数组对象，不成功则返回null。
 */
Array.parse = function(string){
	try {
		var a=eval(string);
		return (a instanceof Array?a:null)
	} catch (e){
		return null;
	}
};

/**
 * 向数组末尾添加一个元素e。基于向数组末尾添加<strong>一个</strong>元素的情况比较多，且使用
 * append方法比push方法较快的缘故，特定义此方法。
 * 如果需要向数组末尾添加多个元素，请使用push方法（该方法支持动态参数）。
 * @param {Object} e 被添加的元素。
 * @return {Number} 返回添加元素后数组的长度。
 * @deprecated 建议直接写a[a.length]=e;，封装在函数中已经失去了高效的能力。
 */
Array.prototype.append = function(e){
	//var i = this.length;
	this[this.length] = e;
	//return i+1;
};

/**
 * Javascript数组有一个concat方法将两个数组拼接起来，如[0,1,2].concat([3,4]) 结果为[0,1,2,3,4]。
 * 现在需要向一个数组中指定位置(插入式)拼接一个数组，例如[0,1,2,3].concatAt(1,[4,5,6])，结果是[0,4,5,6,1,2,3]。
 * @param {Number} i 插入的位置。为负数时则是从数组尾部往前的索引位置。
 * @param {Array} a 被插入的数组。
 * @return {Array} 返回插入后的新数组对象，该方法不改变数组本身。
 */
Array.prototype.concatAt = function(i,a){
	return this.slice(0,i).concat(a, this.slice(i));
//	for (var k=a.length-1; k>=0; k--){
//		this.splice(i,0,a[k]); // 
//	}
//	return this;
};

/**
 * 将数组值为未定义(undefined)的项填充为指定值。
 * @param {Object} p
 * @param {Boolean} t
 * @example <code>[,,].fill(1);</code>
 * <code>[,,].fill(function(){});</code>
 * <code>[,,].fill(function(){},true, arg1,arg2);</code>
 */
Array.prototype.fill = function(p,t){
	var a=$A(arguments);a.shift();a.shift();
	for (var i=0, l=this.length; i<l; i++){
		if(this[i]===undefined){
			this[i] = t&&p instanceof Function?p.apply(this, a):p;
		}
	}
};

if (![].filter){
/**
 * 过滤数组中匹配指定规则的项。
 * @param {Object} p 指定规则
 * @return {Array}
 */
Array.prototype.filter = function(p){
	var r=[];
	if(p instanceof RegExp){
		for (var i=0,l=this.length; i<l; i++){
			if(p.test(this[i])){r[r.length]=this[i];}
		}
	}else if(p instanceof Function){
		for (var i=0,l=this.length; i<l; i++){
			if(p(this[i], i, this)){r[r.length]=this[i];}
		}
	}else {
		for (var i=0,l=this.length; i<l; i++){
			if(p==this[i]){r[r.length]=this[i]}
		}
	}
	return r;
};
}

/**
 * 兼容ie5.0
 */
if (!Array.prototype.push) {
Array.prototype.push = function(){
	var l = this.length, L=arguments.length;
	for (var i=0; i<L; i++) {
		this[l+i] = arguments[i];
	}
	return l+L;
};
}

/**
 * 遍历数组第一维的元素。
 * @param {Function} iterator
 */
Array.prototype.each = function(iterator){
	var r=[];
	for (var i=0; i<this.length; i++)
		r[i]=iterator.call(iterator,this[i], i, this);
	return r;
//	for (var i=0,l=this.length; i<l; i++)
//		iterator(this[i], i, this);
};

/**
 * 深度遍历数组。
 * @param {Function} iterator 遍历过程中使用iterator函数处理每个非数组对象。
 */
Array.prototype.deepEach = function(iterator){
	for (var i=0, l=this.length; i<l; i++){
		if (this[i] instanceof Array){
			this[i].deepEach();
		} else {
			iterator(this[i], i, this);
		}
	}
};

/**
 * 将数组索引为from的元素移动到索引to处（内部移动）。
 * @exception {ReferenceError} 当被移动索引值和目标索引值不为数值型或者超出数组范围时抛出此异常。
 * @param {Number} from 起始移动元素索引。
 * @param {Number} to 目标索引。
 * @return {Object} 返回被移动的对象。
 * @example <code>[0,1,2,3].move(0,1);</code>
 */
Array.prototype.move = function(from, to){
	var l = this.length;
	if ((from instanceof Number||typeof from==="number") && from>=0&&from<l &&
	  (to instanceof Number||typeof to==="number")&&to>=0&&to<l){
		if (from===to) return this[from];
		return this.insert(this.removeAt(from), to);
	} else {
		throw new ReferenceError("期望两个零到数组长度间的整数。");
	}
};

/** 将数组对象的元素项清空。
 * @return {Array} 返回所有被清除出来的对象集。
 */
Array.prototype.clear = function(){
	//this.length = 0;
	return this.splice(0, this.length);
};

/** 将当前数组第一维对象的元素随机打乱。
 * 数组的元素可以是任意对象（字符/串，数值，日期，数值[即支持多维数组]）。
 * 该方法会影响数组本身。
 * @return {Array} 返回打乱后的数组对象。
 * @version 2007/07/03
 */
Array.prototype.shuffle = function(){
	return this.sort(function(){return Math.random()*new Date%3-1});
//    for (var i=0; i<this.length; i++){
//        var r = parseInt(Math.random() * i);
//        var _t = this[i];
//        this[i] = this[r];
//        this[r] = _t;
//    }
//    return this;
};

/**
 * 按照指定规则，返回从数组中匹配到的第一个元素所在的索引值。允许设置匹配的起始索引值。
 * 支持多维数组（需引用org.xianyun.utils.equals.js）。
 * @exception {TypeError, RangeError}
 * @param {Object} value 指定的匹配规则。
 * 		如果value是正则表达式，并且
 * 			数组元素是字符串，则使用正则表达式规则匹配该字符串。
 * 			数组元素也是正则表达式，比较这两个表达式是否相等。
 * 		否则，
 * 			比较value与数组元素的值是否完全相等。
 * @param {Number} start 查找起始索引（包含该索引所在元素在内），默认从索引为0的元素开始。
 * @return {Number} 如果查找到，返回第一个元素的（非负整数）索引，否则返回-1。
 * @version 2007/07/03
 */
Array.prototype.indexOf = function(v, s){
	var l = this.length;
	if (l===0) return -1;
	if (s===null || s===undefined) s = 0;
	if (!(s instanceof Number || typeof(s)==="number")){
		throw new TypeError("期望数值型起始索引值");
	}
	if (s<0 || s>=l){throw new RangeError("期望0到数组长度之间的起始索引值。");}
	
    if (v instanceof RegExp){
        for(var i=s; i<l; i++){
			var t = this[i];
            if ((t instanceof String || typeof(t)==="string") && v.test(t)){
                return i;
            } else if (t instanceof RegExp && t.equals(v)){
				return i;
			}
        }
    }else {
        for(var i=s; i<l; i++){
			var t = this[i];
            if (v===undefined){if (t===undefined){return i;}}
			else if ((v===null)){if (t===null){return i;}}
			else if(v===t || v.equals(t)){return i;}
        }
    }
	return -1;
};

/**
 * 按照指定规则，返回从数组中从后向前匹配到的第一个元素所在的索引值。允许设置匹配的起始索引值。
 * 参考Array.prototype.indexOf方法。
 * @param {Object} v 指定匹配规则。
 * @param {Number, Integer} s 指定起始匹配的索引值。
 */
Array.prototype.lastIndexOf = function(v, s){
	var i = this.reverse().indexOf(v, s);
	this.reverse();
	return i;
};

/** 
 * 判断当前数组对象是否包含与指定对象<strong>值相等<strong>的元素。
 * @exception {}
 * @param {Object} value 指定被查找的对象。
 * @param {Number, Integer} start 指定起始索引，数组将从此处开始查找。
 * @return {Boolean}
 */
Array.prototype.contains = function(v, s){
    return (this.indexOf(v, s||0)>=0);
};

/**
 * 插入指定对象item到数组的索引位置index处，该方法会影响数组本身。
 * 
 * 使用数组内置方法splice（结合）实现，该方法描述如下：
 * ---------------------------------------------------------------------------
 * splice() 方法用于插入、删除或替换数组的元素。
 * 
 * 语法：
 * arrayObject.splice(index,howmany,element1,.....,elementX)
 * 
 * 参数		描述 
 * index	必需。规定从何处添加/删除元素。
 * 			该参数是开始插入和（或）删除的数组元素的下标，必须是数字。
 * howmany	必需。规定应该删除多少元素。必须是数字，但可以是 "0"。
 * 			如果未规定此参数，则删除从 index 开始到原数组结尾的所有元素。
 * element1	可选。规定要添加到数组的新元素。从 index 所指的下标处开始插入。 
 * elementX	可选。可向数组添加若干元素。
 * 
 * 返回值：
 * 如果从 arrayObject 中删除了元素，则返回的是含有被删除的元素的数组（注：没有删除则返回空数组，in IE6）。
 * 
 * 说明：
 * splice() 方法可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素。
 * 
 * 提示和注释：
 * 请注意，splice() 方法与 slice() 方法的作用是不同的，splice() 方法会直接对数组进行修改。
 * 
 * 特殊性：
 * 如果index大于等于数组的长度，则将新元素按参数顺序拼接到数组的末尾。
 * 如果index为负数，则数组从后往前，取index绝对值的位置开始，将新元素以参数顺序插入/删除/替换，绝对值大于等于数组长度则从索引为0处开始。
 * ---------------------------------------------------------------------------
 * 
 * @exception {TypeError}
 * @param {Object} o 指定插入的目标对象，可以是任意类型对象，包括null, undefined, NaN...。
 * @param {Number} i 指定插入的目标索引位置。
 * 		如果未指定索引值，则将对象拼接到数组的末尾。
 * 		如果索引值不是数值或者是负数，则抛出异常。
 * 		如果索引值大于等于数组的长度，则将对象拼接到数组的末尾。
 * @return {Object} 返回被插入的对象o。
 * @see <a href="http://www.w3school.com.cn/js/jsref_splice.asp" target="_blank">JavaScript splice() 方法</a>
 * @example <code>[].insert({}, 0);</code>
 */
Array.prototype.insert = function(o, i){
	if (i===null || i===undefined) i = this.length;
	if (!(i instanceof Number || typeof i==="number") || i<0)
		throw new TypeError("Array.insert方法期望非负整数索引值。");
	this.splice(i, 0, o);
	return o;
};

Array.prototype.compare = function(a){
	return this.toString().match(new RegExp("("+a.join("|")+")", "g"));
};

/**
 * 对二维数组按照指定的列进行排序；
 * 如果是一维数组，且数组内是对象，可以根据对象的某一成员属性名排序。
 * @param {Number} i 可选项。数组的索引号，或对象的成员属性名。
 * @param {Boolean} t 标识为以数值/字符串进行排序，默认为自动（数值型则按数值排序，否则按字符串排序）。
 * @return {Array} 排序后的数组。
 */
Array.prototype.sortByIndex=function(i,t){
	var n=function(c){ // 判断数组元素是否是数值型对象。
		return (typeof c=="number" || c instanceof Number) && !isNaN(c);
	};
	return this.sort(function(a,b){
		var na=parseFloat(a[i]), nb=parseFloat(b[i]);
		// 指定按数字值排序（即t==true），且指定列类型转换成功时；
		// 或者不指定排序方式，且数组指定列的类型为数值型时，按数值排序。
		// 注意：对于不规则的数组，排序结果可能不正确。
		if((t && !isNaN(na) && !isNaN(nb)) || 
		  (null==t && n(na) && n(nb))){ // “==null”本应替换为“===undefined”，但是undefined本身可被赋值，不安全。
			return na-nb;
		}
		return String(a[i]).localeCompare(b[i]);
	});
};

/**
 * 按照指定规则p，将匹配的元素项替换为目标对象t。
 * @param {Object} p
 * @param {Object} t
 */
Array.prototype.replace = function(p, t){
	for (var i=0, l=this.length; i<l; i++){
		if (p instanceof Function) {
			if (arguments.length === 1) {
				p(this[i], i, this);
			}
			else {
				if (p(this[i], i, this)) {
					this[i] = t;
				}
			}
		}
		else {
			if (p instanceof RegExp && p.test(this[i])) {
				this[i] = t;
			} else {
				if (p.equals(this[i])) {
					this[i] = t;
				}
			}
		}
	}
};

/**
 * 求两个数组的交集(intersection)。
 * @param {Object} a
 * @return {Array}
 */
Array.prototype.cut = function(a){
	var r = [], l0=this.length, l1=a.length;
	if (0===l0 || 0===l1) return b;
	if (l0<l1){
		var c = this, d = a;
	} else {
		var c = a, d = this;
	}
	for (var i=0, l=c.length; i<l; i++)
		if (d.contains(c[i]))
			r[r.length] = c[i];
	return r;
};

/**
 * 求两个数组的交集。
 * @param {Object} a
 * @return {Array}
 */
Array.prototype.unite = function(a){
	var b = [];
	for (var i=0, c=this.concat(a), l=c.length; i<l; i++)
		if (!b.contains(c[i]))
			b[b.length] = c[i];
	return b;
};

/**
 * 删除数组元素项中第一个等于（equals）指定对象o的元素，这个方法可能会影响数组本身。
 * 如果数组中不存在与指定对象相等的对象，则抛出异常。
 * @exception {ReferenceError}
 * @param {Object} o 指定被删除的对象。
 * @return {Object} 返回被删除的对象。
 * @example <code>["a","b"].remove("a");</code>
 */
Array.prototype.remove = function(o){
	var i = this.indexOf(o);
	if (i===-1) throw new ReferenceError("Array.remove:o is nonexistent.");
	return this.removeAt(i);
};

/**
 * 删除数组第index项元素。
 * @param {Number} i 被删除的目标元素索引值，合法值为0到数组长度减一之间，否则抛出异常。
 * @return {Object} 被删除的元素项对象。
 * @see Array.prototype.insert
 */
Array.prototype.removeAt = function(i){
	var l = this.length;
	if (!(i instanceof Number || typeof i==="number") || l===0 || i<0 || i>=l)
		throw new TypeError("Array.removeAt:Invalid type (Number) or Out of range[0,"+l+")");
	return this.splice(i, 1)[0];
};

/**
 * 查找数组元素中是否匹配指定值。
 * @param {RegExp, String} value
 * @return {Array}
 * @ignore
 * @deprecated 已被Array.prototype.select替换。
 */
Array.prototype.search = function(value){
	var s = this.join("\n");
	if (value instanceof RegExp) {
		var r = new RegExp(
			(value.source.startWith("^")?"":"^.*")+value.source+(value.source.endWith("$")?"":".*$"), 
				"gm"+(value.ignoreCase?"i":""));
	} else if (typeof(value)==="string" || value instanceof String) {
		var r = new RegExp("^.*"+value.toString()+".*$", "gm");
	}
	return s.match(r);
};

/**
 * 以指定规则返回数组中匹配的所有项。
 * @param {Object} p 指定规则。
 * @return {Array}
 */
Array.prototype.select = function(p){
	var a = [];
	if (p instanceof Function){
		for (var i=0, l=this.length; i<l; i++)
			if (p(this[i])) a[a.length] = this[i];
	} else {
		var i = 0, l=this.length-1;
		do {
			var j = this.indexOf(p, i);
			if (j!==-1) a[a.length] = this[j];
		} while(++i < l);
	}
	return a;
};

/**
 * 判断数组是否为空。
 * @return {Boolean} 数组为空则返回true。
 */
Array.prototype.isEmpty = function(){
    return this.length===0;
};

Array.prototype.getType = function(){
    return typeof(this); // return "array";
};

Array.prototype.typeOf = function(type){
    return type == 'array';
};

/**
 * 去除数组中无效的元素项(undefined)。
 * var a=[]; a[10]=1; document.write(a.length+" : "+a.trim().length); -> 11 : 1
 * @return {Array}
 */
Array.prototype.trim = function(){
	var a = [];
	for (var i=0; i<this.length; i++)
		if (typeof(this[i])!=="undefined")
			a[a.length] = this[i];
	return a;
};

/**
 * 排除数组重复项
 * @return {Array} 返回不
 */
Array.prototype.unique = function(){
  var a = [];
  for(var i=0, l=this.length; i<l; i++){
    if(a.contains(this[i]))
      a[a.length] = this[i];
  }
  return a;
};


/**
 * 遍历所有元素，返回数组的最大深度。适应任意形状的数组。
 * @return {Number} 数组的最大深度，正整型，最浅为1层深度。
 */
Array.prototype.depth = function(){
	//return (this.length!==0)&&(this[0] instanceof Array)?this[0].depth()+1:1; // 适合整齐的数组。
	var d=1;
	for (var i=0, l=this.length; i<l; i++){
		var c = (this[i] instanceof Array)?this[i].depth()+1:1;
		if (d<=c){d=c;}
	}
	return d;
};
/*]]>*/