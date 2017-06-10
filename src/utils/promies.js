(function(window,undefined){

// resolve 和 reject 最终都会调用该函数
var final = function(status,value){
    var promise = this, fn, st;
        
    if(promise._status !== 'PENDING') return;
    
    // 所以的执行都是异步调用，保证then是先执行的
    setTimeout(function(){
        promise._status = status;
        st = promise._status === 'FULFILLED'
        queue = promise[st ? '_resolves' : '_rejects'];

        while(fn = queue.shift()) {
            value = fn.call(promise, value) || value;
        }

        promise[st ? '_value' : '_reason'] = value;
        promise['_resolves'] = promise['_rejects'] = undefined;
    });
}


//参数是一个函数，内部提供两个函数作为该函数的参数,分别是resolve 和 reject
var Promise = function(resolver){
    if (!(typeof resolver === 'function' ))
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    //如果不是promise实例，就new一个
    if(!(this instanceof Promise)) return new Promise(resolver);

    var promise = this;
    promise._value;
    promise._reason;
    promise._status = 'PENDING';
    //存储状态
    promise._resolves = [];
    promise._rejects = [];
    
    //
    var resolve = function(value) {
        //由於apply參數是數組
        final.apply(promise,['FULFILLED'].concat([value]));
    }

    var reject = function(reason){
        final.apply(promise,['REJECTED'].concat([reason]));
    }
    
    resolver(resolve,reject);
}

Promise.prototype.then = function(onFulfilled,onRejected){
    var promise = this;
    // 每次返回一个promise，保证是可thenable的
    return new Promise(function(resolve,reject){
        
        function handle(value) {
            // 這一步很關鍵，只有這樣才可以將值傳遞給下一個resolve
            var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;

            //判断是不是promise 对象
            if (ret && typeof ret ['then'] == 'function') {
                ret.then(function(value) {
                    resolve(value);
                }, function(reason) {
                    reject(reason);
                });
            } else {
                resolve(ret);
            }
        }

        function errback(reason){
            reason = typeof onRejected === 'function' && onRejected(reason) || reason;
            reject(reason);
        }

        if(promise._status === 'PENDING'){
            promise._resolves.push(handle);
            promise._rejects.push(errback);
        }else if(promise._status === FULFILLED){ // 状态改变后的then操作，立刻执行
            callback(promise._value);
        }else if(promise._status === REJECTED){
            errback(promise._reason);
        }
    });
}

Promise.prototype.catch = function(onRejected){
    return this.then(undefined, onRejected)
}

Promise.prototype.delay = function(ms,value){
    return this.then(function(ori){
        return Promise.delay(ms,value || ori);
    })
}

Promise.delay = function(ms,value){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve(value);
            console.log('1');
        },ms);
    })
}

Promise.resolve = function(arg){
    return new Promise(function(resolve,reject){
        resolve(arg)
    })
}

Promise.reject = function(arg){
    return Promise(function(resolve,reject){
        reject(arg)
    })
}

Promise.all = function(promises){
    if (!Array.isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
    }
    return Promise(function(resolve,reject){
        var i = 0,
            result = [],
            len = promises.length,
            count = len
            
        //这里与race中的函数相比，多了一层嵌套，要传入index
        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }

        function rejecter(reason){
            reject(reason);
        }

        function resolveAll(index,value){
            result[index] = value;
            if( --count == 0){
                resolve(result)
            }
        }

        for (; i < len; i++) {
            promises[i].then(resolver(i),rejecter);
        }
    });
}

Promise.race = function(promises){
    if (!Array.isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
    }
    return Promise(function(resolve,reject){
        var i = 0,
            len = promises.length;

        function resolver(value) {
            resolve(value);
        }

        function rejecter(reason){
            reject(reason);
        }

        for (; i < len; i++) {
            promises[i].then(resolver,rejecter);
        }
    });
}

window.Promise = Promise;

})(window);

//new promise
function Promise (fn){
var ctx = this
var status = 'pending'
var fulfills = []
var rejects = []
var thens = []
this.then = function (onFulfilled, onRejected) {
	return new Promise(function (resolve, reject) {
		tempFn = this
		console.log(this)
		fulfills.push([onFulfilled, resolve, reject, this]) //将then本身返回的promise的resolve存起来
		rejects.push([onRejected, resolve, reject, this])
	})
}
function resolve (value1) {
	if(status !== 'pending'){return} //一旦状态变更， 不能在去执行
	setTimeout(() => {
		status = 'fulfilled'
		fulfills.forEach( (fulfill, index) => {
			try {
				var rs = fulfill[0](value1)
				if(rs === fulfill[3]){ //如果then函数的callback返回的promise等于then返回的promise, 抛出错误
					throw new TypeError('you can\'t return the same promise with the promise which then Function returns in then callback-functions')
				}
			}catch(err){
				console.log(err)
				fulfill[2](err)
				return 
			}
			
			if(rs instanceof Promise) {
				rs.then(function (value2) { //promise2的value
					fulfill[1](value2) //promise2跟随改变状态
				})
			}else {
				fulfill[1](rs)
			}
		})
	}, 0)
}
function reject (reason1) {
	if(status !== 'pending'){return} //一旦状态变更， 不能在去执行
	setTimeout(() => {
		status = 'rejected'
		rejects.forEach( (reject) => {
			try { //如果promise失败， 那么传递据因
				var rs = reject[0](reason1)
			}catch(err){
				reject[2](err)
				return 
			}
			if(rs instanceof Promise) { //如果then回调返回promise
				rs.then(function (value) { //promise2根据then回调函数的返回promise状态决定自己状态
					reject[1](value)
				}, function (reason) {
					reject[2](reason) 
				})
			}
		})
	}, 0)
}
fn.call(ctx, resolve, reject) //改变fn的this指针， 保存promise实例
}