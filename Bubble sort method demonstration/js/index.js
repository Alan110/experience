var bubble = (function() {

	var css = function(el, style) {
		for (var i in style) {
			el.style[i] = style[i];
		}
	}

	var getStyle = function(obj, name) {
		if (obj.currentStyle) {
			return obj.currentStyle[name];
		} else {
			return window.getComputedStyle(obj, false)[name];
		}
	}

	var each = function(arr, revers, func) {
		if (arguments.length === 3) {
			for (var i = arr.length - 1; i >= 0; i--) {
				func.call(arr[i], arr[i], i);
			}
		} else {
			for (var i = 0, len = arr.length; i < len; i++) {
				arguments[1].call(arr[i], arr[i], i);
			}
		}
	}

	var toArray = function(obj) {
			return Array.prototype.slice.call(obj);
		}
		/*------------------------------------------------*/

	/*数据初始化*/
	var data = [],
		len = 20,
		max = 100;

	for (var i = 0; i < len; i++) {
		data.push(Math.ceil(Math.random() * max));
	}

	/*动态插入显示条*/
	var nbar = document.querySelector('.nbar'),
		fragment = document.createDocumentFragment();
	each(data, function(el, index) {
		var li = document.createElement('li');
		li.innerHTML = '<span>' + (el || 0) + '</span>';
		css(li, {
			width: el + '%'
		});
		fragment.appendChild(li);
	})
	nbar.appendChild(fragment);
	fragment = null;

	/*盒子初始化canvas动画*/
	var canvas = document.getElementById('myCanvas');
	var cxt = canvas.getContext('2d');

	/*创建运动对象*/
	var Obj = new MoveObj({
		x: 200,
		y: 600,
		draw:function(canvas,cxt){
			// cxt.beginPath()
			cxt.strokeStyle = '#fff';
			cxt.lineWidth = 5;
			cxt.lineTo(this.x,this.y);
			// cxt.closePath();
			cxt.stroke();
		}	

	});

	Render.addMoveObj('line', Obj);

	/*创建动画队列*/
	Render.addMoveRule(function(){/*---------------------- 1*/
		var line = this.getMoveObj('line'),
			info = line.getInfo();

		if (info.x <= 0) {
			line.move(0,info.y);
			this.next();
			return;
		}
		
		line.move(info.x -= 5,info.y);		
	})
	.addMoveRule(function(){/*---------------------- 2*/

		var line = this.getMoveObj('line'),
			info = line.getInfo();

		if (info.y <= 0) {
				line.move(info.x,0);
				this.next();
				return;
			}

			line.move(info.x,info.y -= 5);
	})
	.addMoveRule(function(canvas){/*---------------------- 3*/
		var line = this.getMoveObj('line'),
			info = line.getInfo();

		if (info.x > canvas.width) {
			line.move(canvas.width,info.y);
				this.next();
				return;
			}

		line.move(info.x += 5,info.y);
	})
	.addMoveRule(function(canvas){/*---------------------- 4*/
		var line = this.getMoveObj('line'),
			info = line.getInfo();

		if (info.y > canvas.height) {
			line.move(info.x,canvas.height);
			this.next();
			return;
		}

		line.move(info.x,info.y += 5);
	})
	.addMoveRule(function(){/*---------------------- 5*/
		var line = this.getMoveObj('line'),
			info = line.getInfo();

		if (info.x <= 200) {
			line.move(200,info.y);
			this.next();
			return;
		}
		
		line.move(info.x -= 5,info.y);		
	})
	.addMoveRule(function(){/*---------------------- 6*/
		var line = this.getMoveObj('line'),
		info = line.getInfo();

		if (info.y <= 580) {
			line.move(info.x,580);
			this.next();
			return;
		}

		line.move(info.x,info.y -= 5);
	})
	.addMoveRule(function(){/*---------------------- 7 box发光*/
		var showbox = document.getElementById('showbox');
		css(showbox,{
			'-webkit-box-shadow':'0 0 10px #0099ff',
			'-moz-box-shadow':'0 0 10px #0099ff',
			'box-shadow':'0 0 20px #0099ff'
		});

		this.next();
	})
	.addMoveRule(function(){/*---------------------- 7 box发光*/
		var myCanvas = document.getElementById('myCanvas');
		var nbar = document.getElementById('nbar');
		css(myCanvas,{
			opacity:0,
			transform:'scale(2,2);'
		});
		css(nbar,{
			opacity:1
		});

		this.next();
	})
	.addMoveRule(function(){/*----------------------8 数据初始化动画*/
		/*数据初始化动画*/
		var lis = document.querySelectorAll('.nbar li');
		each(lis, true, function(el, index) {
			setTimeout(function() {
				css(el, {
					opacity: 1,
					transform: 'scale(1,1) translate(0,0)',
				})
			}, 100 * (lis.length - index));

		})
		this.next();
	})
	.addMoveRule(function(){/*----------------------关闭渲染引擎*/
		this.stop();
	})


	Render.init(200,600,canvas,cxt).render();


	return {
		start: function() {
			/*开始冒泡排序*/
			var index = 0,
				lis = document.querySelectorAll('.nbar li'),
				domLis = toArray(lis); //这个地方必须将nodeList转换成数组，否则不能交换元素,nodeList具有时效性

			for (var i = 0, len = data.length; i < len; i++) {
				for (var j = i + 1; j < len; j++) {
					if (data[i] > data[j]) {

						/*交换数据*/
						var temp = data[i];
						data[i] = data[j];
						data[j] = temp;

						/*交换动画*/
						setTimeout((function(a, b) {
							return function() {
								var distence = (a.offsetTop + (a['lastOffset'] || 0)) - (b.offsetTop + (b['lastOffset'] || 0));
								a['lastOffset'] = a['lastOffset'] || 0;
								b['lastOffset'] = b['lastOffset'] || 0;

								a['lastOffset'] += (-1) * distence;
								b['lastOffset'] += distence;
								css(a, {
									transform: 'translate(0,' + a['lastOffset'] + 'px)'
								})
								css(b, {
									transform: 'translate(0,' + b['lastOffset'] + 'px)'
								})
							}
						})(domLis[i], domLis[j]), 300 * (++index))

						/*交换dom元素*/
						temp = domLis[i];
						domLis[i] = domLis[j];
						domLis[j] = temp;

					}
				}
			}
		}
	}


})()