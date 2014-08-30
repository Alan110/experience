
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

			return obj.currentStyle[attr];
		};

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
};

var toArray = function(obj) {
		return Array.prototype.slice.call(obj);
	};
/*-------------------------------------------------------------------*/




var editor = document.getElementById('editor'),
	buttons = editor.getElementsByTagName('span'),
	selects = editor.getElementsByTagName('select'),
	textarea = document.getElementById('textarea'),
	richEdittor = document.getElementById('rich-edittor');


var iframe = document.createElement('iframe');
	iframe.width = '100%';
	iframe.height = '100px';
	richEdittor.appendChild(iframe);

var	if_win = iframe.contentWindow;
	if_doc = if_win.document || iframe.contentDocument; 

	if_doc.designMode = 'on';
	if_doc.open();
	if_doc.writeln('<html><head></head><body></body></html>')
	if_doc.close();

css(textarea,{
	'display':'none'
})


/*-------------------------------------------------------*/

each(buttons,function(el,index){
	el.onclick = function(){
		var command = el.getAttribute("title");
		if (command == 'createlink' || command == 'insertimage') {
			var value = prompt('请输入超链接:', 'http://');
			if_doc.execCommand(command, false, value);
		}
		if_doc.execCommand(command,'false','');
	}
})

each(selects,function(el,index){
	el.onchange = function(){
		var command = el.getAttribute("title"),
			value = el.options[el.selectedIndex].value;
		if_doc.execCommand(command, false, value);
	}
})