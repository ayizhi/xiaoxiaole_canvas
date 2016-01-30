/**
 * Created by Danny on 2015/9/9 15:06.
 */
(function () {
    //帧工具类。提供当前的帧数；提供当前的真实fps。
    window.FrameUtil = Class.extend({
        //初始化
        init: function () {
            //当前帧序号
            this.currentFrame = 0;

            //起始帧，用于统计FPS的
            this.sFrame = 0;
            this.sTime = new Date();

            //真实fps
            this.realFps = 0;

            //数组，来存放所有的预约
            this.appointment = [];
        },
        //更新，这个函数在mainloop每帧执行
        update: function () {
            //当前帧序号自增1
            this.currentFrame++;
            //判断是否是sTime+1000
            var t = new Date();
            if (t - this.sTime >= 1000) {
                //计算1000毫秒里面的帧序号的流逝
                this.realFps = this.currentFrame - this.sFrame;
                //当前的帧序号，就是新的起点标志帧
                this.sFrame = this.currentFrame;
                //当前帧的发生时间，就是新的标志帧时间
                this.sTime = t;
            }
            //每帧，都要遍历所有的预约事件。一一比对，此帧是不是某一个预约事件的时间点
            for(var i = 0 ; i < this.appointment.length ; i++){
                //看看此帧是不是某一个预约事件的时间点
                if(this.currentFrame == this.appointment[i].frame + 1){
                    this.appointment[i].fn();
                }
            }
        },
        //预约做什么事情类。
        //传递两个参数，第一个参数，表示都少帧之后。
        //第二个参数表示，做什么事情。
        orderDoSomethingFrameLater : function(frameNumLater,fn){
            //放数组中，放入本次预约信息
            this.appointment.push({
                //要执行的帧， 预约点。
                frame : this.currentFrame + frameNumLater,
                //要执行的事儿
                fn : fn
            });
        }
    });
})();