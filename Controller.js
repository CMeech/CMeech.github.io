"use strict";

let UserInterface = require(['./UserInterface']);

/*
 * Controller.js
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
        this.#_interface = new UserInterface();
    }
    
     drawSim(){
        this.#_interface.drawBackground();
    }
 }

module.exports = Controller;