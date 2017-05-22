//运动公式
let Tween = {
	linear: function (t, b, c, d){
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 2.70158;  //回缩的距离
			
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
};
/**
 * 设置（三个参数）或者(读取)元素的css样式值 可以设置元素的transform
 * @param {Object} element 要修改样式的元素
 * @param {Object} attr	修改元素的那个样式
 * @param {Object} val 修改样式的目标值
 */

export function css(element, attr , val){
	
	//如果传入的是transform 的属性名 调用cssTransform函数
	if(css.attr.indexOf(attr)>=0) {
		return cssTransform(element, attr, val);
	}
	
	//读取值
	if(arguments.length == 2){
		var val = getComputedStyle(element)[attr];
		
		if(attr=='opacity'){
			val = Math.round(val*100);
		}
		return parseFloat(val);
	} 
	
	//设置值
	if(attr == "opacity") {
		element.style.opacity= val/100;
	} else {
		element.style[attr]= val + "px";	
	}
}

//transform的样式名
css.attr = ["scale", "scaleX","scaleY", "scaleZ",  "rotateX", "rotateY", "rotateZ", "rotate", "skewX", "skewY", "translateX", "translateY", "translateZ" ]

/**
 * 设置元素的transform样式
 * @param {Object} element 对哪个元素进行设置
 * @param {Object} attr	需要设置那个transform值
 * @param {Object} val	目标值 不带单位
 */
export function cssTransform(element, attr, val){
	if(!element.transform){
		element.transform = {};
	}
	
	//没有传入第三个参数，读取值
	if(typeof val === "undefined"){ 
		if(typeof element.transform[attr] === "undefined"){
			switch(attr){
				case "scale":
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					element.transform[attr] = 100;
					break;
				default:
					element.transform[attr] = 0;	
			}
		} 
		
		//返回属性名对应的值
		return element.transform[attr]; 
	} else {
		
	//传入第三个参数，设置值
		element.transform[attr] = val;
		var transformVal  = "";
		
		for(var s in element.transform){
			switch(s){
				case "scale":
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					transformVal += " " + s + "("+(element.transform[s]/100)+")";
					break;
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					transformVal += " " + s + "("+element.transform[s]+"deg)";
					break;
				default:
					transformVal += " " + s + "("+element.transform[s]+"px)";				
			}
		}
		
		//设置
		element.style.WebkitTransform = element.style.transform = transformVal;
	}
}
/**
 * 运动函数
 * @param {Object} init
 * 		init:
 * 		init.el {Object} 运动的DOM元素
 * 		init.target {Object} 运动的目标点如 'left': 100  不加单位
 * 		init.time {Number} 运动事件 单位ms
 * 		init.callBack {Function} 回调函数
 * 		init.callIN {Function} step函数
 * 		init.type {String} 运动形式 为Tween函数的任何一个属性名
 * 
 */
export function ZTween(init){
	var t = 0,
		b = {}, //运动起点
		c = {},	//运动区间
		d = init.time / 20;
		
	for(var s in init.target){ 
		b[s] = css(init.el, s); 
		c[s] = init.target[s] - b[s];
	}
	
	clearInterval(init.el.timer); 
	
	init.el.timer = setInterval(
		
		function(){
			t++;
			if(t>d){
				clearInterval(init.el.timer);
				init.callBack&&init.callBack.call(init.el);
			} else {
				init.callIn&&init.callIn.call(init.el);
				for(var s in b){ 
					var val = Number((Tween[init.type](t,b[s],c[s],d)).toFixed(2));
					css(init.el, s, val);
				}
			}
		},
		20
	);
}
