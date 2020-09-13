"use strict";

/*
 * Shape.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines data and interface for a graph of nodes
 *  and edges.
 */

class Shape{
    #_xpos;
    #_ypos;

    constructor(x,y){
        if(this.constructor === Hashable && typeof(x) == "number" && typeof(y) == "number"){ //ensure proper type
            this.#_xpos = x;
            this.#_ypos = y;
        }
        else{
            throw new Error("Invalid position coordinates.\n");
        }
    }
}

module.exports = Shape;