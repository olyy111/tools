function thunkify (fn) {
	return function () {
		var args = []
		var ctx = this
		for(var i=0;i<arguments.length;i++){
			args[i] = arguments[i]
		}
		return function (done) {
			var called, doneArgs = [];
			args.push(function () {
				for(var i=0;i<arguments.length;i++){
					doneArgs[i] = arguments[i]
				}
				if(called){
					return
				}
				called = true
				done.apply(null, doneArgs)
			})
			try {
				fn.apply(ctx, args)
			}catch (err) {
				console.log(err)
			}
		}
	}
}
module.exports = thunkify