//cookie可以换成其他
var cookie = (function () {
	var cookie;
	return cookie = {
		setItem: function (key, value, delay) {
			var d = new Date();
			d.setDate(d.getDate() + delay);
			document.cookie = key + "=" + value + "; expires="+d;
		},
		getItem: function (key) {
			var cookies = document.cookie.split('; ');
			for(var i=0,l=cookies.length;i<l;i++){
				var data = cookies[i].split('=')
				if(key === data[0]){
					return data[1]
				}
			}
		},
		clearItem: function (key) {
			cookie.setItem(key, '', -1)
		},
		clear: function () {
			var cookies = document.cookie.split('; ');
			for(var i=0,l=cookies.length;i<l;i++){
				var data = cookies[i].split('=')
				cookie.setItem(data[0], '', -1)
			}
		}
	}
})()