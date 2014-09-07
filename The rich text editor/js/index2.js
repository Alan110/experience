var richEdittor = (function(window,undefined){

	var css = function(el, style) {
		for (var i in style) {
			el.style[i] = style[i];
		}
	};

	var getStyle = document.defaultView ? 
			function(obj,attr){
				return document.defaultView.getComputedStyle(obj,false)[attr].replace('px','');
			}:
			function(obj,attr){
				attr = attr.replace(/\-(\w)/g,function(str,$1){
					return $1.toUpperCase();
				})

				return obj.currentStyle[attr].replace('px','');
			};

	var addEvent = function(obj,type,handle){
		if(obj.addEventListener){
			obj.addEventListener(type,handle,false);
		}else if(obj.attachEvent){
			obj.attachEvent('on'+type,handle);
		}else{
			obj['on'+type] = handle;
		}
	};

    var one = function(obj,type,handle){
        addEvent(obj,type,function(){
            handle.apply(obj,arguments);
            if(obj.removeEventListener){
                obj.removeEventListener(type,handle,false);
            }else if(obj.detachEvent){
                obj.detachEvent(type,handle);
            }else{
                obj['on'+type] = null;
            }
        });
    }


	var toggle = (function(){
		var index = 0;
		return function(){
			arguments[index%arguments.length].call(this);
			index++;
		}
	})();

	var ID = function(id){
		return document.getElementById(id);
	};

	var TG = function(name){
		return document.getElementsByTagName(name);
	};

	var CE = function(name){
		return document.createElement(name);
	};

	var addSheet = function(cssCode){
		var doc = document;
		var head = doc.getElementsByTagName('head')[0];
		var styles = head.getElementsByTagName('style');
		if(styles.length == 0){
			if(doc.createStyleSheet){	//ie
				doc.createStyleSheet();
			}else{
	            var tempstyle = doc.createElement('style');//w3c
	            tempstyle.setAttribute("type", "text/css");
	            head.appendChild(tempstyle);
       		}
		}

		if(!+"\v1"){//用户只需输入W3C的透明样式，它会自动转换成IE的透明滤镜 
			cssCode = cssCode.replace(/opacity:(\d?\.\d+);/g,function(str,$1){
				return "filter:alpha(opacity="+ parseFloat($1) * 100+");"
			}); 
		}	

		var style = styles[0];
		var media = style.getAttribute("media");
		if (media != null && !/screen/.test(media.toLowerCase())) {
		    style.setAttribute("media", "screen");
		}

		if (style.styleSheet) {    //ie
		    style.styleSheet.cssText += cssCode;
		} else if (style.innerHTML) {
		    style.innerHTML += cssCode;//火狐支持直接innerHTML添加样式表字串
		} else {
		    style.appendChild(doc.createTextNode(cssCode))
		}
	}

	/*---------------------------------------------------------*/


	/**
	 * 初始化
	 * @param  {json} cfg 配置对象
	 * @param {boolean} hasToolbar [description]
	 * @param {string} wrapObj 容器id
	 */
	var init = function(cfg){
		this.wrapObj = cfg.wrapId ? document.getElementById(cfg.wrapId) : null;
		if(!this.wrapObj) throw new Error('must has field --cfg.wrapId');

		this.hasToolbar = cfg.hasToolbar === false  ? false :true;
	}

	var createView = function() {

        /*创建 iframe*/
        var self = this,
            iframe = this.iframe = CE('iframe'),
            textarea = this.textarea = CE('textarea'),
            toolbar = this.toolbar = CE('div');

        toolbar.className = 'toolbar';
        textarea.className = 'textarea';
        css(textarea, {
            'display': 'none'
        });
        css(toolbar, {
            'display': 'none'
        });
        iframe.width = '100%';
        iframe.height = '100px';

        this.wrapObj.appendChild(toolbar);
        this.wrapObj.appendChild(textarea);
        this.wrapObj.appendChild(iframe);

        var if_win = this.if_win = iframe.contentWindow;
        var if_doc = this.if_doc = if_win.document || iframe.contentDocument;
        if_doc.designMode = "on";

        /*--------------------------------------------------------*/


        /**
         * 创建toolbar工具栏
         * @return {[type]} [description]
         */
        var createToolbar = function () {

            css(toolbar, {
                'display': 'block'
            });
            var buttons = {//工具栏的按钮数据集合
                'removeFormat': '还原',
                'bold': '加粗',
                'italic': '斜体',
                'underline': '下划线',
                'strikethrough': '删除线',
                'justifyleft': '居左',
                'justifycenter': '居中',
                'justifyright': '居右',
                'indent': '缩进',
                'outdent': '悬挂',
                'forecolor': '前景色',
                'backcolor': '背景色',
                'createlink': '超链接',
                'insertimage': '插图',
                'fontname': '字体',
                'fontsize': '字码',
                'insertorderedlist': '有序列表',
                'insertunorderedlist': '无序列表',
                'table':'插入表格',
                'html': '查看'
            };

            var fontFamilies = ['宋体', '经典中圆简', '微软雅黑', '黑体', '楷体', '隶书', '幼圆',
                'Arial', 'Arial Narrow', 'Arial Black', 'Comic Sans MS',
                'Courier New', 'Georgia', 'New Roman Times', 'Verdana'];
            var fontSizes = [
                [1, 'xx-small', '最小'],
                [2, 'x-small', '特小'],
                [3, 'small', '小'],
                [4, 'medium', '中'],
                [5, 'large', '大'],
                [6, 'x-large', '特大'],
                [7, 'xx-large', '最大']
            ];

            var span = CE('span'),
                fragment = document.createDocumentFragment();
                span.className = 'button';

            var handelFontFamilies = function (fontFamilies) {
                var fontpicker = CE('div');
                fontpicker.setAttribute('title','fontname');
                fontpicker.style.display = 'none';
                fontpicker.className = 'fontpicker';
                var buffer = [];
                for(var i in fontFamilies){
                    buffer.push('<span style="font-family:'+fontFamilies[i]+';">');
                    buffer.push(fontFamilies[i]);
                    buffer.push('</span>');
                }
                fontpicker.innerHTML = buffer.join('');

                addEvent(fontpicker,'click',function(event){
                    var event = event || window.event;
                    var target = event.target || event.srcElement;
                    var value = target.innerHTML;
                    if_doc.execCommand('fontname',false,value);
                    fontpicker.style.display = 'none';
                });
                toolbar['fontnamePicker'] = fontpicker;
                toolbar.appendChild(fontpicker);
            };

            var handelFontSize = function (fontSizes) {
                var fontpicker = CE('div');
                fontpicker.setAttribute('title','fontsize');
                fontpicker.style.display = 'none';
                fontpicker.className = 'fontpicker';
                var buffer = [];
                for(var i in fontSizes){
                    buffer.push('<span style="font-size:'+fontSizes[i][1]+';" sizevalue='+fontSizes[i][0]+'>');
                    buffer.push(fontSizes[i][2]);
                    buffer.push('</span>');
                }
                fontpicker.innerHTML = buffer.join('');

                addEvent(fontpicker,'click',function(event){
                    var event = event || window.event;
                    var target = event.target || event.srcElement;
                    var value = target.getAttribute('sizevalue');
                    if_doc.execCommand('fontsize',false,value);
                    fontpicker.style.display = 'none';
                });
                toolbar['fontsizePicker'] = fontpicker;
                toolbar.appendChild(fontpicker);
            };

            /*---------------------------------------------------*/
            /*普通按钮初始化*/
            for (var i in buttons) {
                var span = span.cloneNode('true');
                span.setAttribute('title', i);
                span.innerHTML = buttons[i];
                span.setAttribute("unselectable", "on");/*防止焦点转移到点击的元素上，从而保证文本的选中状态*/
                toolbar[i] = span;
                fragment.appendChild(span);
            }

            /*---------------------------------------------------*/
            /*按钮事件绑定*/
            addEvent(toolbar,'click',function(e) {
                var e = e || window.event;
                var target = e.target || e.srcElement;
                var command = target.getAttribute('title');
                switch (command) {
                    case 'createlink':
                    case 'insertimage':
                        var value = prompt('请输入超链接:', 'http://');
                        if_doc.execCommand(command, false, value);
                        break;
                    case "html"://查看源码
                        toggle(function () {
                            css(iframe, {display: 'none'});
                            css(textarea, {'display': 'block'});
                            textarea.value = if_doc.body.innerHTML;
                            textarea.focus();

                        }, function () {
                            css(iframe, {display: 'block'});
                            css(textarea, {'display': 'none'});
                            if_doc.body.innerHTML = textarea.value;
                            if_win.focus();

                        });
                        break;
                    case 'fontname': //显示面板
                        toolbar['fontsizePicker'].style.display = 'none';
                        var left = target.offsetLeft,
                            top = target.offsetTop + target.offsetHeight;
                        css(toolbar['fontnamePicker'],{
                            'display':'block',
                            top:top+'px',
                            left:left+'px'
                        });
                        break;
                    case 'fontsize': //显示面板
                        toolbar['fontnamePicker'].style.display = 'none';
                        var left = target.offsetLeft,
                            top = target.offsetTop + target.offsetHeight;
                        css(toolbar['fontsizePicker'],{
                            'display':'block',
                            top:top+'px',
                            left:left+'px'
                        });
                        break;
                    case 'forecolor':break;
                    case 'backcolor':break;
                    case 'html':break;
                    case 'table':break;
                    default:
                        if_doc.execCommand(command, false, '');
                }
                if_win.focus();
                e.stopPropagation();
                return false;
            });

            /*-------------------------------------------------------*/
            /*初始化字体，字号选择框*/
            handelFontFamilies(fontFamilies);
            handelFontSize(fontSizes);

            /*绑定焦点事件*/
            addEvent(if_win,'blur',function(){
                textarea.value = if_doc.body.innerHTML;
            })

            fragment.appendChild(span);
            toolbar.appendChild(fragment);
        };
		this.hasToolbar && createToolbar();
	};

	/*添加样式表*/
    addSheet('\
		.toolbar {float: left; background: #D5F3F4; width: 100%; border-left: 1px solid; border-right: 1px solid; } .toolbar span.button,#htmlCode{display: block; float: left; margin: 1px 5px 1px 0px; color: #000; background: #D0E8FC; height: 20px; text-align: center; cursor: pointer; } .toolbar select {display: block; float: left; height: 20px; width: 60px; margin: 1px 5px 1px 0px; } .textarea {width: 100%; height: 100px; }\
        .fontpicker{width:150px;height:150px;position:absolute;border:2px solid #c3c9cf;background:#F1FAFA;overflow-y:scroll;}\
        .fontpicker span{display:block;cursor:pointer;padding:2px;}\
        .fontpicker span:hover{background:#e3e6e9;color:#999;}\
    ');

    /*对外接口*/
	var editor =  function(cfg){
		init.apply(this,arguments);
		createView.call(this);
	}

	editor.prototype.getValue = function(){
		return this.if_doc.body.innerHTML;
	}

	return editor;

})(window,undefined)