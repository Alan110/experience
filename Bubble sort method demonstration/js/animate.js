
/**
 * 运动对象父类
 * @param {[type]} cfg [description]
 */
var MoveObj = function(cfg){
	this.x = cfg.x || 0;
	this.y = cfg.y || 0;
	this.draw = cfg.draw;
};

MoveObj.prototype = {
	constructor:MoveObj,
	move : function(x,y){
		this.x = x;
		this.y = y;
	},
	getInfo:function(){
		return {
			x:this.x,
			y:this.y
		}
	}
};

/**
 * 重绘渲染引擎
 * @return {[type]} [description]
 */
var Render = (function(window,undefined){
	var moveObjs = {};
	var moveQueue = [];  //动画队列
	var SECOND = 30;
	var step = 0;
	var timer ;

	var _execMoveRule = function(canvas,cxt){
		var fn = moveQueue[step];
		if(!fn) return;
		fn.apply(this,arguments);		
	}

	return {
		addMoveObj:function(name,obj){
			moveObjs[name] = obj;
			return this;
		},
		removeMoveObj:function(name){
			delete moveObjs[name];
		},
		addMoveRule:function(fn){
			moveQueue.push(fn);
			return this;
		},
		init:function(x,y,canvas,cxt){
			cxt.moveTo(x,y);
			this.canvas = canvas;
			this.cxt = cxt;
			return this;
		},
		render:function(){
			var self = this;
			timer = setInterval(function(){
				for(var i in moveObjs){
					_execMoveRule.call(self,self.canvas,self.cxt);
					moveObjs[i].draw(self.canvas,self.cxt);
				}
			},SECOND)

		},
		next : function(){
			step ++;
		},
		getMoveObj:function(name){
			return moveObjs[name];
		},
		stop:function(){
			clearInterval(this.timer);
		}
	}
})(window,undefined);