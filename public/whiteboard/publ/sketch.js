var socket;
var color=document.getElementById('color-selector').value;
var weight=document.getElementById('weight').value;

document.getElementById('weight').addEventListener('input',function(){
    weight=this.value;
});
document.getElementById('color-selector').addEventListener('input',function(){
    color=this.value;
});

const canvas=document.getElementById('whiteboard');
const ctx=canvas.getContext('2d');

const originalWidth=window.innerWidth;
const originalHeight=window.innerHeight;

function setupCanvas(){ //this is the function to initialize the canvas as a white rectangle
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    loadDrawing(); //function to load drawing in localStorage
}

function saveDrawing(){
    const dataURL=canvas.toDataURL(); //converts the canvas content into a dataURL format
    localStorage.setItem('whiteboardDrawing',dataURL);
}

function loadDrawing(){
    const dataURL=localStorage.getItem('whiteboardDrawing');
    if(dataURL){
        const img=new Image();
        img.src=dataURL; //creating an object of a predefined class Image, used in processing images in js
        img.onload=function(){ //calling a function once the image is loaded
            ctx.drawImage(img,0,0,canvas.width,canvas.height); //draws the image on the resized screen
        };
    }
}

function resizeCanvas(){
    setupCanvas();
    loadDrawing();
}

function drawLine(x,y,px,py,color,weight){
    ctx.strokeStyle=color; //sets the pen color
    ctx.lineWidth=weight; //sets the weight of the pen
    ctx.lineCap="round"; //sets the shape of the brush here, round
    ctx.beginPath(); //Start of drawing a line
    ctx.moveTo(px,py); //px and py are the starting coordinates
    ctx.lineTo(x,y); //x and y are the new coordinates
    ctx.stroke(); //stroke commits the action of drawing a line
}



canvas.addEventListener('mousedown', onMouseDown); //checks when the mouse is pressed down. mousedown is the js function , and onMouseDown is the udf
let isDrawing=false; //used to track is the user is drawing

function onMouseDown(e){ //e is refering to an event. can use e and event interchangable //we cant do that
    isDrawing=true;

    const mouseMoveHandler = (e)=>{ //this happens when the mousemove event listerner gets trigger
        if(!isDrawing){
            return;
        }
        //x:-15 y:-46
        const x=(e.clientX);//clientX and clientY return the current positin of the cursor
        const y=(e.clientY);
        const px=e.movementX?(e.clientX-e.movementX):x; //movement returns the displacement since when the mouse was last moved
        const py=e.movementY?(e.clientY-e.movementY):y; //e.clientX-e.movementX calculates the displacement from the previous point if the moue has moved, otherwise just returns the old position itself

        //data is an object holding the values for x,y,px,py,color,weight
        const data={
            x:x, y:y, px:px, py:py, color:color, weight:weight
        };
        socket.emit('mouse',data);

        drawLine(x,y,px,py,color,weight);
        saveDrawing();
    };

    const mouseUpHandler=()=>{ //this happens when the mouseup listener is aactivate
        isDrawing=false; //sets the drawing state to false, so that the function stops
        canvas.removeEventListener('mousemove', mouseMoveHandler); //removes both the listeners so that we can hover without drawing anything
        canvas.removeEventListener('mouseup', mouseUpHandler);
    };

    canvas.addEventListener('mousemove', mouseMoveHandler); //these two listensers call lthe respective functions in the 2nd parameter when the specified event happens
    canvas.addEventListener('mouseup', mouseUpHandler);

}

function newDrawing(data){
    drawLine(data.x, data.y, data.px, data.py, data.color, data.weight);
}

function resetSketch(){
    socket.emit('reset');
}

function red(){
    color="#ff0f1c";
}
function blue(){
    color="#2374ff";
}
function green(){
    color="#009b43";
}
function black(){
    color="#000000";
}
function erase(){
    color="#ffffff";
}

window.addEventListener('resize',resizeCanvas);
socket = io();
socket.on('mouse', newDrawing);
socket.on('reset', () => {
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    localStorage.removeItem('whiteboardDrawing');
});


window.onload = setupCanvas;

function getMousePosition(event) {
    const x = event.clientX;
    const y = event.clientY;

    console.log(`Mouse Position: (${x}, ${y}) Window Dimensions: (${window.innerHeight},${window.innerWidth})`);
  }
  
document.addEventListener('mousemove', getMousePosition);