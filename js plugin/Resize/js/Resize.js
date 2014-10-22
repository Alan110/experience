
/**
 * 唯一参数对象cfg，有以下属性
 * resizeId       risize对象id ,需要设置position属性
 * parentId     容器对象id 默认为整个窗口,容器对象需要设置position属性
 * xAxis        X轴移动 默认true
 * yAxis        Y轴移动 默认true
 * start        点击时执行事件  this 为fireObj
 * move         移动时执行事件  this 为resizeObj
 * stop         放开时执行事件  this 为resizeObj
 * scroll       到边界时是否滚动默认false （未实现）
 * maxWidth     最大宽度  默认参照父元素
 * maxHeight    最大高度  默认参照父元素
 * minWidth     最小宽度  10
 * minHeight    最小高度  10
 * synchronous  同步缩放，宽高缩放相等。默认false
 * resizePoint  [0,0,1,0] 上右下左 默认只有右下角,4个角拖动时，方向有问题（未实行）
 * 
 * @return {[type]} [description]
 */
//
var resizeAble = (function(){

    /**
     * 获取obj的绝对位置，
     * @param  {[type]} obj          [对象]
     * @param  {[type]} referenceObj [参照对象，递归的顶点]
     * @return {[type]}              [description]
     */
    function getAbsLeft(obj,referenceObj){
        var dis = 0;
        if(!obj.offsetParent || obj.offsetParent === referenceObj){
        }else{
            dis = arguments.callee(obj.offsetParent,referenceObj);
        }
        return obj.offsetLeft + dis;
    }

    function getAbsTop(obj,referenceObj){
        var dis = 0;
        if(!obj.offsetParent || obj.offsetParent === referenceObj){
        }else{
            dis = arguments.callee(obj.offsetParent,referenceObj);
        }
        return obj.offsetTop + dis;
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
    };
    var CE = function(name){
        return document.createElement(name);
    };

    var cssText = function(obj,css){
        obj.style.cssText += ';' + css;
    }

    function init(cfg){
        cfg.scroll = cfg.scroll || false;
        cfg.xAxis = cfg.xAxis === false ? false:true;
        cfg.yAxis = cfg.yAxis === false ? false:true;
        cfg.resizeObj = document.getElementById(cfg.resizeObjId),
        cfg.parentObj = document.getElementById(cfg.parentId) || document.documentElement;
        cfg.minWidth = cfg.minWidth || 10;
        cfg.minHeight = cfg.minHeight || 10;
        cfg.synchronous = cfg.synchronous || false;
        cfg.resizePoint = cfg.resizePoint || [0,0,1,0];

        //构建 risize 触发对象
        var frag = document.createDocumentFragment();
        for(var i=0;i<4;i++){
             var div = CE('div');
             cfg['d'+i] = div;
             frag.appendChild(div);

        }
        //risize 点样式
        cssText(cfg.d0,'position:absolute;top:0;left:0;background-color:blue;width:10px;height:10px;cursor:nw-resize;');
        cssText(cfg.d1,'position:absolute;top:0;right:0;background-color:blue;width:10px;height:10px;cursor:sw-resize;');
        cssText(cfg.d2,'position:absolute;bottom:0;right:0;background-color:blue;width:10px;height:10px;cursor:se-resize;');
        cssText(cfg.d3,'position:absolute;bottom:0;left:0;background-color:blue;width:10px;height:10px;cursor:ne-resize;');
        //是否显示
        each(cfg.resizePoint,function(el,index){
            if(el == 0){
                cfg['d'+ index].style.display = 'none';
            }
        })

        cfg.resizeObj.appendChild(frag);
        return cfg;
    }

    return function (cfg){
        cfg = init(cfg);
        var fireObj = cfg.fireObj, 
            resizeObj = cfg.resizeObj, 
            parentObj = cfg.parentObj;

        cfg.d0.onmousedown = cfg.d1.onmousedown = cfg.d2.onmousedown = cfg.d3.onmousedown = function(event) {
            cfg.start && (cfg.start.call(this));

            var event = event || window.event;
            var clientX = event.clientX,
                clientY = event.clientY,
                offsetLeft = getAbsLeft(resizeObj,parentObj),//到父元素的距离
                offsetTop = getAbsTop(resizeObj,parentObj),
                orgWidth = resizeObj.clientWidth, //原始宽度
                orgHeight = resizeObj.clientHeight;

            //移动和弹起事件绑定到document对象上，避免移动太快出现脱节的现象，只有在点击之后才绑定事件，鼠标弹起则移除事件。
            document.onmouseup = stop;
            document.onmousemove = move;

            //拖动时，文字会被选中是浏览器的默认行为，要去掉
            if (window.event) {
                return false;
            } else {
                event.preventDefault();
            }

            function stop() {
                cfg.stop && (cfg.stop.call(resizeObj));
                document.onmouseup = null;
                document.onmousemove = null;
                if (resizeObj.setCaptuer) {
                    resizeObj.setCaptuer();
                }
            }

            function move(event) {
                cfg.move && (cfg.move.call(resizeObj));
                var event = event || window.event;
                //元素内容宽高
                var width = orgWidth + (event.clientX - clientX),
                    height = orgHeight + (event.clientY - clientY),
                    maxWidth = cfg.maxWidth || parentObj.clientWidth - offsetLeft,
                    maxHeight = cfg.maxHeight || parentObj.clientHeight - offsetTop;
                //边界检测
                if (width < cfg.minWidth) {
                    width = cfg.minWidth;
                } else if (width > maxWidth ) {
                    width = maxWidth;
                }

                if (height < cfg.minHeight) { 
                    height = cfg.minHeight; 
                } else if (height > maxHeight ) { 
                    height = maxHeight; 
                }

                if(cfg.synchronous){
                    var max = width;
                    cfg.xAxis && (resizeObj.style.width = max + "px");
                    cfg.yAxis && (resizeObj.style.height = max + "px");
                }else{
                    cfg.xAxis && (resizeObj.style.width = width + "px");
                    cfg.yAxis && (resizeObj.style.height = height + "px");
                }

            }

            }
    }
})(window,undefined)