"use strict";

/*
 * ShapeItem.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  An Shape that can be stored in a linked list.
 */

 class ShapeItem extends ListItem{
    constructor(newData, newLink){
        if(newData instanceof Shape){
            super(newData,newLink);
        }
        else{
            throw new Error("Given item is not a shape.\n");
        }
    }
 }