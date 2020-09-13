"use strict";

/*
 * ListItem.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  An item that can be stored in a linked list.
 */

 class ListItem{
     data;
     link;

    constructor(newData, newLink){
        if(constructor === ListItem){
            throw new Error("ListItem is abstract.\n");
        }
        else{
            this.data = newData;
            this.link = newLink;
        }
    }

    getData(){
        return this.data;
    }

    getNext(){
        return this.link;
    }

    setNext(newLink){
        this.link = newLink;
    }
 }