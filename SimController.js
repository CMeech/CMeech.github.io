"use strict";

//require(['./SimUserInterface']);

/*
 * SimController.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Controls the interaction between objects for
 *  the program.
 */

 class SimController{
    #_interface;

    constructor(){
        this.#_interface = new SimUserInterface();
    }
    
     drawSim(){
        this.#_interface.drawBackground();
    }
 }

