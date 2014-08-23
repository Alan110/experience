
var bubble = (function(){

var css = function(el,style){
	for(var i in style){
		el.style[i] = style[i];
	}
}

var getStyle = function(obj,name){
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}else{
		return window.getComputedStyle(obj,false)[name];
	}
}

var each = function(arr,revers,func){
	if(arguments.length === 3){
		for(var i=arr.length-1;i>=0;i--){
			func.call(arr[i],arr[i],i);
		}
	}else{
		for(var i=0,len=arr.length;i<len;i++){
			arguments[1].call(arr[i],arr[i],i);
		}
	}
}

var toArray = function(obj){
	return Array.prototype.slice.call(obj);
}
/*------------------------------------------------*/

/*数据初始化*/
var data = [],
	len = 20,
	max = 100;

for(var i=0;i<len;i++){
	data.push(Math.ceil(Math.random()*max));
}

/*动态插入显示条*/
var nbar = document.querySelector('.nbar'),
	fragment = document.createDocumentFragment();
each(data,function(el,index){
	var li = document.createElement('li');
	li.innerHTML =  '<span>'+ (el||0) +'</span>';
	css(li,{width:el+'%'});
	fragment.appendChild(li);
})
nbar.appendChild(fragment);
fragment = null;


/*初始化动画*/
var lis = document.querySelectorAll('.nbar li');
each(lis,true,function(el,index){
	setTimeout(function(){
		css(el,{
			opacity:1,
			transform:'scale(1,1) translate(0,0)',
		})
	},100*(lis.length-index));

})


return {
	start:function(){
		/*开始冒泡排序*/
		var index = 0,
			domLis = toArray(lis);//这个地方必须将nodeList转换成数组，否则不能交换元素,nodeList具有时效性

		for(var i=0,len=data.length;i<len;i++){
			for(var j=i+1;j<len;j++){
				if(data[i]>data[j]){

					/*交换数据*/
					var temp = data[i];
					data[i] = data[j];
					data[j] = temp;

					/*交换动画*/
					setTimeout((function(a,b){
						return function(){
							var distence = (a.offsetTop + (a['lastOffset']||0) ) - (b.offsetTop + (b['lastOffset']||0)  );
							a['lastOffset']  = a['lastOffset'] || 0;
							b['lastOffset']  = b['lastOffset'] || 0;

							a['lastOffset'] += (-1)*distence;
							b['lastOffset'] += distence;
							css(a,{transform:'translate(0,'+ a['lastOffset'] +'px)'})
							css(b,{transform:'translate(0,'+ b['lastOffset'] +'px)'})
						}
					})(domLis[i],domLis[j]),300*(++index) )

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