/**
 * Created by Danny on 2015/9/15 14:57.
 */
(function () {
    //钻石类
    window.Diamond = Class.extend({
        //row 行， 合法值0~4
        //col 列， 合法值0~5
        //color 颜色，合法值0~3
        init: function (row, col, color,x,y) {
            //行、列、颜色
            this.row = row;
            this.col = col;
            this.color = color;
            //当前的坐标
            this.x =  x;
            this.y =  y;



            //爆炸需要
            this.isBomb = false;
            this.image = "zuanshi" + this.color;
            this.frame = 0;
            this.imgX = this.x;
            this.imgY = this.y;



        },
        // update函数，每帧执行。
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




            //爆炸
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
        // 画布每帧都是clearRect，所以这个render函数每帧执行。
        render: function () {
            //渲染在画布上
            game.ctx.drawImage(game.images[this.image],this.imgX ,this.imgY);
        },
        //移动到目标行、列上。用10帧运动完毕。
        //不管移动多远，都用10帧，移动完毕。
        //参数point形如 {"row":3,"col":4}
        moveTo: function (point) {
            game.couldNextMove = false;
            //目标坐标

            //我们规定是20帧，执行完毕动画，所以每一步的长度，就是总路程差除以10
            this.dX = (point.col - this.col) * 49/ 10;
            this.dY = (point.row - this.row) * 49/ 10;

            var self = this;
            //预约10帧之后，自己停掉
            game.frameUtil.orderDoSomethingFrameLater(10,function(){
                self.stop();
            });
        },
        //停止动画：
        stop : function(){
            console.log("x:"+this.x)
            console.log("y:"+this.y)
            this.dX = 0;
            this.dY = 0;
            game.couldNextMove = true;
        }
    });
})();