/**
 * Created by Danny on 2015/9/9 15:06.
 */
(function () {
    //֡�����ࡣ�ṩ��ǰ��֡�����ṩ��ǰ����ʵfps��
    window.FrameUtil = Class.extend({
        //��ʼ��
        init: function () {
            //��ǰ֡���
            this.currentFrame = 0;

            //��ʼ֡������ͳ��FPS��
            this.sFrame = 0;
            this.sTime = new Date();

            //��ʵfps
            this.realFps = 0;

            //���飬��������е�ԤԼ
            this.appointment = [];
        },
        //���£����������mainloopÿִ֡��
        update: function () {
            //��ǰ֡�������1
            this.currentFrame++;
            //�ж��Ƿ���sTime+1000
            var t = new Date();
            if (t - this.sTime >= 1000) {
                //����1000���������֡��ŵ�����
                this.realFps = this.currentFrame - this.sFrame;
                //��ǰ��֡��ţ������µ�����־֡
                this.sFrame = this.currentFrame;
                //��ǰ֡�ķ���ʱ�䣬�����µı�־֡ʱ��
                this.sTime = t;
            }
            //ÿ֡����Ҫ�������е�ԤԼ�¼���һһ�ȶԣ���֡�ǲ���ĳһ��ԤԼ�¼���ʱ���
            for(var i = 0 ; i < this.appointment.length ; i++){
                //������֡�ǲ���ĳһ��ԤԼ�¼���ʱ���
                if(this.currentFrame == this.appointment[i].frame + 1){
                    this.appointment[i].fn();
                }
            }
        },
        //ԤԼ��ʲô�����ࡣ
        //����������������һ����������ʾ����֮֡��
        //�ڶ���������ʾ����ʲô���顣
        orderDoSomethingFrameLater : function(frameNumLater,fn){
            //�������У����뱾��ԤԼ��Ϣ
            this.appointment.push({
                //Ҫִ�е�֡�� ԤԼ�㡣
                frame : this.currentFrame + frameNumLater,
                //Ҫִ�е��¶�
                fn : fn
            });
        }
    });
})();