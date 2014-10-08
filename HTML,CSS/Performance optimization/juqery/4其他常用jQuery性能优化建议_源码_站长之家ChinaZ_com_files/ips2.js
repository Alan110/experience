
jq(function(){
	jq(".lisofttext img").lazyload({
    placeholder:"http://down.chinaz.com/images/grey.gif",       
     effect:"fadeIn"
});

});

(function ($) {
		// ����Ƿ�֧��css2.1 max-width����
	var isMaxWidth = 'maxWidth' in document.documentElement.style,
		// ����Ƿ�IE7�����
		isIE7 = !-[1,] && !('prototype' in Image) && isMaxWidth;
	
	$.fn.autoIMG = function () {
		var maxWidth = this.width();
		
		return this.find('img').each(function (i, img) {
			// ���֧��max-width������ʹ�ôˣ�����ʹ�����淽ʽ
			if (isMaxWidth) return img.style.maxWidth = maxWidth + 'px';
			var src = img.src;
			
			// ����ԭͼ
			img.style.display = 'none';
			img.removeAttribute('src');
			
			// ��ȡͼƬͷ�ߴ����ݺ���������ͼƬ
			imgReady(src, function (width, height) {
				// �ȱ�����С
				if (width > maxWidth) {
					height = maxWidth / width * height,
					width = maxWidth;
					img.style.width = width + 'px';
					img.style.height = height + 'px';
				};
				// ��ʾԭͼ
				img.style.display = '';
				img.setAttribute('src', src);
			});
			
		});
	};
	
	// IE7����ͼƬ��ʧ�棬����˽������ͨ�����β�ֵ���
	isIE7 && (function (c,d,s) {s=d.createElement('style');d.getElementsByTagName('head')[0].appendChild(s);s.styleSheet&&(s.styleSheet.cssText+=c)||s.appendChild(d.createTextNode(c))})('img {-ms-interpolation-mode:bicubic}',document);

	// ͼƬͷ���ݼ��ؾ����¼�
	// http://www.planeart.cn/?p=1121
	// @param	{String}	ͼƬ·��
	// @param	{Function}	��ȡ�ߴ�Ļص����� (����1����width������2����height)
	// @param	{Function}	���ش���Ļص����� (��ѡ)
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
			
			// ���ͼƬ�����棬��ֱ�ӷ��ػ�������
			if (img.complete) return callback(img.width, img.height);
			
			// ��ҳ���������ͼ����������ͼƬ�Ƿ�ռλ
			div = doc.createElement('div');
			div.style.cssText = 'visibility:hidden;position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden';
			div.appendChild(img)
			container.appendChild(div);
			width = img.offsetWidth;
			height = img.offsetHeight;
			
			// ��ȫ������ϵ��¼�
			img.onload = function () {
				end();
				callback(img.width, img.height);
			};
			
			// ���ش������¼�
			img.onerror = function () {
				end();
				error && error();
			};
			
			// ���ͼƬ�Ƿ��Ѿ�ռλ
			check = function () {
				offsetWidth = img.offsetWidth;
				offsetHeight = img.offsetHeight;
				if (offsetWidth !== width || offsetHeight !== height || offsetWidth * offsetHeight > accuracy) {
					end();
					callback(offsetWidth, offsetHeight);
				};
			};
			check.url = url;
			
			// �����������������
			// ɾ��Ԫ�����¼�������IE�ڴ�й©
			end = function () {
				check.end = true;
				img.onload = img.onerror = null;
				div.innerHTML = '';
				div.parentNode.removeChild(div);
			};
			
			// �����ͼƬ�Ƿ�ռλ�ĺ������붨ʱ���жӶ���ִ��
			// ͬһͼƬֻ����һ�������
			// ���ۺ�ʱֻ�������һ����ʱ��������������������
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