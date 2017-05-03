const DURATION = 200
const SWIPEVALUE = 2
/**
 * @param imgs {Object} 图片的地址数组
 * @param id {String} 最外层元素id, 如 "#app"
 * @param ret
 */
class Slide {
	constructor (imgs, id) {
		this.wrapper = document.querySelector(id)
		this.list = this.wrapper.firstElementChild
		
		this.offsetX = 0
		this.offsetY = 0
		this.stayX = 0 //每次touchend总偏移量
		this.currentSlide = 0
		this.cursor = {
			x: 0,
			y: 0,
			oriX: 0,
			oriY: 0
		}
		this.slideWidth = 0
		this.itemWidth = 0
		this.count = 0
		
		//计算运动瞬时时间戳 和 位移 用来计算速度
		this.lastDis = 0
		this.lastTime = 0
		this.speed = 0
		
		//初始化
		this._init()
	}
	_init () {
		this._initPaddingImgs()
		this._initListWidth()
		this._initEvent()
	}
	_initListWidth () {
		this.list.style.width = imgs.length + '00%'
		this.slideWidth = this.list.offsetWidth
		this.itemWidth = this.list.firstElementChild.offsetWidth
	}
	_initPaddingImgs () {
		let html = imgs.map( (item) => `<li class="slideItem"><img src="${item}"/></li>`).join('')
		this.list.innerHTML = html
	}
	_initEvent () {
		this.list.addEventListener('touchstart', this._touchstartFn.bind(this))
		this.list.addEventListener('touchmove', this._touchmoveFn.bind(this))
		this.list.addEventListener('touchend', this._touchendFn.bind(this))
	}
	_touchstartFn (ev) {
		this.cursor.oriX = ev.changedTouches[0].clientX
		this.lastDis =  this.stayX
		this.lastTime = +new Date()
	}
	_touchmoveFn (ev) {
		this.cursor.x = ev.changedTouches[0].clientX
		this.offsetX = this.cursor.x - this.cursor.oriX 
		let disX = this.offsetX + this.stayX
		
		//边界情况移动无效
		if (disX < -(this.slideWidth - this.itemWidth) ) {
			disX = -(this.slideWidth - this.itemWidth)
		}else if (disX > 0) {
			disX = 0
		}
		css(this.list, 'translateX', disX)
		
		//计算每次move事件触发时的速度
		let currentTime = +new Date()
		let currentDis = disX
		let timeInterval = currentTime - this.lastTime === 0? 100:currentTime - this.lastTime
		let disInterval = currentDis - this.lastDis
		
		this.speed = disInterval/timeInterval
		
	}
	_touchendFn () {
		this.stayX = css(this.list, 'translateX')
		//根据手指移动速度判断是否要swipe
		if(this.speed > SWIPEVALUE){
			this.count --
			return this._swipe()
		}else if (this.speed < -SWIPEVALUE){
			this.count ++
			return this._swipe()
		}
		
		//是否需要惯性运动
		let remainder = Math.abs(this.stayX % this.itemWidth)
		this.count = Math.floor(-this.stayX/this.itemWidth)
		let swipeTarget = 0
		if(remainder !== 0) {
			if(remainder > this.itemWidth * 0.5){
				this.count ++
			}
			return this._swipe()
		}
		
	}
	_swipe () {
		
		//swipe 时间 与 位移 抛物线关系
		let target = -this.count * this.itemWidth
		let disX = Math.abs(target - css(this.list, 'translateX')) 
		let time = Math.sqrt(disX)*10
		MTween({
			el: this.list,
			target: {
				'translateX': target
			},
			time: DURATION,
			type: 'linear',
			callIn: () => {
				this.stayX = css(this.list, 'translateX')
			},
			callBack: () => {
				this.stayX = css(this.list, 'translateX')
				
				//位移纠错
				if(this.stayX !== target){
					stayX = target
				}
			}
		})
	}
}