var FileInputField;
var XScaleSlider;
var YScaleSlider;
var XScaleInput;
var YScaleInput;
var InputImage = "./sample_img_b.jpeg";
var _DrawImg = true;
var SliderOverCap = false;
var MouseMoveVec;
var PrevMouseVec;
var AddButton;
var MoveImage = false;
var FilterParent;
var FilterYPos;
var FilterArray;
var ImgOffSetX = 0;
var ImgOffSetY = 0;

//Setting-Up all the Sliders, InputFields, etc. and their Callbacks
function setup() {
  	var Canv = createCanvas(500, 500);
    Canv.mousePressed(MouseDownCanvas);
    background(51);
    PrevMouseVec = createVector(0,0);

    var GUIXOffset = 10;
    var GUIStdGap = 10;

	  FileInputField = createFileInput(handleFile);
	  FileInputField.position(GUIXOffset, height + 20);

    XScaleInput = createInput('100%');

    YScaleInput = createInput('100%');

    var P = createP('Scale on X');
    P.position(GUIXOffset,height + FileInputField.height + 20);
    P.style("margin","0");
    XScaleSlider = createSlider(GUIXOffset, 400, 100);
    XScaleSlider.position(GUIXOffset,height + FileInputField.height + P.height + 20);

    var P = createP('Scale on Y');
    P.position(GUIXOffset + XScaleInput.width + GUIStdGap,height + FileInputField.height + 20);
    P.style("margin","0");
    YScaleSlider = createSlider(GUIXOffset, 400, 100);
    YScaleSlider.position(XScaleInput.width + GUIStdGap + GUIXOffset,height + FileInputField.height + P.height + 20);

    XScaleInput.position(GUIXOffset,height + FileInputField.height + P.height + XScaleSlider.height + XScaleInput.height + 10);

    YScaleInput.position(XScaleInput.width + GUIStdGap + GUIXOffset, height + FileInputField.height + P.height + XScaleSlider.height + XScaleInput.height + 10);

    var PosY = height + FileInputField.height + P.height + XScaleSlider.height + XScaleInput.height + 50;

    AddButton = createButton("Add Filter");
    AddButton.position(GUIXOffset, PosY);
    AddButton.mousePressed(AddFilter);

    FilterParent = createDiv("");
    FilterParent.position(GUIXOffset, PosY + AddButton.height+10);
    FilterParent.style("width", width+"px");
    FilterParent.style("height", 500+"px");
    FilterParent.style("background-color", "#888888");
    FilterParent.style("overflow-y", "Scroll");
    FilterParent.style("font-family", "Verdana");
    FilterParent.style("font-size", "25px");

    FilterYPos = PosY + AddButton.height+10;
    
    
    InputImage = loadImage(InputImage);
    XScaleSlider.mouseOver(StartDrawImg);
    XScaleSlider.mouseOut(StopDrawImg);
    YScaleSlider.mouseOver(StartDrawImg);
    YScaleSlider.mouseOut(StopDrawImg);
    XScaleInput.input(HandelScaleXInput);
    YScaleInput.input(HandelScaleYInput);
    DrawImg();

}

var prevPosX = 0;
var prevPosY = 0;

function draw() {
  if(_DrawImg){
      DrawImg();
  }else if(true){
  }
}

// Handeling if a File was put into the FileInputBox
function handleFile (file){
	if (file.type === 'image'){
		InputImage = createImg(file.data);
    InputImage.hide();
    XScaleSlider.mouseOver(StartDrawImg);
    XScaleSlider.mouseOut(StopDrawImg);
    YScaleSlider.mouseOver(StartDrawImg);
    YScaleSlider.mouseOut(StopDrawImg);
    XScaleInput.input(HandelScaleXInput);
    YScaleInput.input(HandelScaleYInput);
    DrawImg();
	}
}

