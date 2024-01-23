function yokeInput(app) {
    const yoke = {
        pitch: 0,
        roll: 0,
        userInputActive: false
    };
    
  //  console.log('Aufruf yokeInput');
    touchControl(app, function(touchPos){
        yoke.roll = touchPos.x;
        yoke.pitch = touchPos.y;     
        yoke.userInputActive = true;
    });
    return yoke
}


//  TOUCH CONTROL (for desktop and phone) 
function touchControl(app, callback) { 
    var touchPos = {
        x: 0,
        y: 0
    };
//    console.log('Aufruf touchControl');
    var touchStart = { x: 0, y: 0 };

    app.view.addEventListener("touchstart", (touchstartEvent) => {
        touchstartEvent.preventDefault();
        const touches = touchstartEvent.touches;
        for (let i = 0; i < touches.length; i++) {
            touchStart = { x: touches[i].pageX, y: touches[i].pageY }
        }
    });

    app.view.addEventListener("touchmove", (touchmoveEvent) => {
        touchmoveEvent.preventDefault();
        const touches = touchmoveEvent.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            touchPos.x += (touches[i].pageX - touchStart.x) / 10;
            touchPos.y += (touches[i].pageY - touchStart.y) / 10;
            callback(touchPos) // return TOUCHPOS
            touchStart = { x: touches[i].pageX, y: touches[i].pageY }
        }
   
    });
    app.view.addEventListener("touchend", (touchendEvent) => {
        touchendEvent.preventDefault();
    });
}



