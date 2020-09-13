/*
 * ListIterator.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Iterator for a linked list.
 */

 class ListIterator{
     head; //maybe if we need to reset and loop twice.
     curr;

     constructor(headNode){
        this.head = headNode;
        this.curr = headNode; //goes to first item
     }

     next(){
        this.curr = this.curr.getNext();
     }

     curr(){
         return this.curr.getData();
     }

     isEmpty(){
         return this.curr == null;
     }


 }