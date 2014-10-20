//拖动元素1，改变元素2的大小
var resizeAble = (function(){

    return function(cfg){
        //触发id默认为dragId
        cfg.fireObjId = cfg.fireObjId || cfg.resizeObjId;

        var resizeObj = document.getElementById(cfg.resizeObjId),
            fireObj = document.getElementById(cfg.fireObjId);
        fireObj.onmousedown = function() {
            var event = event || window.event;
            var disX = event.clientX - this.offsetLeft
            var disY = event.clientY - this.offsetTop
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
                if (fireObj.setCaptuer) {
                    fireObj.setCaptuer();
                }
            }

            function move() {
                var event = event || window.event;
                //当前应该在的位置
                var left = event.clientX - disX;
                var top = event.clientY - disY;
                //边界检测
                if (left < 0) {
                    left = 0;
                } else if (left > document.documentElement.clientWidth - fireObj.offsetWidth) {
                    left = document.documentElement.clientWidth - fireObj.offsetWidth;
                }

                if (top < 0) {
                    top = 0;
                } else if (top > document.documentElement.clientHeight - fireObj.offsetHeight - resizeObj.offsetTop) {
                    top = document.documentElement.clientHeight - fireObj.offsetHeight - resizeObj.offsetTop;
                }

                //resize，width为移动的距离加上图标方块的距离
                resizeObj.style.width = (left + fireObj.offsetWidth) + "px";
                resizeObj.style.height = (top + fireObj.offsetHeight) + "px";
            }
    }
    

    }
})(window,undefined)