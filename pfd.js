function pfdInit(app) {
    // console.log("PFD INIT CALLED!");
    // var pfdContainer = new PIXI.Container(); // PIXI PFD Container
    

    const skyShape = new PIXI.Graphics();
    skyShape.beginFill(0x285EF6);
    skyShape.drawRect(0, 0, 800, 800);
    app.stage.addChild(skyShape);

    // PFD text for indicatedAirspeed und altitude
    const airspeedTextStyle = new PIXI.TextStyle({
        fill: "#00ff00",
        fontFamily: "\"Courier New\", Courier, monospace",
        fontSize: 36,
        fontWeight: "bold"
    });
    const airspeedText = new PIXI.Text('IAS', airspeedTextStyle);
    airspeedText.x = 50; airspeedText.y = 380;
    app.stage.addChild(airspeedText);
    const altitudeText = new PIXI.Text('ALT', airspeedTextStyle);
    altitudeText.x = 675; altitudeText.y = 380;
    app.stage.addChild(altitudeText);

    return function (state) {
        airspeedText.text = state.trueAirspeed.toFixed(0);
        altitudeText.text = state.altitude.toFixed(0);
    }
}

