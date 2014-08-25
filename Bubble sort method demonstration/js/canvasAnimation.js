/*
 *Aniele动画对象
 *所有动画对象的始祖
 */
 var Aniele=function(){
     this.img=new Image();
     //定义动画对象位置
     this.loca={
             x:300,
             y:300
     }
     //定义动画对象的大小（可以实现缩放）
     this.dw;
     this.dh;
     //动画对象的速度属性
     this.speed={
             x:0,
             y:0
     }    
     //设置对象的透明度
     this.alpha=1;
     //设置图像翻转，1为不翻转，-1为翻转
     this.scale={
             x:1,
            y:1
     }
     //定动画对象的运动方法库
     this.motionFncs=[];
 }
 Aniele.prototype={
     //添加运动方法
     addMotionFnc:function (name,fnc) {
        this.motionFncs[name]=fnc;
    },
    //删除运动方法
    deleMotionFnc:function(name){
        this.motionFncs[name]=null;
    },
    //遍历运动方法库里的所有运动方法
    countMotionFncs:function () {
        for (var i=0; i<this.motionFncs.length; i++) {
            if(this.motionFncs[i]==null)
                continue;
            this.motionFncs[i].call(this);
        }
    },
    //把自己绘制出来的方法，包括功能：水平翻转
    draw:function(canvas,ctx){
        //存储canvas状态
        ctx.save();
        //实现透明度的改变
        ctx.globalAlpha=this.alpha;
        //实现水平竖直翻转，定义drawImage的两个位置参数dx，dy
        var dx=this.loca.x;
        var dy=this.loca.y;
        if(this.scale.x!=1||this.scale.y!=1){
            if(this.scale.x<0){
                console.log(this.img.width)
                dx=canvas.width-this.loca.x-this.img.width;
                ctx.translate(canvas.width,1);
                ctx.scale(this.scale.x,1);
            }    
            if(this.scale.y<0){
                dy=canvas.height-this.loca.y-this.img.height;
                ctx.translate(1,canvas.height);
                ctx.scale(1,this.scale.y);
            }    
        }
        if(this.dw==null)
            this.dw=this.img.width;
        if(this.dh==null)
             this.dh=this.img.height;
        //画出对象
        ctx.drawImage(this.img,dx,dy,this.dw,this.dh);
        //恢复canvas状态    
        ctx.restore();
    }
 }


 /*
*Render渲染对象
*管理所有动画对象和渲染
*参数：画布对象，画布上下文
*/
var Render=function (canvas,ctx) {
    //引入画布
    this.canvas=canvas;
    this.ctx=ctx;
    //创建一个缓冲画布
    this.backBuffer=document.createElement('canvas');
    this.backBuffer.width=this.canvas.width;
    this.backBuffer.height=this.canvas.height;
    this.backBufferctx=this.backBuffer.getContext('2d');
    //所有动画对象
    this.aniEles=[];
}
Render.prototype={
    //初始化画布int
    int:function () {
        clearInterval(this.sint);
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.backBufferctx.clearRect(0,0,this.backBuffer.width,this.backBuffer.height);
    },
    //设置开始渲染
    begin:function () {
        this.lastFrame=(new Date()).getTime();
        this.sint=setInterval((function(progra){
            return function(){progra.render();}
        })(this),SECOND);    
    },
    //主渲染方法
    render:function () {
        //在画布和缓存画布上清除历史帧
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.backBufferctx.clearRect(0,0,this.backBuffer.width,this.backBuffer.height);
        //保存当前的实时输出帧率this.ftp
        this.nowFrame=(new Date()).getTime();
        this.ftp=1000/(this.nowFrame-this.lastFrame);
        this.lastFrame=this.nowFrame;
        //调用每个动画对象的运动方法
        for (var i=0; i<this.aniEles.length; i++) {
            if(this.aniEles[i]==null)
                continue;
            this.aniEles[i].countMotionFncs();
            //把对象绘制到后台缓冲画布上
            this.aniEles[i].draw(this.backBuffer,this.backBufferctx);
        }    
        //把后台对象绘制到前台
        this.ctx.drawImage(this.backBuffer,0,0);
    },
    //增加动画对象
    addAniEle:function (name,aniEle) {
        this.aniEles[name]=aniEle;
    },
    //删除动画对象
    deleAniEle:function (name) {
        this.aniEles[name]=null;
    }
}