// Draws the Std. Image
function DrawImg(){
  background(51);
  var XValue = 0;
  var YValue = 0;
  if(MoveImage){
    ImgOffSetX = PrevMouseVec.x+(mouseX-MouseMoveVec.x); 
    ImgOffSetY = PrevMouseVec.y+(mouseY-MouseMoveVec.y); 
  }
  if(SliderOverCap){
    XValue =  XScaleInput.value().slice(0,XScaleInput.value().length-1);
    YValue =  YScaleInput.value().slice(0,YScaleInput.value().length-1);
  }else{
    XValue = XScaleSlider.value();
    YValue = YScaleSlider.value();
  }
  image(InputImage,-width*(XValue/100-1)/2+ImgOffSetX,-height*(YScaleSlider.value()/100-1)/2 + ImgOffSetY,width*(XValue/100),height*(YScaleSlider.value()/100));
  if(!SliderOverCap){
    XScaleInput.value( XScaleSlider.value()+"%");
    YScaleInput.value( YScaleSlider.value()+"%");
  }
}

// Changes bool to draw the Image on to the canves
function StartDrawImg(){
  _DrawImg = true;
}

function StopDrawImg(){
  _DrawImg = false;
  DoFilters();
}
// ********* //


function MouseDownCanvas(){
  
  MouseMoveVec = createVector(mouseX,mouseY);
  MoveImage = true;
  _DrawImg = true;
}

function mouseReleased(){
  if(MoveImage){
    DoFilters();
    PrevMouseVec = createVector(ImgOffSetX,ImgOffSetY);
    MoveImage = false;
    _DrawImg = false;
  }
}

// Handeling a Change on the InputFields for the Axis-Scaling
function HandelScaleXInput(){
  var InputString = XScaleInput.value();
  if(InputString[InputString.length-1] != '%' && InputString[InputString.length-2] != '%'){
    InputString = InputString.slice(0,InputString.length-1);
  }
  for(var i = 0; i < InputString.length;i++){
    if(isNaN(InputString[i])){
      InputString = InputString.slice(0,i)+InputString.slice(i+1,InputString.length);
    }
  }
  XScaleSlider.value(InputString);
  if(InputString > 400){
    SliderOverCap = true;
  }else{
    SliderOverCap = false;
  }
  DrawImg();
  XScaleInput.value(InputString + '%');
}

function HandelScaleYInput(){
  var InputString = YScaleInput.value();
  if(InputString[InputString.length-1] != '%' && InputString[InputString.length-2] != '%'){
    InputString = InputString.slice(0,InputString.length-1);
  }
  for(var i = 0; i < InputString.length;i++){
    if(isNaN(InputString[i])){
      InputString = InputString.slice(0,i)+InputString.slice(i+1,InputString.length);
    }
  }
  YScaleSlider.value(InputString);
  if(InputString > 400){
    SliderOverCap = true;
  }else{
    SliderOverCap = false;
  }
  DrawImg();
  YScaleInput.value(InputString + '%');
}
// ********* //

//FilterWindow Class: Array(ID,DOM,ExitDOM,index,Array(Parameter_1,Parameter_2,...,Parameter_n))

function DoFilters(){
  if(FilterArray != undefined)
  for(var i = 0; i < FilterArray.length; i++){
    if(FilterArray[i][0] == 0){
      Blur(FilterArray[i][4][1]);
    }else if(FilterArray[i][0] == 1){
      Line();
    }
  }
}

function AddFilter(){ 
  if(FilterArray){
    FilterArray.push(Array(-1,0,0,FilterArray.length,Array(1)));
    CreateFilterWindow(FilterArray[FilterArray.length-1]);
  }else{
    FilterArray = Array(Array(-1,0,0,0,Array(1)));
    CreateFilterWindow(FilterArray[0]);
  }
}

function CreateFilterWindow(data){
  var color = Array(Math.floor((Math.random() * 100) + 120),Math.floor((Math.random() * 100) + 120),Math.floor((Math.random() * 100) + 120));

  data[1] = createDiv("");
  data[1].style("background-color","rgb("+color[0]+","+color[1]+","+color[2]+")");

  data[1].parent(FilterParent);
  data[1].style("top","50px");
  data[1].style("height","100px");
  data[1].style("width","100%");
  
  CreateInnerComponents(data);
}

