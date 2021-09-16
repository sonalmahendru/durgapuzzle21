var objectholder1 = document.getElementById("object-holder1");
var leftOffsetX = objectholder1.getBoundingClientRect().left;
var leftOffsetY = objectholder1.getBoundingClientRect().top;
console.log("Objectholder1 position: "+leftOffsetX+", "+leftOffsetY+"\n");

var objectholder2 = document.getElementById("object-holder2");
var rightOffsetX = objectholder2.getBoundingClientRect().left;
var rightOffsetY = objectholder2.getBoundingClientRect().top;


var objects = document.querySelectorAll('.object');
objects.forEach(function(element, index){
  element.setAttribute('objectIndex', index);
});

var objects2 = document.querySelectorAll('.object2');
objects2.forEach(function(element, index){
  element.setAttribute('objectIndex', index+4);
});


var slots = document.querySelectorAll('.slot');
slots.forEach(function(element, index){
  element.setAttribute('slotIndex', index);
});
var slotsBackground = [
  'img/weapon1.png',
  'img/weapon2.png',
  'img/weapon3.png',
  'img/weapon4.png',
  'img/weapon5.png',
  'img/weapon6.png',
  'img/weapon7.png',
  'img/weapon8.png'
];

var scene = document.querySelector('#scene');
scene.style.height = window.innerHeight+'px';
window.onresize = function(){
  scene.style.height = window.innerHeight+'px';
}
var pairs = [
  [0,0],
  [1,1],
  [2,2],
  [3,3],
  [4,4],
  [5,5],
  [6,6],
  [7,7]
];

var initX = null;
var initY = null;
var newX = null;
var newY = null;
var targetObjectIndex = null;
var targetSlotIndex = null;
var objectRow = 0; //0 for left row and 1 for right row
var holdX = 0;
var holdY = 0;
var score = 1;
var initOffsetX = null;
var initOffsetY = null;

var playButton = document.querySelector('.play-button');
playButton.addEventListener('click', function(){
  //document.getElementById("bg_music").play();
  document.querySelector('.play-backdrop').classList.add('d-none');
});

window.addEventListener('touchstart', function(event){
    if(event.target.hasAttribute('objectIndex')){
      targetObjectIndex = event.target.getAttribute('objectIndex');
      var objectRect;
      if(event.target.hasAttribute('right')){
        console.log('inside right attribute');
        objectRect  = objects2[targetObjectIndex-4].getBoundingClientRect();
        objectRow = 1;
        initX = objectRect.left+'px';
        initY = objectRect.top+'px';
        initOffsetX = objectRect.left - rightOffsetX+'px';
        initOffsetY = objectRect.top - rightOffsetY+'px';
      } else {
        objectRect = objects[targetObjectIndex].getBoundingClientRect();
        objectRow = 0;
        initX = objectRect.left+'px';
        initY = objectRect.top+'px';
        initOffsetX = objectRect.left - leftOffsetX+'px';
        initOffsetY = objectRect.top - leftOffsetY+'px';
      }
      holdX = event.touches[0].clientX;
      holdY = event.touches[0].clientY;
      console.log("initial position: "+initX+", "+initY+" and hold position is: "+holdX+", "+holdY+" and main offset position: "+initOffsetX+", "+initOffsetY);
    }
});

window.addEventListener('mousedown', function(event){
  if(event.target.hasAttribute('objectIndex')){
    targetObjectIndex = event.target.getAttribute('objectIndex');
    var objectRect;
    if(event.target.hasAttribute('right')){
      console.log('inside right attribute');
      objectRect  = objects2[targetObjectIndex-4].getBoundingClientRect();
      objectRow = 1;
    } else {
      objectRect = objects[targetObjectIndex].getBoundingClientRect();
      objectRow  = 0;
    } 
    initX = objectRect.left+'px';
    initY = objectRect.top+'px';
    initOffsetX = objectRect.left - offsetX+'px';
    initOffsetY = objectRect.top - offsetY+'px';
    holdX = event.clientX - event.target.getBoundingClientRect().left;
    holdY = event.clientY - event.target.getBoundingClientRect().top;
  }
});




