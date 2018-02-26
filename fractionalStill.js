// Global Variables
var heatingElement = 0;
var solenoidRelay = 1;
var actuatorOut = 3;
var actuatorIn = 4;
var heartsCut = 6;
var tailsCut = 16;
var arrayOfBeakers = [];

// Helper functions
function setOutputToBoolean(outputPosition, booleanValue){}
function readTemperature(){
    var temperatureInCelsius = 25;
    return temperatureInCelsius;
}
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }
function moveActuatorToPosition(positionNumber){
    switch (positionNumber){
        case 0:
            setOutputToBoolean(actuatorIn,true);
            wait(15*1000);
            setOutputToBoolean(actuatorIn,false);
        case 1:
            setOutputToBoolean(actuatorOut,true);
            wait(9*1000);
            setOutputToBoolean(actuatorOut,false);
        case 2:
            setOutputToBoolean(actuatorOut,true);
            wait(11*1000);
            setOutputToBoolean(actuatorOut,false);
    }
}
function runSolenoid(beaker){
    for (var i=0;i<beaker.cycleCount;i++){
        setOutputToBoolean(solenoidRelay,true);
        wait(beaker.openTime);
        setOutputToBoolean(solenoidRelay,false);
        wait(beaker.closeTime);
    }
}
function convertAlcoholInputToDecimal(alcholPercentEntered){
    if (alcholPercentEntered >= 1){
        alcholPercentEntered = alcholPercentEntered / 100;
    }
    return alcholPercentEntered;
}
function constructBeaker(cycleCount, closeTime, targetVolume){
    var beaker = {
        "cycleCount": Math.floor(targetVolume / 3.32),
        "closeTime": closeTime,
        "openTime": 500,
        "targetVolume": targetVolume
    }
    return beaker;
}

// Main part of program
function makeArrayOfBeakers(arrayOfPercentAndVolume){
    percentAlcoholInPotAsDecimal = arrayOfPercentAndVolume[0];
    volumeInPotInLiters = arrayOfPercentAndVolume[1];
    var volumeEthanol = volumeInPotInLiters * percentAlcoholInPotAsDecimal;
    var volumeMethanol = volumeEthanol * 0.03;
    var volumeHeads =volumeEthanol * 0.05;
    var volumeTails = volumeEthanol * 0.05;
    var volumeHearts = volumeEthanol - (volumeMethanol + volumeHeads + volumeTails);
    var correctionFactor = 1.75
    
    // Add volume and cycle count to beaker array
    // methanol fraction
    arrayOfBeakers[0] = constructBeaker(0,0,volumeMethanol);
    // heads fraction
    for (var i=1; i<4; i++){
        arrayOfBeakers[i] = constructBeaker(0,0,volumeHeads / 3);
    }
    // hearts fraction
    for (var i = 4; i<18; i++){
        arrayOfBeakers[i] = constructBeaker(0,0,correctionFactor * volumeHearts / 14);
    }
    // tails fraction
    for (var i = 4; i<18; i++){
        arrayOfBeakers[i] = constructBeaker(0,0,correctionFactor * volumeTails / 3);
    }

    // Add close times to beaker array
    for (var i = 0;i<21;i++){
        if (i<=4){
            arrayOfBeakers[i].closeTime = 3000;
        } else if (i<=10){
            arrayOfBeakers[i].closeTime = 4000;
        } else if (i<=15) {
            arrayOfBeakers[i].closeTime = 6000;
        } else {
            arrayOfBeakers[i].closeTime = 8000;
        }
    }
}
function getUserInput(){
    var percentAlcoholInPotAsDecimal = input("What percent alcohol is in the pot?");
    var volumeInPotInLiters = input("What volume is in the pot?");
    return [convertAlcoholInputToDecimal(percentAlcoholInPotAsDecimal), volumeInPotInLiters];   
}

function endTheRun(){
    setOutputToBoolean(heatingElement,false);
    wait(120 * 1000);
    setOutputToBoolean(solenoidRelay,true);
    wait(180*1000);
    setOutputToBoolean(solenoidRelay,false);
    console.log("run ended at " + Date.now());
}
function preheatTheStill(){
    setOutputToBoolean(heatingElement,true);
    while (readTemperature < 45){
        wait(60*1000);
    }
    wait(10*60*1000); // wait 10 minutes
}
function runTheStill(){
    moveActuatorToPosition(0);
    preheatTheStill();
    for (var i = 0; i<arrayOfBeakers.length;i++){
        if (i == heartsCut){
            moveActuatorToPosition(1);
        } else if (i == tailsCut) {
            moveActuatorToPosition(2);
        }
        runSolenoid(arrayOfBeakers[i]);
    }
}
function mainProgram(){
    makeArrayOfBeakers(getUserInput());
    preheatTheStill();
    runTheStill();
    endTheRun();
}