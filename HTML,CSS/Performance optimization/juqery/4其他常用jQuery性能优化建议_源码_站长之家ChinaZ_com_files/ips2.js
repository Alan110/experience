
jq(function(){
	jq(".lisofttext img").lazyload({
    placeholder:"http://down.chinaz.com/images/grey.gif",       
     effect:"fadeIn"
});

});

(function ($) {
		// 检测是否支持css2.1 max-width属性
	var isMaxWidth = 'maxWidth' in document.documentElement.style,
		// 检测是否IE7浏览器
		isIE7 = !-[1,] && !('prototype' in Image) && isMaxWidth;
	
	$.fn.autoIMG = function () {
		var maxWidth = this.width();
		
		return this.find('img').each(function (i, img) {
			// 如果支持max-width属性则使用此，否则使用下面方式
			if (isMaxWidth) return img.style.maxWidth = maxWidth + 'px';
			var src = img.src;
			
			// 隐藏原图
			img.style.display = 'none';
			img.removeAttribute('src');
			
			// 获取图片头尺寸数据后立即调整图片
			imgReady(src, function (width, height) {
				// 等比例缩小
				if (width > maxWidth) {
					height = maxWidth / width * height,
					width = maxWidth;
					img.style.width = width + 'px';
					img.style.height = height + 'px';
				};
				// 显示原图
				img.style.display = '';
				img.setAttribute('src', src);
			});
			
		});
	};
	
	// IE7缩放图片会失真，采用私有属性通过三次插值解决
	isIE7 && (function (c,d,s) {s=d.createElement('style');d.getElementsByTagName('head')[0].appendChild(s);s.styleSheet&&(s.styleSheet.cssText+=c)||s.appendChild(d.createTextNode(c))})('img {-ms-interpolation-mode:bicubic}',document);

	// 图片头数据加载就绪事件
	// http://www.planeart.cn/?p=1121
	// @param	{String}	图片路径
	// @param	{Function}	获取尺寸的回调函数 (参数1接收width；参数2接收height)
	// @param	{Function}	加载错误的回调函数 (可选)
	(function () {
		var list = [], intervalId = null,
		
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},
		
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};
		
		this.imgReady = function (url, callback, error) {
			var check, end, width, height, offsetWidth, offsetHeight, div,
				accuracy = 1024,
				doc = document,
				container = doc.body || doc.getElementsByTagName('head')[0],
				img = new Image();
					
			img.src = url;
			if (!callback) return img;
			
			// 如果图片被缓存，则直接返回缓存数据
			if (img.complete) return callback(img.width, img.height);
			
			// 向页面插入隐秘图像，用来监听图片是否占位
			div = doc.createElement('div');
			div.style.cssText = 'visibility:hidden;position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden';
			div.appendChild(img)
			container.appendChild(div);
			width = img.offsetWidth;
			height = img.offsetHeight;
			
			// 完全加载完毕的事件
			img.onload = function () {
				end();
				callback(img.width, img.height);
			};
			
			// 加载错误后的事件
			img.onerror = function () {
				end();
				error && error();
			};
			
			// 检测图片是否已经占位
			check = function () {
				offsetWidth = img.offsetWidth;
				offsetHeight = img.offsetHeight;
				if (offsetWidth !== width || offsetHeight !== height || offsetWidth * offsetHeight > accuracy) {
					end();
					callback(offsetWidth, offsetHeight);
				};
			};
			check.url = url;
			
			// 操作结束后进行清理
			// 删除元素与事件，避免IE内存泄漏
			end = function () {
				check.end = true;
				img.onload = img.onerror = null;
				div.innerHTML = '';
				div.parentNode.removeChild(div);
			};
			
			// 将检测图片是否占位的函数加入定时器列队定期执行
			// 同一图片只加入一个检测器
			// 无论何时只允许出现一个定时器，减少浏览器性能损耗
			!check.end && check();
			for (var i = 0; i < list.length; i ++) {
				if (list[i].url === url) return;
			};
			if (!check.end) {
				list.push(check);
				if (!intervalId) intervalId = setInterval(tick, 150);
			};
		};
	})();

})(jQuery);