/**
 * Created by Danny on 2015/9/15 14:57.
 */
(function () {
    //地图类
    window.Map = Class.extend({
        //row 行， 合法值0~4
        //col 列， 合法值0~5
        //color 颜色，合法值1~4
        init: function () {
            //地图
            this.aerialMap = [
                [1,2,3,0,1,2],
                [2,2,2,2,0,1],
                [1,2,3,3,1,2],
                [3,1,1,1,0,1],
                [1,3,1,3,3,3]
            ];
            this.aerialMapClone = [
                [1,2,3,0,1,2],
                [2,2,2,2,0,1],
                [1,2,3,3,1,2],
                [3,1,1,1,0,1],
                [1,3,1,3,3,3]];
            //存放真实钻石的数组
            this.diamondArray = [
                [null,null,null,null,null,null],
                [null,null,null,null,null,null],
                [null,null,null,null,null,null],
                [null,null,null,null,null,null],
                [null,null,null,null,null,null]
            ];


            this.bindListener();

        },


        update:function(){



           // 将空集往上放
            for(var n=0;n<6;n++){
                for(var i=4;i>=1;i--){
                    for(var r=0;r<6;r++){
                        //console.log(111111111111)
                        if(!this.diamondArray[i][r]){
                            this.diamondArray[i][r] = this.diamondArray[i-1][r];
                            this.diamondArray[i-1][r] = null;
                            if(this.diamondArray[i][r]){
                                this.diamondArray[i][r].row = i;
                                this.diamondArray[i][r].col = r;

                            }
                        }
                    }
                }
            };




        },
        //时时映射
        AllTimeReflect:function(){


            for(var i=0;i<5;i++){
                for(var r=0;r<6;r++){
                    if(this.diamondArray[i][r]){
                        this.aerialMap[i][r] = this.diamondArray[i][r].color
                    }
                }
            };
        },




        //如果有空缺上面的钻石往下落来填满；
        fullInTheNull:function(){

            for(var i=0;i<5;i++){
                for(var r=0;r<6;r++){
                    if(!this.diamondArray[i][r]){
                        this.diamondArray[i][r] = new Diamond(i,r, _.random(0,3),(38+r*49),(170 - 49*5))
                    }
                }
            }
        },

        //根据地图来更改真实钻石数组的内容
        updateDiamondArrayByAerialMap : function(){
            for(var row = 0 ; row < 5 ; row++){
                for(var col = 0 ; col < 6 ; col++){
                    this.diamondArray[row][col] = new Diamond(row,col,this.aerialMap[row][col],(38+col*49),(170+row*49));
                }
            }
        },
        //渲染所有的钻石（渲染之前，会刷新所有的钻石）
        renderAllDiamonds : function(){
            for(var row = 0 ; row < 5 ; row++){
                for(var col = 0 ; col < 6 ; col++){
                    if(this.diamondArray[row][col]){
                        this.diamondArray[row][col].update();
                    }
                    if(this.diamondArray[row][col]){
                        this.diamondArray[row][col].render();
                    }
                }
            }
        },
        //判断是否能够消除钻石，参数是一个二维矩阵
        //鸟瞰矩阵。
        //也就是说，判断这个arr中，是不是有连续的3个或者3个以上的元素相同。
        check : function(arr){
            this.bombDiamonds = []; //存放的是能够被消除的钻石

            //按行来比
            for(var row = 0 ; row < 5 ; row++){
                //标记，每扫描一行，标记就是这一行的第一个元素的值
                var s = arr[row][0];
                //a就是相同元素的列序号起点
                var a = 0;
                //相同元素列的终点
                var b = 0;
                for(var col = 0 ; col < 6 ; col++){
                    //比较的这个数字，和标记不同，那么自己成为标记
                    if(arr[row][col] != s){
                        s = arr[row][col];
                        a = col;
                    }else{
                        //如果相同了，那么记录终点的列号
                        b = col;
                    }
                    if(b - a >= 2){
                        //console.log("第",row,"行","从",a,"到", b,"相同");
                        for(var i=0;i<=(b-a);i++){
                            this.bombDiamonds.push(this.diamondArray[row][a+i]);
                        }


                    }
                }
            }

            //按列比：
            for(var col = 0 ; col < 6 ; col++){
                var s = arr[0][col];
                var a = 0;
                var b = 0;
                for(var row = 0 ; row < 5 ; row++){
                    if(arr[row][col] != s){
                        s = arr[row][col];
                        a = row;
                    }else{
                        b = row;
                    }
                    if(b - a >= 2){
                        for(var i=0; i<=(b-a);i++){
                            //console.log("第",col,"列","从",a,"到", b,"相同");
                            this.bombDiamonds.push(this.diamondArray[a+i][col])
                        }
                    }

                }
            }



            //return(bombDiamonds)

        },

        beginBome:function(){
            for(var r=0;r<this.bombDiamonds.length;r++){
                if(this.bombDiamonds[r]){
                    this.bombDiamonds[r].isBomb = true;
                }
            }

        },
        //绑定监听
        bindListener : function(){



            var self = this;
            //存放按下去和抬起来两个位置对象的数组。
            // 形如[{"row":3,"col":3},{"row":3,"col":4}];
            var twoPoint = [];
            //鼠标按下
            game.canvas.addEventListener("mousedown",function(event){
                //判断此时在谁身上按下的。
                var row = parseInt((event.offsetY - 170) / 49);
                var col = parseInt((event.offsetX - 38) / 49);
                //有效性验收
                if(row <= 4 && row >= 0 && col <= 5 && col >= 0){
                    //值有效
                    twoPoint[0] = {"row" : row , "col" : col};
                }
            });

            //鼠标抬起
            game.canvas.addEventListener("mouseup",function(event){
                //game.couldNextMove = false;

                //先映射;

                //在判断之前需要先克隆一份出来以备还原
                self.cloneArr();


                //判断此时在谁身上按下的。
                var row = parseInt((event.offsetY - 170) / 49);
                var col = parseInt((event.offsetX - 38) / 49);
                //抬起点有效性验收
                if(row <= 4 && row >= 0 && col <= 5 && col >= 0){
                    //值有效
                    twoPoint[1] = {"row" : row , "col" : col};
                }

                //按下、抬起两个点的关系验收
                //要么row一样，col差1；要么col一样，row差1
                //所以，验收方法很巧妙，就是看两个row的差值绝对值，与两个col的差值的和绝对值，如果是1，就是合法的。
                if(Math.abs(twoPoint[0].row - twoPoint[1].row) + Math.abs(twoPoint[0].col - twoPoint[1].col) == 1){
                    console.log(twoPoint[0].row,twoPoint[0].col);
                    //验收成功
                    var diamond0 = self.diamondArray[twoPoint[0].row][twoPoint[0].col];
                    var diamond1 = self.diamondArray[twoPoint[1].row][twoPoint[1].col];

                    diamond0.row = twoPoint[1].row;
                    diamond0.col = twoPoint[1].col;
                    diamond1.row = twoPoint[0].row;
                    diamond1.col = twoPoint[0].col;

                    //console.log(self.diamondArray[twoPoint[0].row][twoPoint[0].col])






                    game.frameUtil.orderDoSomethingFrameLater(10, function () {
                        //需要映射判断，将现在全部的映射到一个鸟瞰图上
                        var diamond0 = self.diamondArray[twoPoint[0].row][twoPoint[0].col];
                        var diamond1 = self.diamondArray[twoPoint[1].row][twoPoint[1].col];



                        self.aerialMapClone[twoPoint[1].row][twoPoint[1].col] = diamond0.color;
                        self.aerialMapClone[twoPoint[0].row][twoPoint[0].col] = diamond1.color;



                            self.check(self.aerialMapClone);


                            if (self.bombDiamonds.length >= 3) {

                                var Translation = {};
                                for (var i in self.diamondArray[twoPoint[0].row][twoPoint[0].col]) {
                                    Translation[i] = self.diamondArray[twoPoint[0].row][twoPoint[0].col][i]
                                }
                                ;
                                //让两个会换对象
                                self.diamondArray[twoPoint[0].row][twoPoint[0].col] = self.diamondArray[twoPoint[1].row][twoPoint[1].col];
                                self.diamondArray[twoPoint[1].row][twoPoint[1].col] = Translation;

                                console.log(self.diamondArray)


                                if (game.couldNextMove) {
                                    game.couldNextMove = false;
                                    self.beginBome();
                                }
                            } else {
                                //console.log(diamond0.row, diamond0.col)


                                var diamond0 = self.diamondArray[twoPoint[0].row][twoPoint[0].col];
                                var diamond1 = self.diamondArray[twoPoint[1].row][twoPoint[1].col];

                                //diamond0.moveTo(twoPoint[0])
                                //diamond1.moveTo(twoPoint[1])


                                diamond1.row = twoPoint[1].row;
                                diamond1.col = twoPoint[1].col;
                                diamond0.row = twoPoint[0].row;
                                diamond0.col = twoPoint[0].col;


                                console.log(diamond0.row, diamond0.col)


                            }





                    });
                }
            });
        },

        cloneArr:function(){
            for(var i=0;i<5;i++){
                for(var r=0;r<6;r++){
                    this.aerialMapClone[i][r] = this.aerialMap[i][r];
                }
            }
        }


    });
})();