window.addEventListener('touchmove', function(event){
  if(targetObjectIndex != null){
    var touch = event.touches[0] || event.changedTouches[0];
    newX =  event.touches[0].clientX;
    newY =  event.touches[0].clientY;
    /*newX = touch.pageX - holdX;
    
    newY = touch.pageY - holdY;*/
    moveObject(targetObjectIndex, objectRow);
  }
});
window.addEventListener('mousemove', function(event){
  if(targetObjectIndex != null){
    newX = event.pageX - holdX;
    newY = event.pageY - holdY;
    moveObject(targetObjectIndex, objectRow);
  }
});




window.addEventListener('touchend', function(){
  if(targetObjectIndex != null){
    if(isOverlapped(targetObjectIndex, targetSlotIndex,objectRow)){
      placeObject(targetObjectIndex, targetSlotIndex,objectRow);
      slots[targetSlotIndex].classList.remove('hover'); 
    }else{
      if(objectRow == 0){
        objects[targetObjectIndex].style.left = 0;
        objects[targetObjectIndex].style.top = initOffsetY;
      } else {
        objects2[targetObjectIndex-4].style.left = 0;
        objects2[targetObjectIndex-4].style.top = initOffsetY;
      }
      
    }
    targetObjectIndex = null;
    targetSlotIndex = null;
    newX = null;
    newY = null;
    initX = null;
    initY = null;
  }
});
window.addEventListener('mouseup', function(){
  if(targetObjectIndex != null){
    if(isOverlapped(targetObjectIndex, targetSlotIndex,objectRow)){
      placeObject(targetObjectIndex, targetSlotIndex,objectRow);
      slots[targetSlotIndex].classList.remove('hover'); 
    }else{
      if(objectRow == 0){
        objects[targetObjectIndex].style.left = 0;
        objects[targetObjectIndex].style.top = initY;
      } else {
        objects2[targetObjectIndex-4].style.left = 0;
        objects2[targetObjectIndex-4].style.top = initY;
      }
    }
    targetObjectIndex = null;
    targetSlotIndex = null;
    newX = null;
    newY = null;
    initX = null;
    initY = null;
  }
});


function moveObject(targetObjectIndex, objectRow) {
  if (newX != null || newY != null) {
    if(objectRow == 0){
      objects[targetObjectIndex].style.left = newX-leftOffsetX + 'px';
      objects[targetObjectIndex].style.top = newY-leftOffsetY + 'px';
    } else if(objectRow == 1) {
      objects2[targetObjectIndex-4].style.left = newX-rightOffsetX + 'px';
      objects2[targetObjectIndex-4].style.top = newY-rightOffsetY + 'px';
    }    
    targetSlotIndex = pairs[targetObjectIndex][1];
    if(isOverlapped(targetObjectIndex, targetSlotIndex, objectRow)){
     // document.getElementById("click_music").play();
      slots[targetSlotIndex].classList.add('hover');
    }else{
      slots[targetSlotIndex].classList.remove('hover'); 
    }
  }
}

function placeObject(targetObjectIndex, targetSlotIndex, objectRow){
  slots[targetSlotIndex].style.backgroundImage = "url('"+slotsBackground[targetSlotIndex]+"')";
  if(objectRow == 0){
    objects[targetObjectIndex].style.display = 'none';
  } else {
    objects2[targetObjectIndex-4].style.display = 'none';
  }
  
  score++;
  if(score == 9){
    document.querySelector('.modal-backdrop').classList.remove('d-none');
  }
}

function isOverlapped(targetObjectIndex, targetSlotIndex, objectRow){
  var objectRect;
  if(objectRow == 0){
    objectRect = objects[targetObjectIndex].getBoundingClientRect();
  } else {
    objectRect = objects2[targetObjectIndex-4].getBoundingClientRect();
  }  
  var slotRect = slots[targetSlotIndex].getBoundingClientRect();
  return !(objectRect.right < slotRect.left || objectRect.left > slotRect.right || objectRect.bottom < slotRect.top || objectRect.top > slotRect.bottom);
}
