var filter = (str) => { // 特殊字符转义
  str += '' // 隐式转换
  str = str.replace(/%/g, '%25')
  str = str.replace(/\+/g, '%2B')
  str = str.replace(/ /g, '%20')
  str = str.replace(/\//g, '%2F')
  str = str.replace(/\?/g, '%3F')
  str = str.replace(/&/g, '%26')
  str = str.replace(/=/g, '%3D')
  str = str.replace(/#/g, '%23')
  return str
}

//中间件函数
function resolveHooks (list, params, complete = () => {}){
	list.push(complete)
	var _list = list.map((fn, index) => {
		return () => {
			let next = _list[index+1]
			if(next){
				fn(params, next)
			}else {
				fn(params)
			}
		}
	})
	_list[0]()
}

ajax.beforeHooks = []
ajax.afterHooks = []
ajax.beforeReq = (fn) => {
	ajax.beforeHooks.push(fn)
}
ajax.afterRes = (fn) => {
	ajax.afterHooks.push(fn)
}

function ajax(options){
	let settings = {
		method: 'GET',
		url: '',
		data: {},
		dataType: 'json'
		success (){
			
		},
		error () {
			
		}
	}
	
	Object.assign(settings, options)
	
	let xhr = new XMLHttpRequest()
	
	resolveHooks(ajax.beforeHooks, settings, () => {
		if(settings.method.toUpperCase() === 'GET'){
			xhr.open('GET', settings.url, true)
			xhr.send(null)
		}else if(settings.method.toUpperCase() === 'POST'){
			let query = []
			xhr.open('GET', window.location.href.split('?')[0], true)
			for(var key in settings.data){
				query.push(`${key}=${filter(settings.data[key])}`)
			}
			
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			xhr.send(query.join('&'))
		}
		xhr.onload = () => {
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
				resolveHooks(ajax.afterHooks, xhr.responseText, settings.success)
			}else {
				resolveHooks(ajax.afterHooks, xhr.status, settings.error)
			}
			
		}
		
	})
}
export default {
  get (url, data = {}, success = () => { }, error = () => { }) {
    ajax({ url, data, success, error, type: 'GET' })
  },
  post (url, data = {}, success = () => { }, error = () => {}) {
    ajax({ url, data, success, error, type: 'POST' })
  }
}