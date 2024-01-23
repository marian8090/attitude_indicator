function pfdInit(app) {

    var pfd = new PIXI.Container(); // PIXI PFD Container

    const skyShape = new PIXI.Graphics();   // PFD SKY
    skyShape.beginFill(0x285EF6);           // color blue
    skyShape.drawRect(0, 0, 800, 800);      // blue sky rectangle as background for whole PFD
    pfd.addChild(skyShape);                 // add sky to PFD container

    // draw Rect + Line for the PFD ground IN SUB-CONTAINER
    var groundShapeContainer = new PIXI.Container();
    var groundShape = new PIXI.Graphics();
    groundShape.beginFill(0x916130);
    groundShape.drawRect(-1000, -1000, 2000, 2000); // grosses quadrat fuer ground
    groundShapeContainer.addChild(groundShape);
    const horizLine = new PIXI.Graphics();
    horizLine.lineStyle(2, 0xFFFFFF, 1); // draw PFD Horizont Line
    horizLine.moveTo(-1000, -1000);
    horizLine.lineTo(2000, -1000);
    for (pitch = -30; pitch <= 30; pitch+=10) {     // Ladder 10grd marker - 100px entspricht zB 10grd pitch   
    horizLine.moveTo(-50, pitch*10-1000); horizLine.lineTo(50, pitch*10-1000);
    }
    for (pitch = -25; pitch <= 25; pitch+=10) {     // Ladder 5grd marker
    horizLine.moveTo(-25, pitch*10-1000); horizLine.lineTo(25, pitch*10-1000);
    }
    for (pitch = -27.5; pitch <= 27.5; pitch+=5) {     // Ladder 2.5grd marker
    horizLine.moveTo(-12.5, pitch*10-1000); horizLine.lineTo(12.5, pitch*10-1000);
    }

    // 10deg ladder numbers
    const ladderTextStyle = new PIXI.TextStyle({
        fill: "#ffffff",
        fontFamily: "\"Courier New\", Courier, monospace",
        fontSize: 24,
    });
    for (pitch = -30; pitch <= 30; pitch+=10) {     // Text 10grd marker
        if (pitch !== 0) {
            const ladderText = new PIXI.Text(-pitch, ladderTextStyle);
            ladderText.x = 60;        ladderText.y = pitch*10-1000-24/2;
            groundShapeContainer.addChild(ladderText);
        }
    }

    groundShapeContainer.addChild(horizLine);
    groundShapeContainer.position.set(400, 400); // positioningung unter boresight (spaeter +- pitch)
    groundShapeContainer.pivot.x = 0; 
    groundShapeContainer.pivot.y = -1000; // Angelpunkt an Oberseite = boresight
    groundShapeContainer.rotation = 0; // spaeter roll (bank angle)
    pfd.addChild(groundShapeContainer);// add groundShapeContainer to PFD container
   
    const groundShapeMask = new PIXI.Graphics(); // Create a rectangular mark for the groundShape
    groundShapeMask.beginFill(0xFFFFFF);
    groundShapeMask.drawRect(0, 0, 800, 800); // Size for the whole PFD
    groundShapeMask.endFill();
    pfd.addChild(groundShapeMask);// add groundShapeMask to PFD container
    groundShapeContainer.mask = groundShapeMask; // apply mask to the groundShapeContainer

    // draw a boresight shape
    const boresightShape = new PIXI.Graphics();
    boresightShape.beginFill(0x000000);
    boresightShape.lineStyle(2, 0xffffff, 1);
    boresightShape.moveTo(400, 400);
    boresightShape.lineTo(400 + 150, 400 + 50);
    boresightShape.lineTo(400 + 100, 400 + 50);
    boresightShape.lineTo(400, 400);
    boresightShape.beginFill(0x000000);
    boresightShape.moveTo(400, 400);
    boresightShape.lineTo(400 - 150, 400 + 50);
    boresightShape.lineTo(400 - 100, 400 + 50);
    boresightShape.lineTo(400, 400);
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
    airspeedText.x = 50; airspeedText.y = 380;
    pfd.addChild(airspeedText);     // add airspeedText to PFD container
    const altitudeText = new PIXI.Text('---', airspeedTextStyle);
    altitudeText.x = 675; altitudeText.y = 380;
    pfd.addChild(altitudeText);     // add altitudeText to PFD container
    
    app.stage.addChild(pfd); // add PFD to stage

    return function (state) {
        airspeedText.text = state.trueAirspeed.toFixed(0);
        altitudeText.text = state.altitude.toFixed(0);
        groundShapeContainer.position.set(400, 400 + state.pitch*5); // positioningung unter boresight +- pitch
        groundShapeContainer.rotation = -state.roll/180*Math.PI;   
    }
}