function CreateInnerComponents(data){

  if(data[2] != 0){
    data[2].remove();
  }

    for(var i = 0; i < data[4].length; i++){
      if(data[4][i] != undefined){
        data[4][i].remove();
      }
    }


  data[2] = createDiv("&times;");
  data[2].parent(data[1]);
  data[2].style("position", "absolute");
  data[2].style("right","0");
  data[2].style("top",((data[3] * data[1].height) + "px"));
  data[2].style("cursor","pointer");
  data[2].id("Exit");
  data[2].mousePressed(function(){
  console.debug("Delete "+data[3]+" Filter-Element");
    data[1].remove();
    if(FilterArray.length >= 1){
      FilterArray.splice(data[3],1);
      for (var i = data[3]; i < FilterArray.length; i++) {
          FilterArray[i][3] -= 1;
      }
      AdjustHeight();
      console.debug("Delete "+data[3]+" Filter-Element successful!\n Now there are only "+FilterArray.length+ " Filter-Elements!");
    }else{
      console.debug("Deleteing Error");
      FilterArray = undefined;
    }
      
  });

  data[4][0] = CreateFilterSelect(data[0]);
  data[4][0].parent(data[1]);
  data[4][0].style("position", "absolute");
  data[4][0].style("left","10px");
  data[4][0].style("top",((data[3] * data[1].height + 5) + "px"));
  data[4][0].style("width","35%");
  data[4][0].style("height","30px");
  data[4][0].changed(function(){
    var FilterName = data[4][0].value();
    if(FilterName == "None"){
      data[0] = -1;
    }else if(FilterName == "Blur"){
      data[0] = 0;
    }else if(FilterName == "Line"){
      data[0] = 1;
    }
    CreateInnerComponents(data);
    
    
  });

  if(data[0] == 0){
      data[4][1] = createSlider(0, 100, 50, 1);
      data[4][1].parent(data[1]);
      data[4][1].style("position", "absolute");
      data[4][1].style("left","10px");
      data[4][1].style("top",((data[3] * data[1].height + 35) + "px"));
  }
}

function AdjustHeight(){
  for(var i = 0; i < FilterArray.length;i++){
    FilterArray[i][3] = i;
    FilterArray[i][2].style("top",((i * FilterArray[0][1].height) + "px"));
    FilterArray[i][4][0].style("top",((i * FilterArray[0][1].height + 5) + "px"));


    if(FilterArray[i][0] == 0){
      FilterArray[i][4][1].style("top",((i * FilterArray[0][1].height + 35) + "px"));
    }
  }
}

function CreateFilterSelect(index){
  var Sel = createSelect();
  if(index == -1){
    Sel.option('None');
  }else if(index == 0){
    Sel.option('Blur');
  }else if(index == 1){
    Sel.option('Line');
  }

  if(index != -1)
    Sel.option('None');
  if(index != 0)
    Sel.option('Blur');
  if(index != 1)
    Sel.option('Line');
  
  return Sel;
}

function Blur(Strength){
  console.debug("Doing the Blur-Filter");
  var BlurKernal = Array(Array(1/16*1,1/16*2,1/16*1),Array(1/16*2,1/16*4,1/16*2),Array(1/16*1,1/16*2,1/16*1));
  
  ComputeKernal(BlurKernal);
}

function Line(){
  console.debug("Doing the Line-Filter");
}

function ComputeKernal(Kernal){
  loadPixels();
  for(var x = 1; x < width-1; x++){
    for(var y = 1; y < height-1; y++){
      var Rsum = 0;
      var Gsum = 0;
      var Bsum = 0;
      var Asum = 0;
      for(var dx = 0; dx < 3; dx++){
        for(var dy = 0; dy < 3; dy++){
          var absX = x + (1-dx);
          var absY = y + (1-dy);
          Rsum += (pixels[absX*4+absY*width*4])*Kernal[dx][dy];
          Gsum += (pixels[absX*4+absY*width*4+1])*Kernal[dx][dy];
          Bsum += (pixels[absX*4+absY*width*4+2])*Kernal[dx][dy];
          Asum += (pixels[absX*4+absY*width*4+3])*Kernal[dx][dy];
        }
      }
      pixels[x*4+y*width*4] = Rsum;
      pixels[x*4+y*width*4+1] = Gsum;
      pixels[x*4+y*width*4+2] = Bsum;
      pixels[x*4+y*width*4+3] = Asum;
    }
  }
  updatePixels();
}