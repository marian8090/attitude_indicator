function hsiInit(app) {
    hsiSize = 0.60*app.screen.width; // set HSI size (= height = width)
    hsiPosX = 0.5*app.screen.width; // set HSI midpoint position X
    hsiPosY = 0.7*app.screen.height; // set HSI midpoint position Y


    var hsi = new PIXI.Container(); // PIXI HSI Container

    const miniatureAirplane = new PIXI.Graphics(); // Miniature Aircraft in center
    miniatureAirplane.lineStyle(2, 0xFFFFFF, 1); // Ladder Line style
    miniatureAirplane.moveTo(hsiPosX    , hsiPosY -20);
    miniatureAirplane.lineTo(hsiPosX    , hsiPosY +50);
    miniatureAirplane.moveTo(hsiPosX    , hsiPosY +0);
    miniatureAirplane.lineTo(hsiPosX +40, hsiPosY +10);
    miniatureAirplane.moveTo(hsiPosX    , hsiPosY +0);
    miniatureAirplane.lineTo(hsiPosX -40, hsiPosY +10);
    miniatureAirplane.moveTo(hsiPosX    , hsiPosY +40);
    miniatureAirplane.lineTo(hsiPosX +25, hsiPosY +45);
    miniatureAirplane.moveTo(hsiPosX    , hsiPosY +40);
    miniatureAirplane.lineTo(hsiPosX -25, hsiPosY +45);

    hsi.addChild(miniatureAirplane);


    const compassCard = new PIXI.Graphics(); // movable compass card
    const ri10 = 0.41*hsiSize; // inner radius 10deg refs
    const ri5 = 0.435*hsiSize; // inner radius 5deg refs
    const ro = 0.46*hsiSize; // outer radius 
    compassCard.lineStyle(2, 0xFFFFFF, 1); // Ladder Line style
    for (a = 0; a <= 355; a += 5) {
        if (a % 10 == 0) {
            compassCard.moveTo(hsiPosX + ro*Math.sin(a/180*Math.PI), hsiPosY - ro*Math.cos(a/180*Math.PI));
            compassCard.lineTo(hsiPosX + ri10*Math.sin(a/180*Math.PI), hsiPosY - ri10*Math.cos(a/180*Math.PI));
        } else if (a % 5 == 0) {
            compassCard.moveTo(hsiPosX + ro*Math.sin(a/180*Math.PI), hsiPosY - ro*Math.cos(a/180*Math.PI));
            compassCard.lineTo(hsiPosX + ri5*Math.sin(a/180*Math.PI), hsiPosY - ri5*Math.cos(a/180*Math.PI));
        }
    }
    hsi.addChild(compassCard);
    
    // compass card heading text
    const compassCardTextStyle = new PIXI.TextStyle({ 
        fill: "#ffffff",
        fontFamily: "\"Courier New\", Courier, monospace",
        fontSize: 24,
    });
    for (a = 0; a <= 330; a += 30) {    
        const compassCardText = new PIXI.Text(a/10 , compassCardTextStyle);
        compassCardText.anchor.set(0.5);
        compassCardText.x = hsiPosX + (ri10 - 20) * Math.sin(a/180*Math.PI);
        compassCardText.y = hsiPosY - (ri10 - 20) * Math.cos(a/180*Math.PI);
        compassCardText.rotation = a/180*Math.PI;
        compassCard.addChild(compassCardText);
    }

    
    



    app.stage.addChild(hsi); // add HSI to stage




    return function (state) {
        compassCard.position.x = hsiPosX;
        compassCard.position.y = hsiPosY;
        compassCard.pivot.x = hsiPosX;
        compassCard.pivot.y = hsiPosY;
        compassCard.rotation = -state.heading/180*Math.PI; 
    
    }


}
