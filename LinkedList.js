"use strict";

/*
 * LinkedList.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  An item that can be stored in a linked list.
 *  Can add items to both sides.
 */

class LinkedList{
    head;

    constructor(){
        this.head = null;
    }

    addFront(item){
        if(item instanceof ListItem){
            item.setNext(head);
            this.head = item;
        }
    }

    addEnd(item){
        let curr = this.head;
        if(!(item instanceof ListItem)){
            throw new Error("Not a List Item.\n");
        }

        if(curr == null){ //empty
            item.setNext(head);
            this.head = item;
        }
        else{
            while(curr.getNext() != null){ //there is still a next item
                curr = curr.getNext();
            }

            //now add to end
            curr.setNext(item);
        }
    }

    iterator(){
        return new ListIterator(this.head);
    }

}