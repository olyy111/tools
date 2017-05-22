export class EventEmitter {
    constructor(){
        this._events = {}
    }
    on(type, fn, context=this){
        
        if(!this._events[type]){
            this._events[type] = []
        }
        this._events[type].push([fn, context])
    }
    off(type, fn){
        let ev = this._events[type]
        if(!ev){
            return
        }
        for(let i=0; i<ev.length;i++){
            if(ev[i][0] === fn){
                ev.splice(i, 1)
                i --
            }
        }
    }
    once(type, fn, context=this){
        let ev = this._events[type]

        //调用结束后就销毁了，所以这里的局部变量不会共享
        let fired = false

        //这里不能用箭头函数
        let onceFn = function () {
            this.off(type, onceFn)
            if(!fired){
                
                //兼容ie>8 [].slice.call(arguments)
                fn.apply(context, [].slice.call(arguments))
                fired = true
            }
        }
        this.on(type, onceFn, context)
    }
    trigger(type){
        
        let event = this._events[type]
        if(!event){
            return
        }
        
        for(let i=0; i<event.length;i++){
            let fn = event[i][0]
            fn.apply(this, [].slice.call(arguments, 1))
        }
    }
}