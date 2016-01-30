/**
 * Created by Danny on 2015/9/15 14:57.
 */
(function () {
    //��ʯ��
    window.Diamond = Class.extend({
        //row �У� �Ϸ�ֵ0~4
        //col �У� �Ϸ�ֵ0~5
        //color ��ɫ���Ϸ�ֵ0~3
        init: function (row, col, color,x,y) {
            //�С��С���ɫ
            this.row = row;
            this.col = col;
            this.color = color;
            //��ǰ������
            this.x =  x;
            this.y =  y;



            //��ը��Ҫ
            this.isBomb = false;
            this.image = "zuanshi" + this.color;
            this.frame = 0;
            this.imgX = this.x;
            this.imgY = this.y;



        },
        // update������ÿִ֡�С�
        update : function(){
            //this.x += this.dX;
            //this.y += this.dY;


            if(Math.round(this.x) != this.col*49 + 38){
                this.x += ((this.col*49 + 38) - this.x)/10;
                game.couldNextMove = false;
            }else{
                this.x = (this.col*49 + 38);
                game.couldNextMove = true;
            }
            if(Math.round(this.y) != this.row*49 + 170){
                this.y +=((this.row*49 + 170) - this.y)/10;
                game.couldNextMove = false;
            }else{
                this.y = (this.row*49 + 170);
                game.couldNextMove = true;
            }
            //console.log(this.x,this.y)




            //��ը
            if(this.isBomb){
                this.frame++;
                if(this.frame<=6){
                    this.image = "an" + this.frame;
                    this.imgX = this.x - 65;
                    this.imgY = this.y - 65;
                }else{
                    this.frame = 0;
                    this.isBomb = false;
                    game.map.diamondArray[this.row][this.col] = null;
                    //console.log(game.map.diamondArray)
                }

            }else{
                this.image = "zuanshi" + this.color;
                this.imgX = this.x;
                this.imgY = this.y;
            }



        },
        // ����ÿ֡����clearRect���������render����ÿִ֡�С�
        render: function () {
            //��Ⱦ�ڻ�����
            game.ctx.drawImage(game.images[this.image],this.imgX ,this.imgY);
        },
        //�ƶ���Ŀ���С����ϡ���10֡�˶���ϡ�
        //�����ƶ���Զ������10֡���ƶ���ϡ�
        //����point���� {"row":3,"col":4}
        moveTo: function (point) {
            game.couldNextMove = false;
            //Ŀ������

            //���ǹ涨��20֡��ִ����϶���������ÿһ���ĳ��ȣ�������·�̲����10
            this.dX = (point.col - this.col) * 49/ 10;
            this.dY = (point.row - this.row) * 49/ 10;

            var self = this;
            //ԤԼ10֮֡���Լ�ͣ��
            game.frameUtil.orderDoSomethingFrameLater(10,function(){
                self.stop();
            });
        },
        //ֹͣ������
        stop : function(){
            console.log("x:"+this.x)
            console.log("y:"+this.y)
            this.dX = 0;
            this.dY = 0;
            game.couldNextMove = true;
        }
    });
})();