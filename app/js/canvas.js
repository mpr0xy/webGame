var touchPressed = false;
var lastX , lastY;
var ctx;
var canvasWidth = 400;
var canvasHeight = 400;




//initCanvas 用于初始化画布和touch事件
function initCanvas(){
  //添加canvas画布
  var canvasDiv = document.getElementById("canvasDiv");
  var canvas = document.createElement("canvas");
  canvas.setAttribute("height",canvasHeight);
  canvas.setAttribute("width",canvasWidth);
  canvas.setAttribute("id","myCanvas");
  canvasDiv.appendChild(canvas);
  ctx = canvas.getContext('2d');

  //初始化touch事件
  canvas.addEventListener("touchstart",touchdown);
  canvas.addEventListener("touchend",touchup);
  canvas.addEventListener("touchmove",touchmove);
  //开始touch屏幕
  function touchdown(e){
    var _touch = e.changedTouches[0];
    touchPressed = true;
    Draw(_touch.pageX - this.offsetLeft,_touch.pageY - this.offsetTop,false);
  }
  //结束touch屏幕
  function touchup(){
    touchPressed = false;
  }
  //在屏幕上移动
  function touchmove(e) {
    var _touch = e.changedTouches[0];
    if(touchPressed){
      Draw(_touch.pageX - this.offsetLeft,_touch.pageY - this.offsetTop,true)
    };
  }
  //绘图函数
  function Draw(x,y,isDown){
    if(isDown){
      ctx.beginPath();
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 10;
      ctx.lineJoin = "round";
      ctx.moveTo(lastX,lastY);
      ctx.lineTo(x,y);
      ctx.closePath();
      ctx.stroke();
    }
    lastX = x; lastY = y;
  }
}
//清空画布
function clearArea(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}
