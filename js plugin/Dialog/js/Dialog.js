/**
 * Created by Administrator on 2014/8/11 0011.
 */
/*
 * var d1 = new diloag({
 *       'targetId':'btn',
 *       'dilagId':'d1'
 * });
 * */
(function () {

    var setStyle = function (obj, info) {
        for (var i in info) {
            obj.style[i] = info[i];
        }
    }

    //阴影层
    var divGry = document.createElement('div');
    setStyle(divGry, {
        'filter':'alpha(opacity:70)',
        'opacity': '0.7',
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'backgroundColor': '#7B7B7B',
        'zIndex': 1000,
        'display': 'none'
    })
    document.body.appendChild(divGry);

    //对外接口
    var dialog = function (config) {
        //初始化弹出框参数
        this.obj = document.getElementById(config.dialogId);
        this.fireObj = document.getElementById(config.fireObj);

        this.width = this.obj.offsetWidth;
        this.height = this.obj.offsetHeight;
        var self = this;

        setStyle(this.obj, {
            'position': 'absolute',
            'zIndex': 2000,
            'top': '50%',
            'left': '50%',
            'marginLeft': -1 * (this.width / 2) + "px",
            'marginTop': -1 * (this.height / 2) + "px"
        });

        this.fireObj.onclick = function () {
            setStyle(divGry, {'display': 'block'});
            setStyle(self.obj, {'visibility': 'visible'});
        }     

    }

    dialog.prototype.close = function () {
        setStyle(divGry, {'display': 'none'});
        setStyle(this.obj, {'visibility': 'hidden'});
    }
    window.dialog = dialog;
})()