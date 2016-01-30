/**
 * Created by Danny on 2015年9月13日10:12:42
 */
(function(){
    //中介者模式
    window.Game = Class.extend({
        // 初始化
        init : function(params){
            this.couldNextMove = false;

            //画布、上下文，都是game的属性
            this.canvas = document.getElementById(params.canvasid);
            this.ctx = this.canvas.getContext("2d");
            //帧率
            this.fps = params.fps;
            //自己的帧管理器
            this.frameUtil = new FrameUtil();
            //静态资源管理
            var sr = new StaticResoucesUtil();
            //这个对象里面，存放着所有图片
            this.images = null;
            var self = this;
            sr.loadImages("r.json",function(alreayNum,allNum,images){
                //这个函数，将执行3次（因为一共有3张图片）
                self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
                self.ctx.font = "20px 微软雅黑";
                self.ctx.fillText("正在加载图片资源，当前" + alreayNum + " / " + allNum,20,40);
                //当全部图片已经加载完毕，那么开始游戏
                if(alreayNum == allNum){
                    self.run();
                    self.images = images;
                }
            });
        },
        //开始
        run : function(){
            //测试地图
            this.map = new Map();
            this.map.updateDiamondArrayByAerialMap();
            this.map.check(this.map.aerialMap);
            console.log(this.map.diamondArray)

            //设置主循环
            var self = this;
            this.timer = setInterval(function(){
                self.mainloop();
            },1000 / this.fps);
        },
        // 每帧执行
        mainloop : function(){
            //清除屏幕
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            //让自己的帧管理器更新
            this.frameUtil.update();
            //打印帧编号
            this.ctx.fillText(this.frameUtil.currentFrame,10,20);

            this.map.update();
            this.map.fullInTheNull();
            this.map.AllTimeReflect();
            this.map.check(this.map.aerialMap);
            if(this.couldNextMove){
                this.couldNextMove = false;
                this.map.beginBome();
            }
            this.map.renderAllDiamonds();
        },
        stop : function(){
            clearInterval(this.timer);
        }
    });
})();