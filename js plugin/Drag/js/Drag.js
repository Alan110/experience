
/**
 * 普通拖拽 核心思想  根据鼠标的绝对位移
 * 唯一参数对象cfg，有以下属性
 * dragId       拖拽对象id 
 * fireObjId    触发拖拽对象id 默认为dragId
 * parentId     容器对象id 默认为整个窗口,容器对象需要设置position属性
 * @return {[type]} [description]
 */
var dragAble = (function(){

    /**
     * 获取obj的绝对位置，
     * @param  {[type]} obj          [对象]
     * @param  {[type]} referenceObj [参照对象，递归的顶点]
     * @return {[type]}              [description]
     */
    function getAbsLeft(obj,referenceObj){
        return obj.offsetLeft + ( !obj.offsetParent || obj.offsetParent === referenceObj ) ? 
            0 : getAbsLeft(obj.offsetParent,referenceObj);
    }

    function getAbsTop(obj,referenceObj){
        return obj.offsetTop + ( !obj.offsetParent || obj.offsetParent === referenceObj ) ? 
            0 : getAbsTop(obj.offsetParent,referenceObj);
    }

    function init(cfg){
        cfg.dragObj = document.getElementById(cfg.dragId),
        cfg.fireObj = document.getElementById(cfg.fireObjId) || cfg.dragObj,
        cfg.parentObj = document.getElementById(cfg.parentId) || document.documentElement;
        return cfg;
    }

    return function (cfg){
        cfg = init(cfg);
        var fireObj = cfg.fireObj, dragObj = cfg.dragObj, parentObj = cfg.parentObj;

        fireObj.style.cursor = 'move';
        fireObj.onmousedown = function(event) {
            var event = event || window.event;
            var clientX = event.clientX,
                clientY = event.clientY,
                offsetLeft = getAbsLeft(dragObj,parentObj),//到父元素的距离
                offsetTop = getAbsTop(dragObj,parentObj);

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
                document.onmouseup = null;
                document.onmousemove = null;
                if (dragObj.setCaptuer) {
                    dragObj.setCaptuer();
                }
            }

            function move(event) {
                var event = event || window.event;
                //相对于父元素当前应该在位置
                var left = offsetLeft + (event.clientX - clientX);
                var top = offsetTop + (event.clientY - clientY);
                //边界检测
                if (left < 0) {
                    left = 0;
                } else if (left > parentObj.clientWidth - dragObj.offsetWidth) {
                    left = parentObj.clientWidth - dragObj.offsetWidth;
                }

                if (top < 0) {
                    top = 0;
                } else if (top > parentObj.clientHeight - dragObj.offsetHeight) {
                    top = parentObj.clientHeight - dragObj.offsetHeight;
                }

                dragObj.style.left = left + "px";
                dragObj.style.top = top + "px";
            }

            }
    }
		

})(window,undefined);