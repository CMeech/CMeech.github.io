"use strict";

let Hashable = require('./Hashable');
let LinkedList = require('./LinkedList');
let HashableListItem = require('./HashableListItem');

/*
 * HashTable
 *
 * Implements the data and interface for a hash table.
 * Uses seperate chaining for collisions.
 */
class HashTable{
    #_list;

    /*
     * constructor
     *
     * Initializes the list with empty Linked Lists.
     * 
     * @param {number} lengthGiven - the number of empty linked lists
     * to create.
     */
    constructor(lengthGiven){
        if(typeof(lengthGiven) == "number"){ //ensure proper type
            this.#_list = []; //empty array

            for(let i = 0; i < lengthGiven; i++){
                this.#_list[i] = new LinkedList(); //empty lists
            }
        }
        else{
            throw new Error("Parameter for HashTable must be a valid length!\n");
        }
    }

    /*
     * add()
     *
     * Adds a hashable object to the table.
     * 
     * @param {Hashable} x - the item to be added
     * 
     */
    add(x){
        if(x instanceof Hashable){
            let newListItem = new HashableListItem(x);
            this.#_list[x.hashVal() % this.#_list.length].add(newListItem);
        }
    }

    /*
     * get(x)
     *
     * Given a Hashable object, finds the first item equal to it in
     * the hash table and returns that item.
     * 
     * @param {Hashable} x - The key for the search
     * 
     * @return - an object associated the same key as x.
     */
    get(x){
        let out = null

        if(!(x instanceof Hashable)){ //might as well throw an error since it won't be found
            throw new Error("HashTable contains no elements equal to parameter specified.\n");
        }

        out = this.#_list[x.hashVal() % this.#_list.length].get(x); //pass the paramter to LL


        if(out == null){
            throw new Error("HashTable contains no elements equal to parameter specified.\n");
        }

        return out;
    }

    /*
     * remove()
     *
     * Removes a specified item from the hash table.
     * 
     * @param {Hashable} x - the item to be removed.
     * 
     * @return - a boolean indicating whether the item was removed.
     */
    remove(x){
        let successful = false;

        if(x instanceof Hashable){ //only do it if hashable
            successful = this.#_list[x.hashVal() % this.#_list.length].remove(x); //pass the paramter to LL

        }

        return successful;
    }

    /*
     * contains()
     *
     * Checks is the item specified is already in the hash table.
     * 
     * @param {Hashable} x - the item used for the search
     * 
     * @return - A boolean indicating if the item was found.
     */
    contains(x){
        let found = false;

        if(x instanceof Hashable){ //only do it if hashable
            found = this.#_list[x.hashVal() % this.#_list.length].contains(x); //pass the paramter to LL

        }

        return found;
    }

    /*
     * isEmpty()
     *
     * Checks if the hash table is empty.
     * 
     * @return - A boolean indicating if the table is empty.
     */
    isEmpty(){
        let empty = true;

        for(let i = 0; i < this.#_list.length && empty == true; i++){ //only run while element not found
            if(!this.#_list[i].isEmpty()){ //check if the linked list is empty.
                empty = false;
            }

        }

        return empty;
    }
}//HashTable

module.exports = HashTable;