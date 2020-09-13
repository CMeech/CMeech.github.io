"use strict";

/*
 * SimUserInterface.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines the GUI.
 */

class SimUserInterface{

    #_backgroundTexture; //for the infinite background
    #_backgroundX;
    #_backgroundY;

    constructor(){
        this.#_backgroundTexture = loadImage('images/backgroundtext.png');
        this.#_backgroundX = 0; //centered
        this.#_backgroundY = 0;
    }

    drawBackground(){
        background(0); //not really necessary

        textureWrap(REPEAT);
        texture(this.#_backgroundTexture);

        beginShape();
        vertex(-2,-2); //bottom left, CCW
        vertex(2,-2);
        vertex(2,2);
        vertex(-2,2);

        endShape(CLOSE);
    }

}

module.exports = SimUserInterface;