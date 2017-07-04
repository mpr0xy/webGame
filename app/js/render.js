/**
 * Created by hansir on 2017/6/21.
 */
$(function(){
  $.getJSON("../mock/data.json",function(response){
    var userInfo = response.data;
    $.getJSON("../mock/word.json",function(response){
      var Words = response.data;
      render(userInfo,Words);
    })
  });
  function render(userInfo,Words){
    var app = new Vue({
      el:'#main',
      data:{
        userInfo:userInfo,
        answer:'',
        show:false,
        btntxt:'我要抢答',
        painter:'',
        theUser:'',
        words:Words,
        chooseword:'',
        close:true,
        ctime:6,
        time:80,
        ttitle:'',
        tcontent:'',
        answerword:'',
        choosewords:false,
        end:false
      },
      created:function(){
        this.userInfo[0].currentUser = true;
        this.user();
        this.thePainter();
        if(this.theUser.currentUser == true){
          this.btntxt = '结束';
        }
        this.givewords();
      },
      methods:{
        //登录用户信息
        user:function(){
          var _userId = 01;
          var _this = this;
          this.userInfo.forEach(function(element){
            if(_userId == element.id){
              _this.theUser = element;
            };
            if(element.currentUser == true){
              _this.close = false;
            }
          })
        },
        //每次开始作画初始化

        //当前画画的人
        thePainter:function(){
          var _this = this;
          this.userInfo.forEach(function(element){
            if(element.currentUser == true){
              _this.painter = element;
            }
          });
        },
        //系统给出四个词
        givewords:function(){
         var nullarr = [];
         var arrs = [];
         var random;
         var newarr = nullarr.concat(this.words);
         for(var i = 1;i <= newarr.length;i++){
           random = Math.floor(Math.random()*newarr.length);
           arrs.push(newarr[random]);
           newarr.splice(random,1);
           if(arrs.length == 4){
             break;
           }
         }
          this.chooseword = arrs;
          this.choosetime();
        },
        //画画的人选词
        chooseWord:function(event){
          var _this = this;
          if(event){
            var _answerword = event.srcElement.innerText;
            this.choosewords = true;
            this.choosetime();
          } else {
            _answerword = this.chooseword[Math.floor(Math.random()*4)].word;
          }
          this.words.forEach(function(element,index){
            if(_answerword == element.word){
              _this.words.splice(index,1);
            }
          });
          this.close = true;
          this.answerword = _answerword;
          this.tips();
        },
        //选词记时
        choosetime:function(){
          var _this = this;
          if(this.choosewords){
            return ;
          }
          setTimeout(function(){
            _this.ctime --;
            if(_this.ctime == 0 ){
              _this.chooseWord();
              return;
            }
            _this.choosetime();
          },1000);
        },
        //记分
      scoring:function() {
        var _painter = this.painter;
        var _player = this.theUser;
        var i = 0;
        if (i < 5) {
          i++;
          _painter.score = _painter.score + 15;
        } else {
          _painter.score = _player.score - 15 * 5;
        };
        switch (i) {
          case 1:
            _player.score = _player.score + 40;
            break;
          case 2:
            _player.score = _player.score + 30;
            break;
          default:
            _player.score = _player.score + 15;

        }
      },
        //判断答案正确性
        clickEnter:function(){
          if(this.answer == this.answerword){
            alert("恭喜答对！");
            this.scoring();
            this.theUser.seccess = true;
          } else{
            alert("回答错误");
          }
          this.clickClose();
        },
        //点击我要抢答或结束按钮
        clickInput:function(){
          var _this = this;
          if(_this.btntxt == '我要抢答'){
            _this.show = true;
          } else{
            if(_this.time <= 50){
              this.finish();
            } else{
              alert("作画时间不足30秒，不能结束");
            }
          }
        },
        //关闭提交答案对话框
        clickClose:function(){
          this.show = false;
        },
        //结束作画
        finish:function(){
          var _index = 0;
          this.end = true;
          this.userInfo.forEach(function(element,index){
             if(element.currentUser == true){
                _index = index;
             }
          });
          if (_index === this.userInfo.length - 1) {
            this.userInfo[0].currentUser = true;
          } else  {
            this.userInfo[_index].currentUser = false;
            this.userInfo[_index + 1].currentUser = true;
          }
          this.userInfo.forEach(function(element){
            element.seccess = false;
          })
          this.thePainter();
          this.clearCanvas();
          this.btntxt ='我要抢答';
        },
        //提示
        tips:function(){
          var _this = this;
          this.time = 80;
          if(this.theUser.currentUser == true){
            this.ttitle = '提示';
            this.tcontent = this.answerword;
          } else{
            this.words.forEach(function(element){
              if(_this.answerword == element.word){
                _this.ttitle = element.numword + '个字';
                _this.tcontent = element.prompt;
              }
            })
          }
          this.drawtime();
        },
        //绘画计时
        drawtime:function(){
          var _this = this;
          if(this.end == true){
            return;
          }
          setTimeout(function(){
            _this.time --;
            if(_this.time == 0){
              _this.finish();
            }
            _this.drawtime();
          },1000)
        },
        //清除画布
        clearCanvas:function(){
          var _canvas = document.getElementById('myCanvas');
          var cxt = _canvas.getContext('2d');
          cxt.clearRect(0,0,_canvas.width,_canvas.height);
        }
      }
    });
    //vue 渲染完后加载canvas画布
    setTimeout(function() {
      initCanvas();
    }, 1000);
  }
})