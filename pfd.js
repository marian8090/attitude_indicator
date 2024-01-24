function pfdInit(app) {
    pfdWidth = 0.90*app.screen.width; // set PFD width
    pfdHeight = 0.60*app.screen.width; // set PFD height
    pfdPosX = 0.5*app.screen.width; // set PFD midpoint position X
    pfdPosY = 0.4*app.screen.height; // set PFD midpoint position Y
    const pxPerDegPitch = 10; // pixel horizon pitch per degree plane pitch




    var pfd = new PIXI.Container(); // PIXI PFD Container

    const skyShape = new PIXI.Graphics();   // PFD SKY
    skyShape.beginFill(0x285EF6);           // color blue
    skyShape.drawRect(pfdPosX - pfdWidth/2, pfdPosY - pfdHeight/2, pfdWidth, pfdHeight);      // blue sky rectangle as background for whole PFD
    //skyShape.drawRect(0, 0,800, 800);      // blue sky rectangle as background for whole PFD
    pfd.addChild(skyShape);                 // add sky to PFD container

    // Get the screen height and width in logical pixels
    // console.log(app.screen.width);
    // console.log(app.screen.height);
    // console.log(app.renderer.width);
    // console.log(app.renderer.height);
    // console.log(window.innerWidth);
    // console.log(window.innerHeight);
    // console.log(window.devicePixelRatio);


    // draw Rect + Line for the PFD ground IN SUB-CONTAINER
    var groundShapeContainer = new PIXI.Container();
    var groundShape = new PIXI.Graphics();
    groundShape.beginFill(0x916130); // brown
    groundShape.drawRect(-1000, -1000, 2000, 2000); // big brown box for ground
    //groundShape.beginFill(0xff0000);  // red marker for dev
    //groundShape.drawRect(-10, -1000, 20, 2000); // red marker for dev
    groundShapeContainer.addChild(groundShape);



    // draw Ladder
    var ladderContainer = new PIXI.Container();
    const ladder = new PIXI.Graphics();     
    ladder.lineStyle(2, 0xFFFFFF, 1); // Ladder Line style
    for (pitch = -90; pitch <= 90; pitch+=10) {     // Ladder 10grd marker - 100px entspricht zB 10grd pitch   
    ladder.moveTo(-50, pitch*10); ladder.lineTo(50, pitch*10);
    }
    for (pitch = -25; pitch <= 25; pitch+=10) {     // Ladder 5grd marker
    ladder.moveTo(-25, pitch*10); ladder.lineTo(25, pitch*10);
    }
    for (pitch = -27.5; pitch <= 27.5; pitch+=5) {     // Ladder 2.5grd marker
    ladder.moveTo(-12.5, pitch*10); ladder.lineTo(12.5, pitch*10);
    }
    ladderContainer.addChild(ladder);

    const ladderTextStyle = new PIXI.TextStyle({ // 10deg ladder numbers
        fill: "#ffffff",
        fontFamily: "\"Courier New\", Courier, monospace",
        fontSize: 24,
    });
    for (pitch = -90; pitch <= 90; pitch+=10) {     // Text 10grd marker
        if (pitch !== 0) { // skip 0 deg text
            const ladderText = new PIXI.Text(-pitch, ladderTextStyle);
            ladderText.x = 60;        ladderText.y = pitch*10-24/2;
            ladderContainer.addChild(ladderText);
        }
    }
    const ladderMask = new PIXI.Graphics(); // Ladder mask
    ladderMask.lineStyle(1, 0xFFFFFF, 1);
    ladderMask.beginFill(0xFFFFFF, 1);
    ladderMask.drawCircle(pfdPosX, pfdPosY, 200); // mask circle - specify radius\
    //ladderMask.drawRect(pfdPosX-100, pfdPosY-200, 200, 400); // mask circle - specify radius
    ladderMask.endFill();
    ladderContainer.mask = ladderMask; // apply mask
   
    // Horizon Line
    const horizLine = new PIXI.Graphics(); // draw PFD Horizont Line
    horizLine.lineStyle(2, 0xFFFFFF, 1); 
    horizLine.moveTo(-1000, -1000);
    horizLine.lineTo(2000, -1000);
    groundShapeContainer.addChild(horizLine);
    groundShapeContainer.position.set(pfdPosX, pfdPosY); // positioningung unter boresight (spaeter +- pitch)
    groundShapeContainer.pivot.x = 0; 
    groundShapeContainer.pivot.y = -1000; // Angelpunkt an Oberseite = boresight
    groundShapeContainer.rotation = 0; // spaeter roll (bank angle)
    pfd.addChild(groundShapeContainer);// add groundShapeContainer to PFD container
   
    const groundShapeMask = new PIXI.Graphics(); // Create a rectangular mark for the groundShape
    groundShapeMask.beginFill(0xFFFFFF);
    groundShapeMask.drawRect(pfdPosX - pfdWidth/2, pfdPosY - pfdHeight/2, pfdWidth, pfdHeight); // Size for the whole PFD
    groundShapeMask.endFill();
    

    // rollRefs 
    const rollRefsContainer = new PIXI.Container();
    const rollRefs = new PIXI.Graphics();
    rollRefs.lineStyle(2, 0xFFFFFF, 1);
    for (let a = 0; a <= 180; a += 30) { // 30deg refs
        if (a != 90) {
            rollRefs.moveTo(pfdPosX - 240 * Math.cos(a/180*Math.PI) , pfdPosY - 240 * Math.sin(a/180*Math.PI));
            rollRefs.lineTo(pfdPosX - 270 * Math.cos(a/180*Math.PI) , pfdPosY - 270 * Math.sin(a/180*Math.PI));
        }
    }
    for (let a = 70; a <= 110; a += 10) { // 10deg refs
        if (a != 90) {
            rollRefs.moveTo(pfdPosX - 240 * Math.cos(a/180*Math.PI) , pfdPosY - 240 * Math.sin(a/180*Math.PI));
            rollRefs.lineTo(pfdPosX - 255 * Math.cos(a/180*Math.PI) , pfdPosY - 255 * Math.sin(a/180*Math.PI));
        }
    }

    rollRefs.moveTo(pfdPosX     , pfdPosY-240    ); // center ref
    rollRefs.lineTo(pfdPosX+10  , pfdPosY-240-18 );
    rollRefs.lineTo(pfdPosX-10  , pfdPosY-240-18 );
    rollRefs.lineTo(pfdPosX     , pfdPosY-240    );
   
    pfd.addChild(rollRefs);


    // Roll Pointer
    const rollPointerContainer = new PIXI.Container();
    const rollPointer = new PIXI.Graphics();
    rollPointer.lineStyle(2, 0xFFFFFF, 1);
    rollPointer.beginFill(0xFFFFFF);
    rollPointer.moveTo(pfdPosX, pfdPosY-240);
    rollPointer.lineTo(pfdPosX+15, pfdPosY-240+25);
    rollPointer.lineTo(pfdPosX-15, pfdPosY-240+25);
    rollPointer.lineTo(pfdPosX, pfdPosY-240);
    rollPointer.closePath();
    rollPointer.endFill();
    rollPointerContainer.addChild(rollPointer);
    pfd.addChild(rollPointerContainer);


    pfd.addChild(groundShapeMask);// add groundShapeMask to PFD container
    pfd.addChild(ladderContainer);// add ladder container to PFD container
    
    pfd.mask = groundShapeMask; // apply mask to the PFD
    

    
    // draw a boresight shape
    const boresightShape = new PIXI.Graphics();
    boresightShape.beginFill(0x000000);
    boresightShape.lineStyle(2, 0xffffff, 1);
    boresightShape.moveTo(pfdPosX, pfdPosY);
    boresightShape.lineTo(pfdPosX + 150, pfdPosY + 50);
    boresightShape.lineTo(pfdPosX + 100, pfdPosY + 50);
    boresightShape.lineTo(pfdPosX, pfdPosY);
    boresightShape.beginFill(0x000000);
    boresightShape.moveTo(pfdPosX, pfdPosY);
    boresightShape.lineTo(pfdPosX - 150, pfdPosY + 50);
    boresightShape.lineTo(pfdPosX - 100, pfdPosY + 50);
    boresightShape.lineTo(pfdPosX, pfdPosY);
    boresightShape.closePath();
    boresightShape.endFill();
    boresightShape.beginFill(0x000000);
    boresightShape.moveTo(pfdPosX + 200, pfdPosY - 3);
    boresightShape.lineTo(pfdPosX + 200, pfdPosY + 3);
    boresightShape.lineTo(pfdPosX + 170, pfdPosY + 3);
    boresightShape.lineTo(pfdPosX + 170, pfdPosY - 3);
    boresightShape.closePath();
    boresightShape.moveTo(pfdPosX - 200, pfdPosY - 3);
    boresightShape.lineTo(pfdPosX - 200, pfdPosY + 3);
    boresightShape.lineTo(pfdPosX - 170, pfdPosY + 3);
    boresightShape.lineTo(pfdPosX - 170, pfdPosY - 3);
    boresightShape.closePath();
    boresightShape.endFill();
    pfd.addChild(boresightShape);// add boresightShape to PFD container


    // PFD text for indicatedAirspeed und altitude
    const airspeedTextStyle = new PIXI.TextStyle({
        fill: "#00ff00",
        fontFamily: "\"Courier New\", Courier, monospace",
        fontSize: 36,
        fontWeight: "bold"
    });
    const airspeedText = new PIXI.Text('---', airspeedTextStyle);
    airspeedText.x = pfdPosX - pfdWidth/2 + 50; airspeedText.y = pfdPosY - 20;
    pfd.addChild(airspeedText);     // add airspeedText to PFD container
    const altitudeText = new PIXI.Text('---', airspeedTextStyle);
    altitudeText.x = pfdPosX + pfdWidth/2 - 150; altitudeText.y = pfdPosY - 20;
    pfd.addChild(altitudeText);     // add altitudeText to PFD container
    
    
    // yoke pitch and roll text
    const yokeTextStyle = new PIXI.TextStyle({
        fill: "#00ff00",
        fontFamily: "\"Courier New\", Courier, monospace",
        fontSize: 36,
        fontWeight: "bold"
    });
    const yokePitchText = new PIXI.Text('-.-', yokeTextStyle);
    yokePitchText.x = pfdPosX - pfdWidth/2 + 50; yokePitchText.y = pfdPosY + pfdHeight/2 - 50;
    pfd.addChild(yokePitchText);
    const yokeRollText = new PIXI.Text('-.-', yokeTextStyle);
    yokeRollText.x = pfdPosX - pfdWidth/2 + 250; yokeRollText.y = pfdPosY + pfdHeight/2 - 50;
    pfd.addChild(yokeRollText);


    
    
    app.stage.addChild(pfd); // add PFD to stage

    
    




    return function (state) {
        airspeedText.text = state.trueAirspeed.toFixed(0);
        altitudeText.text = state.altitude.toFixed(0);

        // Horizon pitch and roll
        groundShapeContainer.position.x = pfdPosX; 
        groundShapeContainer.position.y = pfdPosY;
        groundShapeContainer.pivot.x = 0;
        groundShapeContainer.pivot.y = -1000 - state.pitch*pxPerDegPitch;
        groundShapeContainer.rotation = -state.roll/180*Math.PI;   

        // Ladder pitch and roll
        ladderContainer.position.x = pfdPosX;
        ladderContainer.position.y = pfdPosY;
        ladderContainer.pivot.x = 0;
        ladderContainer.pivot.y = -state.pitch*pxPerDegPitch;
        ladderContainer.rotation = -state.roll/180*Math.PI;  

        // rollPointer roll
        rollPointerContainer.position.x = pfdPosX;
        rollPointerContainer.position.y = pfdPosY;
        rollPointerContainer.pivot.x = pfdPosX;
        rollPointerContainer.pivot.y = pfdPosY;
        rollPointerContainer.rotation = -state.roll/180*Math.PI;  

        // // update Text output for Yoke Pitch and Roll
        yokePitchText.text = "P:" + yoke.pitch.toFixed(1);    
        yokeRollText.text = "R:" + yoke.roll.toFixed(1);

        
    }
}

