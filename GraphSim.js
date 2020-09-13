/*
 * GraphSim.js
 *
 * Purpose: A program that creates allows drawing of nodes and lines
 * and can run a graph burning approximation algorithm.
 * 
 * See documentation in the notes.txt file.
 * 
 * Unit Coords are [-1,1]
 * /
 */

"use strict";

//textures
let backgroundText; //these should be in CAPS_SPACE
let vertexTexture;
let vertexTextureSel;
let burnedTexture;
let burnedTextureSel;
let addText;
let delText;
let edgeText;
let algText;
let nextText;
let backText;
let fiftyText;
let twentyText;
let fiveText;
let oneText;

let LEFT_EDGE = -1; //canvas stuff
let RIGHT_EDGE  = 1;
let BOTTOM_EDGE = -1;
let TOP_EDGE = 1;
let CENTER = 0;

let BIG_WIDTH = 0.5; //for buttons size
let BIG_HEIGHT = 0.2;

let FIF_WID = 0.25;
let FACTOR = 0.05; //for making smaller buttons

let BACKGROUND_FACTOR = 2.0;

let BACKGROUND_UV = 4.0;


//quantity constants
let FIFTY = 50;
let TWENTY = 20;
let FIVE = 5;
let ONE = 1;

let VERTEX_WEIGHT = 4;
let EDGE_WEIGHT = 8;

let VERT_RAD = 0.3;


//colors!
let BLUE_1;
let BLUE_2;
let BLUE_3;
let BLUE_4;
let BLUE_5; //for hover/selection

let ORAN_1;
let ORAN_2;

let PURP_1;
let PURP_2;
let PURP_3;
let PURP_4;

let YELLOW;

let VERT_RED;
let VERT_YELLOW;
let VERT_GREEN;

//ENUMS FOR OPERATIONS
const OPERATIONS = {
    ADD: 'add',
    DEL: 'del',
    EDGE: 'edge',
    ALG: 'alg',
    ONE: 'one',
    FIVE: 'five',
    TWENTY: 'twenty',
    FIFTY: 'fifty',
    NEXT: 'next',
    BACK: 'back',
    NONE: 'none'
}

// NOTE WITH JAVA'SCRIPT' ORDER MATTERS.
// THATS WHY SOME CLASSES MUST BE MADE FIRST, BECAUSE
// THE SCRIPT IS READ TOP DOWN, SO IF IT IS AT THE BOTTOM
// IT IS NOT DEFINED.


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
    length; //this will help later

    constructor(){
        this.head = null;
        this.length = 0;
    }

    addFront(item){
        if(item instanceof ListItem){
            item.setNext(this.head);
            this.head = item;
            this.length++;
        }
    }

    addEnd(item){
        let curr = this.head;
        if(!(item instanceof ListItem)){ //check valid item
            throw new Error("Not a List Item.\n");
        }
        if(curr == null){ //empty
            item.setNext(this.head);
            this.head = item;
            this.length++;
        }
        else{
            while(curr.getNext() != null){ //there is still a next item
                curr = curr.getNext();
            }

            //now add to end
            curr.setNext(item);
            this.length++;
        }
    }

    //allows it to be used as a queue
    pop(){
        let out = null;
        if(this.head != null){
            out = this.head.getData();
            this.head = this.head.getNext();
            this.length--;
        }
        return out;
    }

    /*
     * delete()
     *
     * PURPOSE: Deletes the first instance of a given item from the list.
     * equals() must be implemented for the item given.
     * 
     * @return - A boolean indicating if the item was removed.
     */
    delete(item){
        if(!('equals' in item)){ //check if equals() exists
            throw new Error('Item given has no equals() implementation.\n');
        }

        let curr = this.head;
        let prev = null;
        let found = false;

        //just do a linear search
        while(curr != null && !found){
            if(curr.getData().equals(item)){ //found it
                if(prev != null){ //not the first item
                    prev.setNext(curr.getNext());
                    this.length--;
                }
                else{ //first item
                    this.head = this.head.getNext();
                    this.length--;
                }

                found = true;
            }
            prev = curr;
            curr = curr.getNext();
        }

        return found;


    }

    iterator(){
        return new ListIterator(this.head);
    }

    //returns a reversed linked list.
    reverse(){
        let original = this.iterator();
        let curr = this.head;
        let out = new LinkedList(); //empty

        while(curr != null){ //non empty
            out.addFront(new ListItem(curr.getData()));
            curr = curr.getNext();
        }

        return out;
    }

    isEmpty(){
        return this.head == null;
    }

    getLength(){
        return this.length;
    }
}

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

     currItem(){
        return this.curr.getData();
     }

     isEmpty(){
         return this.curr == null;
     }


 }

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


/*
 * Shape.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines data and interface for a graph of nodes
 *  and edges.
 * 
 *  Most shapes are clickable, so there are many methods
 *  defined in case a shape will be interacted with.
 */

class Shape{
    xpos; //uses unit coord system, not pixels!
    ypos;
    hover;
    selected; // boolean for drawing color of selected shape

    //Constructor
    //@param x - x position in unit coords
    //@param y - y position in unit coords
    constructor(x,y){
        if(this.constructor === Shape){
            throw new Error("Shape is an abstract class.\n");
        } 
        else if(typeof(x) == "number" && typeof(y) == "number"){ //ensure proper type
            this.xpos = x;
            this.ypos = y;
            this.hover = false;
            this.selected = false;
        }
        else{
            throw new Error("Invalid position coordinates.\n");
        }

    }

    getSelected(){
        return this.selected;
    }

    getX(){
        return this.xpos;
    }

    getY(){
        return this.ypos;
    }

    setHover(){
        this.hover = true;
    }

    noHover(){
        this.hover = false;
    }

    getHover(){
        return this.hover;
    }

    //for moving shapes
    addX(incr){
        this.xpos += incr;
    }

    addY(incr){
        this.ypos += incr; //since openGL has weird coord systems
    }

    selectedCurrently(){
        this.selected = true;
    }

    unselected(){
        this.selected = false;
    }

    draw(){
        throw new Error("No implementation for abstract method draw().\n");
    }

    //assumes that given coords are already modified to the geometric
    //coordinate system of the shape.
    checkHit(givenX, givenY){
        throw new Error("No implementation of checkHit().\n");
    }

    equals(other){
        throw new Error("No implementation of equals().\n");
    }
}

/*
 * Text.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines data and interface for the text of a button of the UI.
 */

class Text extends Shape{
    w;
    h;
    texture;
    
   //Constructor
   //Width and Height are given as unit coord dimensions.
    constructor(x,y,text,width,height){ //might add a param for text
       super(x,y);
       this.w = width;
       this.h = height;
       this.texture = text;
    }

    /*
     * draw()
     *
     * PURPOSE: Draws some text. All text in this program is merely an
     * image with a texture. There are no text capabilities in WebGL right now.
     */
    draw(){
        push();

        beginShape();
        texture(this.texture);
        textureWrap(MIRROR);
        //draw as a rectangle, divide by 2 for width and height
        vertex(this.getX() - (this.w/2.0), this.getY() - (this.h/2.0),CENTER,TOP_EDGE); //bottom right, CCW, Need UV coordinates for texture mapping
        vertex(this.getX() + (this.w/2.0), this.getY() - (this.h/2.0),RIGHT_EDGE,TOP_EDGE); //for some reason this starts on bottom right?
        vertex(this.getX() + (this.w/2.0), this.getY() + (this.h/2.0),RIGHT_EDGE,CENTER);
        vertex(this.getX() - (this.w/2.0), this.getY() + (this.h/2.0),CENTER,CENTER);

        endShape(CLOSE);

        pop();
    }

    checkHit(givenX, givenY){
        return false; //no real need, this is bad inheritance, although could act as a button
    }
}

/*
 * Button.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines data and interface for a button of the UI.
 */

 class Button extends Shape{
     col; //color, not the best variable names
     w; //width
     h; //height
     enumerator; //for click events
     
     /*
      * constructor()
      *
      * @param x -  unit coords position
      * @param y - unit coords position
      * @param setColor - the color of the button
      * @param width - unit coords
      * @param height - unit coords
      * @param enumer - denotes the action to be performed when clicked
      */
     constructor(x,y,setColor,width,height, enumer){ //might add a param for text
        super(x,y);
        this.col = setColor;
        this.w = width;
        this.h = height;
        this.enumerator = enumer;
     }

     //like text, just a rectangle, color is selected based on hover/click events.
     draw(){
        noStroke();
        if(this.getHover() || this.getSelected()){
            fill(BLUE_5); //needs a constant
        }
        else{
            fill(this.col);
        }
        
        push();
        beginShape(); //CCW
        vertex(this.getX() - (this.w)/2.0, this.getY() + (this.h)/2.0); //top left
        vertex(this.getX() - (this.w)/2.0, this.getY() - (this.h)/2.0);
        vertex(this.getX() + (this.w)/2.0, this.getY() - (this.h)/2.0);
        vertex(this.getX() + (this.w)/2.0, this.getY() + (this.h)/2.0);

        endShape(CLOSE);
        pop();
     }

     //for click event decisions.
     getEnum(){
         return this.enumerator;
     }

     checkHit(givenX, givenY){

        //convert mouse coords to unit coord system of the screen, not world system
        let xcoor = (givenX - (width/2)) / (width/2);
        let ycoor = ((height - givenY) - (height/2)) / (height/2); //weird since canvas is upside down for mouse
        let hit = false;

        //simple rectangle hit detection.
        if(xcoor <= this.getX() + (this.w)/2.0 &&
            xcoor >= this.getX() - (this.w)/2.0 &&
            ycoor <= this.getY() + (this.h)/2.0 &&
            ycoor >= this.getY() - (this.h)/2.0){
                hit = true;
        }

        return hit;

     }
 }

/*
 * ButtonItem.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  A Button that can be stored in a linked list.
 */

class ButtonItem extends ListItem{
    constructor(newData, newLink){
        if(newData instanceof Button){
            super(newData,newLink);
        }
        else{
            throw new Error("Given item is not a shape.\n");
        }
    }
 }

/*
 * Vertex.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines data and interface for vertices of a graph.
 */

class Vertex extends Shape{
    number; //stores the number of the vertex, UNIQUE
    burned;
    neighbors;

    //@param num - the unique id of the vertex.
    constructor(x,y, num){
        super(x,y);
        this.number = num;
        this.burned = null; //must call resetBurnedHistory() later
        this.neighbors = new LinkedList();
    }

    /*
     * draw()
     *
     * PURPSOSE: Draws a vertex using simple circle drawing.
     * Colors depend on selection/burned status.
     */
    draw(givenStage){

        //old code for textures
        /* noFill();
        noStroke();
        textureWrap(CLAMP);
        if(this.getSelected()){
          texture(vertexTextureSel);
        }
        else{
          texture(vertexTexture);
        } */

        push();
        translate(this.getX(), this.getY()); //go to the position

        noFill();

        if(this.getSelected()){
            stroke(VERT_YELLOW); //yellow
        }
        else if((this.burned != null) && this.burned[givenStage]){ //this is reserved for the burning stage!
            stroke(VERT_RED); //red
        }
        else{
            stroke(VERT_GREEN); //green
        }

        strokeWeight(VERTEX_WEIGHT);

        ellipse(CENTER,CENTER,VERT_RAD);
        pop();
    }

    //easy, use the LL
    removeNeighbor(neighbor){
        if(neighbor == null || arguments.length == 0 || !(neighbor instanceof Vertex)){
            throw new Error("Invalid neighbor");
        }
        this.neighbors.delete(neighbor);
    }

    //assumes that given coords are in the world unit coord system
    checkHit(givenX, givenY){

        let xcoor = givenX - this.getX(); //move to center
        let ycoor = givenY - this.getY();
        let out = false;

        //simple square hit detection
        if(xcoor < VERT_RAD/2.0 && xcoor > -VERT_RAD/2.0 
            && ycoor < VERT_RAD/2.0 && ycoor > -VERT_RAD/2.0 ){
            out = true;
        }

        return out;
    }

    equals(other){
        if(!(other instanceof Vertex)){
            throw new Error("Item being compared is not of type Vertex!\n");
        }
        return this.number == other.number; //easy, use unique ID number
    }

    burned(){
        this.burned.push(true);
    }

    alive(){
        this.burned.push(false);
    }

    addNeighbor(newNeighbor){
        if(newNeighbor == null || arguments.length == 0 || !(newNeighbor instanceof Vertex)){
            throw new Error("Invalid neighbor");
        }

        this.neighbors.addEnd(new VertexItem(newNeighbor));

    }
    
    getNeighbors(){ //returns an iterator
        return this.neighbors.iterator();
    }

    //to be nested in the draw function! Lines should be drawn first so they are covered.
    //this might duplicate lines however, inefficient
    //just iterates through neighbors, and draws connecting lines
    drawEdges(){
        push();

        let x1 = this.getX();
        let y1 = this.getY();

        let neighborList = this.neighbors.iterator();

        strokeWeight(EDGE_WEIGHT);

        while(!neighborList.isEmpty()){
            let neighborVert = neighborList.currItem();

            let x2 = neighborVert.getX();
            let y2 = neighborVert.getY();

            //need to check if this or destination vertex is selected
            if(this.getSelected() || neighborVert.getSelected()){
                stroke(YELLOW);
            }
            else{
                stroke(0,0,0); //black
            }

            line(x1,y1,x2,y2);

            neighborList.next();
        }

        pop();
    }

    //will remove itself from neighbors' lists.
    delete(){
        let neighborList = this.neighbors.iterator();

        while(!neighborList.isEmpty()){
            neighborList.currItem().removeNeighbor(this); //remove this from its list

            neighborList.next();
        }

    }

    //for resetting the algorithm later
    resetBurnedHistory(length){
        this.burned = new Array();
        for(let i = 0; i < length; i++){
            this.burned.push(false); //not burned at all at first
        }
    }

    //sets the burned variable to true for all stages >= 'stage'.
    setBurned(stage){
        if(this.burned == null){
            console.log("here");
        }
        for(let i = stage; i < this.burned.length; i++){
            this.burned[i] = true; //set all future stages to true
        }
    }

    //for Identification
    getNumber(){
        return this.number;
    }

    print(){
        console.log("\n" + this.getNumber() + "\n")
        console.log(this.burned + "\n");
    }

}

/*
 * VertexItem.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  An Vertex that can be stored in a linked list.
 */
class VertexItem extends ListItem{
    constructor(newData, newLink){
        if(newData instanceof Vertex){
            super(newData,newLink);
        }
        else{
            throw new Error("Given item is not a vertex.\n");
        }
    }
}

/*
 * Graph.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines data and interface for a graph of nodes
 *  and edges.
 */

class Graph{

    vertices; //vertices and vertArray share the same references
    vertArray; //arrays allow for faster access.
    selectedVert;
    numVertices; //for unique ID's
    newEdge1; //two vertex references for adding edges.
    newEdge2;
    currentStage; //for displaying the graph

    constructor(){
        this.vertices = new LinkedList();
        this.vertArray = new Array(); //for fast access, just an array of references, not too large.
        this.selectedVert = null;
        this.numVertices = 0;
        this.newEdge1 = null;
        this.newEdge2 = null;
        this.currentStage = 0; //start at the beginning

        let prev = null;

        //this is code for adding random graphs at the start
        /* for(let i = 0; i < 0; i++){
            this.numVertices++;
            let vert = new Vertex(2 * Math.random() - 1, 2 * Math.random() - 1, this.numVertices);
            this.vertices.addFront(new VertexItem(vert));
            this.vertArray.push(vert);

            if(prev != null){
                vert.addNeighbor(prev); //just for testing add the last one as a neighbor
                prev.addNeighbor(vert); //should both know they are neighbors
            }

            prev = vert;
        } */
    }

    //returns an iterator for the shapes.
    shapeIterator(){
        return this.vertices.iterator();
    }

    //iterator in opposite order
    reverseShapeIterator(){
        return this.vertices.reverse().iterator();
    }

    //draws the graph using OOP principles, easy
    drawGraph(){
        let shapes = this.vertices.iterator();

        while(!shapes.isEmpty()){
            shapes.currItem().drawEdges();
            shapes.next();
        }

        shapes = this.vertices.iterator();

        
        while(!shapes.isEmpty()){
            shapes.currItem().draw(this.currentStage);
            shapes.next();
        }
    }

    //updates the currently selected vertex
    setSelectedVert(vert){
        if(this.selectedVert){ //if already selected one
            this.selectedVert.unselected(); //only one at a time.
        }

        this.selectedVert = vert;
        if(vert != null){ //note it can be null for when nothing is selected
            vert.selectedCurrently();
            vert.print();
        }
    }

    /*
     * addVertex()
     *
     * PURPOSE: Adds a vertex to the graph.
     * 
     * @param givenX - Coords of shape center in mouse coords.
     * @param givenY - see above
     * @param xMove - the current horizontal shift of the World Coord System
     * @param yMove- see above but for vertical
     * @param zoom - accounts for the zoom of the camera when adding vertices.
     */
    addVertex(givenX, givenY, xMove, yMove, zoom){ //generally the mouse coords

        //apply transformations!
        let xcoor = (givenX - (width/2)) / (width/2);
        let ycoor = ((height - givenY) - (height/2)) / (height/2); //weird since canvas is upside down for mouse
        let hit = false;
        //now you have to apply the transformations for world, not inverse
        xcoor = xcoor/zoom;
        ycoor = ycoor/zoom;


        xcoor -= xMove; //minus because shifting left is negative, so subtracting a negative value moves to the right
        ycoor -= yMove;

        //now just create a vertex with these coords
        this.numVertices++; //get a unique ID

        let vert = new Vertex(xcoor, ycoor, this.numVertices);
        this.vertices.addFront(new VertexItem(vert));
        this.vertArray.push(vert);

    }

    //assume it is removing the currently selected vertex
    delVertex(){
        if(this.selectedVert != null){
            this.selectedVert.delete();

            this.vertices.delete(this.selectedVert);

            this.selectedVert = null; //pretty simple using OOP
        }
    }

    //when not adding an edge, make sure we don't keep old data
    resetNewEdge(){
        this.newEdge1 = null;
        this.newEdge2 = null;
    }

    //this occurs when the edge button is clicked.
    //simple edge insertion.
    prepareEdge(){
        if(this.newEdge1 == null){ //first vert selected
            this.newEdge1 = this.selectedVert;
        }
        else if(this.selectedVert != this.newEdge1){ //we now have two vertices and no duplicates
            this.newEdge2 = this.selectedVert;

            this.newEdge1.addNeighbor(this.newEdge2);
            this.newEdge2.addNeighbor(this.newEdge1);

            this.resetNewEdge();
        }
    }
    
    incrementStage(increment){
        //note we cannot find the minimum rounds for burning
        //that is an NP-Complete problem.
        //This may cause problems as boolean array may be longer
        // than the actual sequence. Unknown behaviour will occur.
        if(this.currentStage + increment < 0 || this.currentStage + increment >= this.vertices.getLength()){ //out of bounds
            //do nothing
            console.log("Not a valid stage.\n");
        }
        else{
            this.currentStage += increment; //modify it if in bounds!
            console.log(this.currentStage);
        }
    }


    /*
     * runBurnAlgorithm()
     *
     * PURPOSE: Runs the approximation algorithm for burning
     * a graph.
     * 
     * This is the bulk of the program, it was a pain, it follows the
     * algorithm in 'Approximation Algorithms for Graph Burning' by
     * Anthony Bonato and Shahin Kamali. 
     * 
     * LOTS OF OVERHEAD
     * 
     * Performs a BFS. Has to track the depth which is a pain,
     * but it works by counting neighbors per layer.
     * 
     * You can find the paper online easily.
     */
    runBurnAlgorithm(){
        let MAXIMUM = Math.ceil(this.vertices.getLength()/2.0); //conjectured this is the maximum amt of rounds.
        //we want to build up to maximum, so maybe we can find smaller solutions!
        let currMin = Math.ceil(MAXIMUM/2); //minimum rounds desired, use integers, start at half the maximum and work up.
        let INCREMENT_ROUNDS = 1; //increment for currMin.
        let done = false;


        let shapes;

        while(!done){ //to run multiple iterations of the alg
            let vertQueue = new LinkedList();
            let visited = new Array(); //keep track of visited vertices
            let randomVertCount = Math.floor(random() * (this.vertices.getLength())) + 1; //grab a random starting point, account for +1 when using random.
            let numCenters = 0;
            let currRound = 0; //0 is round 1, this represents depth
            let maxDepth = 2*currMin-2; //defined in the paper
            let numNeighbors = 0; //vertices left at current depth
            let numNeighborsNext = 0; //vertices at next depth
            shapes = this.vertices.iterator();

            console.log("trying with min " + currMin +".\n"); //for viewing purposes

            while(!shapes.isEmpty()){ //reset everything
                shapes.currItem().resetBurnedHistory(this.vertices.getLength());
                shapes.next();
            }

            for(let i = 0; i < this.vertices.getLength(); i++){ //reset visited
                visited.push(false);
            }

            shapes = this.vertices.iterator();

            //find a random vert
            let count = 0;
            let randomVert;
            while(count < randomVertCount){ //linear search pretty much
                randomVert = shapes.currItem();
                shapes.next();
                count++;
            }

            vertQueue.addEnd(new VertexItem(randomVert)); //add to queue
            numNeighbors++; //one neighbor to go through
            numCenters++;

            //now follow the algorithm
            while(!vertQueue.isEmpty() && numCenters < currMin && !done){
                let currVert = vertQueue.pop();
                console.log("Visiting Vertex " + currVert.getNumber() + ".\n");

                if(!visited[currVert.getNumber()-1]){
                  numNeighbors--; //we checked one vert of the current depth
                  currVert.setBurned(currRound);
                }

                let neighbors = currVert.getNeighbors(); //this is an iterator

                while(!neighbors.isEmpty() && currRound < maxDepth && !visited[currVert.getNumber()-1]){
                    let neighborVert = neighbors.currItem();
                

                    if(!visited[neighborVert.getNumber()-1]){ //not already visited
                        vertQueue.addEnd(new VertexItem(neighborVert));
                        numNeighborsNext++;
                    }

                    neighbors.next();
                }

                visited[currVert.getNumber()-1] = true;

                //check if going to the next depth
                if(!vertQueue.isEmpty() && numNeighbors <= 0){
                    numNeighbors = numNeighborsNext;
                    numNeighborsNext = 0; //reset
                    currRound++;
                }

                //check if done
                done = this.verticesBurned(visited);

                //do we need to find a random vert?
                if(vertQueue.isEmpty() & !done){ //this is fast, no worries

                    do{
                        shapes = this.vertices.iterator();
                        randomVertCount = Math.floor(random() * (this.vertices.getLength())) + 1; //grab a random starting point
                        //find a random vert
                        count = 0;
                        while(count < randomVertCount){
                            randomVert = shapes.currItem();
                            shapes.next();
                            count++;
                        }
                    } while(visited[randomVert.getNumber()-1] && !this.verticesBurned(visited)); //redo if already visited


                    //adjust to the proper round, which is based off of numCenters
                    currRound = numCenters; //no +1 since the next center hasn't been added yet! This should be the correct round

                    vertQueue.addEnd(new VertexItem(randomVert)); //add to queue
                    numCenters++; //adding a center
                }

            }

            //once we've reached here, we are done the BFS, but have we found a sequence?

            if(numCenters >= currMin){ //this is a Bad-Guess, retry with higher minumum
                currMin += INCREMENT_ROUNDS;
                done = false; //re do all of it
            }
            else{
                done = true;
            }
        }
    }

    //more of a private function
    //checks if all vertices have burned
    //simple iteration fo the array
    verticesBurned(burnedArray){
        let out = true; //assume true until proven false
        if(burnedArray instanceof Array){
            let shapes = this.vertices.iterator();

            while(!shapes.isEmpty()){
                if(!burnedArray[shapes.currItem().getNumber()-1]){ //found one that isn't burned yet
                    out = false;
                }
                shapes.next();
            }
        }
        else{
            throw new Error("Parameter given not an array.\n");
        }

        return out;
    }
}

/*
 * Background.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Defines data and interface for the background.
 */

class Background extends Shape{
    //what else should be here?

    constructor(x,y){
        super(x,y);
    }

    //set back to origin
    resetPos(){
        this.addX(this.getX());
        this.addY(this.getY());
    }

    draw(){
        background(0); //not really necessary
        push();

        translate(this.getX(), this.getY());

        beginShape();
        //background is just a square with a texture
        texture(backgroundText); //global constant
        textureWrap(REPEAT);
        vertex(LEFT_EDGE*BACKGROUND_FACTOR,BOTTOM_EDGE*BACKGROUND_FACTOR,CENTER,CENTER); //bottom left, CCW, Need UV coordinates for texture mapping
        vertex(RIGHT_EDGE*BACKGROUND_FACTOR,BOTTOM_EDGE*BACKGROUND_FACTOR,BACKGROUND_UV,CENTER);
        vertex(RIGHT_EDGE*BACKGROUND_FACTOR,TOP_EDGE*BACKGROUND_FACTOR,BACKGROUND_UV,BACKGROUND_UV);
        vertex(LEFT_EDGE*BACKGROUND_FACTOR,TOP_EDGE*BACKGROUND_FACTOR,CENTER,BACKGROUND_UV);

        endShape(CLOSE);

        pop();
    }

    addX(incr){
        //check if out of bounds
        if(this.getX() > RIGHT_EDGE/2.0){
            super.addX(LEFT_EDGE/2.0);
        }
        else if(this.getX() < LEFT_EDGE/2.0){
            super.addX(RIGHT_EDGE/2.0);
        }
        super.addX(incr);
    }

    addY(incr){
        //check if out of bounds
        if(this.getY() > TOP_EDGE/2.0){
            super.addY(BOTTOM_EDGE/2.0);
        }
        else if(this.getY() < BOTTOM_EDGE/2.0){
            super.addY(TOP_EDGE/2.0);
        }
        super.addY(incr);
    }   
}



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

    //THE ORDER IS:
    // 1 - ADD, 2 - DEL, 3 - EDGE, 4 - ALG, 5 - NEXT, 6 - BACK,
    // 7 - 50x, 8 - 20x, 9 - 5x, 10 - 1x,
    shapeList;
    textList;
    selectedButton;

    constructor(){
        this.shapeList = new LinkedList();
        this.textList = new LinkedList();
        this.selectedButton = null;
        this.addUIShapes();
        this.addTextShapes();
    }



    addUIShapes(){
        //add button first
        //should have used hex values for color, but who cares at this point...
        //probably should use constants

        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + (BIG_WIDTH/2.0), TOP_EDGE - (BIG_HEIGHT/2.0), BLUE_1,BIG_WIDTH,BIG_HEIGHT,OPERATIONS.ADD))); //rounded part is now useless
        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + (BIG_WIDTH/2.0) + (BIG_WIDTH), TOP_EDGE - (BIG_HEIGHT/2.0), BLUE_2,BIG_WIDTH,BIG_HEIGHT, OPERATIONS.DEL))); 
        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + (BIG_WIDTH/2.0) + (2*BIG_WIDTH), TOP_EDGE - (BIG_HEIGHT/2.0), BLUE_3,BIG_WIDTH,BIG_HEIGHT, OPERATIONS.EDGE))); 
        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + (BIG_WIDTH/2.0) + (3*BIG_WIDTH), TOP_EDGE - (BIG_HEIGHT/2.0), BLUE_4,BIG_WIDTH,BIG_HEIGHT, OPERATIONS.ALG))); 

        //other buttons probably random graph etc
        this.shapeList.addEnd(new ButtonItem(new Button((BIG_WIDTH/2.0), BOTTOM_EDGE + (BIG_HEIGHT/2.0), ORAN_1,BIG_WIDTH,BIG_HEIGHT, OPERATIONS.NEXT))); 
        this.shapeList.addEnd(new ButtonItem(new Button((BIG_WIDTH/2.0) + (BIG_WIDTH), BOTTOM_EDGE + (BIG_HEIGHT/2.0), ORAN_2,BIG_WIDTH,BIG_HEIGHT, OPERATIONS.BACK))); 

        //step selectors
        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + (FIF_WID/2.0), BOTTOM_EDGE + (FIF_WID/2.0), PURP_1,FIF_WID,FIF_WID, OPERATIONS.FIFTY)));
        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + ((FIF_WID - FACTOR)/2.0), BOTTOM_EDGE + (FIF_WID) + (FIF_WID-FACTOR)/2.0, PURP_2,FIF_WID-FACTOR,FIF_WID-FACTOR, OPERATIONS.TWENTY))); 
        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + ((FIF_WID - 2*FACTOR)/2.0), BOTTOM_EDGE + (FIF_WID) + (FIF_WID-FACTOR) + (FIF_WID-2*FACTOR)/2.0, PURP_3,FIF_WID-2*FACTOR,FIF_WID-2*FACTOR, OPERATIONS.FIVE)));
        this.shapeList.addEnd(new ButtonItem(new Button(LEFT_EDGE + ((FIF_WID - 3*FACTOR)/2.0), BOTTOM_EDGE + (FIF_WID) + (FIF_WID-FACTOR) + (FIF_WID-2*FACTOR) + (FIF_WID-3*FACTOR)/2.0, PURP_4,FIF_WID-3*FACTOR,FIF_WID-3*FACTOR, OPERATIONS.ONE))); 
    }

    addTextShapes(){
        //THE ORDER IS:
        // 1 - ADD, 2 - DEL, 3 - EDGE, 4 - ALG, 5 - NEXT, 6 - BACK,
        // 7 - 50x, 8 - 20x, 9 - 5x, 10 - 1x,

        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + (BIG_WIDTH/2.0), TOP_EDGE - (BIG_HEIGHT/2.0), addText, BIG_WIDTH, BIG_HEIGHT))); //add
        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + (BIG_WIDTH/2.0) + (BIG_WIDTH), TOP_EDGE - (BIG_HEIGHT/2.0), delText, BIG_WIDTH, BIG_HEIGHT))); //del
        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + (BIG_WIDTH/2.0) + (2*BIG_WIDTH), TOP_EDGE - (BIG_HEIGHT/2.0), edgeText, BIG_WIDTH, BIG_HEIGHT))); //edge
        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + (BIG_WIDTH/2.0) + (3*BIG_WIDTH), TOP_EDGE - (BIG_HEIGHT/2.0), algText, BIG_WIDTH, BIG_HEIGHT))); //alg

        this.textList.addEnd(new ShapeItem(new Text((BIG_WIDTH/2.0), BOTTOM_EDGE + (BIG_HEIGHT/2.0), nextText, BIG_WIDTH, BIG_HEIGHT))); //next
        this.textList.addEnd(new ShapeItem(new Text((BIG_WIDTH/2.0) + (BIG_WIDTH), BOTTOM_EDGE + (BIG_HEIGHT/2.0), backText, BIG_WIDTH, BIG_HEIGHT))); //back

        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + (FIF_WID/2.0), BOTTOM_EDGE + (FIF_WID/2.0), fiftyText, FIF_WID,FIF_WID))); //50
        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + ((FIF_WID - FACTOR)/2.0), BOTTOM_EDGE + (FIF_WID) + (FIF_WID-FACTOR)/2.0, twentyText, FIF_WID-FACTOR,FIF_WID-FACTOR))); //20
        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + ((FIF_WID - 2*FACTOR)/2.0), BOTTOM_EDGE + (FIF_WID) + (FIF_WID-FACTOR) + (FIF_WID-2*FACTOR)/2.0, fiveText, FIF_WID-2*FACTOR,FIF_WID-2*FACTOR))); //5
        this.textList.addEnd(new ShapeItem(new Text(LEFT_EDGE + ((FIF_WID - 3*FACTOR)/2.0), BOTTOM_EDGE + (FIF_WID) + (FIF_WID-FACTOR) + (FIF_WID-2*FACTOR) + (FIF_WID-3*FACTOR)/2.0, oneText, FIF_WID-3*FACTOR,FIF_WID-3*FACTOR))); //1


    }

    //draw methods merely iterate
    draw(){
        let shapes = this.shapeList.iterator();
        push();
        while(!shapes.isEmpty()){
            shapes.currItem().draw();
            shapes.next();
        }
        pop();

        this.drawText();
    }

    drawText(){
        let textShapes = this.textList.iterator();
        push();
        while(!textShapes.isEmpty()){
            textShapes.currItem().draw();
            textShapes.next();
        }
        pop();
    }

    //this will return the enum of the action required to be performed
    //if the click hit a button.
    checkHit(givenX, givenY){
        let out = OPERATIONS.NONE;
        let hit = false;

        let shapes = this.shapeList.iterator();

        while(!shapes.isEmpty() && !hit){
            //check the shape
            let shape = shapes.currItem();
            hit = shape.checkHit(givenX,givenY);

            if(hit){
                if(this.selectedButton != null){
                    this.selectedButton.unselected();
                }
                this.selectedButton = shape;
                shape.selectedCurrently();

                out = shape.getEnum();
                hit = true;
            }

            shapes.next();
        }

        return out;
    }

    //will let buttons know that the mouse is
    //hovering over them
    checkHover(givenX, givenY){
        let hit = false;

        let shapes = this.shapeList.iterator();

        while(!shapes.isEmpty()){ //Must go through all objects each time!
            //check the shape
            let shape = shapes.currItem();
            hit = shape.checkHit(givenX,givenY);

            if(hit){
                shape.setHover(); //what should this actually do, probably output a number!
            }
            else{
                shape.noHover();
            }

            shapes.next();
        }
    }
}

/*
 * WorldGeometry.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  Define camera positioning/zoom for the world coordinate system.
 *  Most geometry will be controlled by this.
 */

 class WorldGeometry{
    backgroundImage; //seperate since it needs to be drawn first, but hit checked last.
    graph;
    //transformation stuff
    translateX;
    translateY;
    scaleZoom;
    //increment for burned algorithm
    currIncrement;

    constructor(graphData){
        this.graph = graphData;
        this.backgroundImage = new Background(0,0);
        this.translateX = 0;
        this.translateY = 0;
        this.scaleZoom = 1.0; //normal zoom
        this.currIncrement = ONE;
    }

    draw(){
        this.backgroundImage.draw();

        //apply the world transformations
        push();
        scale(this.scaleZoom);
        translate(this.translateX, this.translateY); //note: applying transformations is backwords, the closest to the bottom is applied first
        this.graph.drawGraph();
        
        //go back to normal
        pop();
    }

    addVertex(givenX, givenY){
        this.graph.addVertex(givenX, givenY, this.translateX, this.translateY, this.scaleZoom);
    }

    deleteVertex(){
        this.graph.delVertex();
    }

    addEdge(){
        this.graph.prepareEdge();
    }

    resetEdgeAdd(){
        this.graph.resetNewEdge();
    }

    /*
     * checkBackgroundHit()
     *
     * Shouldn't have to check for this, as if the user misses all other
     * shapes. then we know he hit the background.
     * 
     * Should run when the mouse is dragged!
     */
    checkBackgroundHit(){
        //we need increments in terms of the world coordinates system,
        //not mouse coords, so we must convert first.
        let MOUSE_ADJUSTMENT = 1.5;

        let incrX = (mouseX - pmouseX) / (width/MOUSE_ADJUSTMENT); //need constants!, this isn't perfect...
        let incrY = -(mouseY - pmouseY) / (width/MOUSE_ADJUSTMENT); //note that y coord is reversed in mouse coord system, must negate

        this.backgroundImage.addX(incrX);
        this.backgroundImage.addY(incrY);
        this.translateX += incrX;
        this.translateY += incrY;
    }

    //collision tester!
    //converts mouse coords to the world geometry.
    //then iterates through the shapes and gives shapes data to work with.
    checkHit(givenX, givenY){
        let xcoor = (givenX - (width/2)) / (width/2);
        let ycoor = ((height - givenY) - (height/2)) / (height/2); //weird since canvas is upside down for mouse
        let hit = false;
        //now you have to apply the transformations for world, not inverse
        xcoor = xcoor/this.scaleZoom;
        ycoor = ycoor/this.scaleZoom;


        xcoor -= this.translateX; //minus because translating left is negative, so subtracting a negative value moves the camera to the right
        ycoor -= this.translateY;


        let shapes = this.graph.reverseShapeIterator(); //get the shapes, always check in reverse order

        while(!shapes.isEmpty() && !hit){
            //check the shape
            let shape = shapes.currItem();
            hit = shape.checkHit(xcoor,ycoor);

            if(hit){
                this.graph.setSelectedVert(shape);
            }

            shapes.next();
        }

        return hit; //returns result if something was hit.

    }

    increaseZoom(){
        this.scaleZoom += 0.05;
    }

    decreaseZoom(){
        if(this.scaleZoom >= 0.05) //should be a limit, don't want reflections
          this.scaleZoom -= 0.05;
    }

    incrementStage(){
        this.graph.incrementStage(this.currIncrement);
    }

    decrementStage(){
        this.graph.incrementStage(-this.currIncrement);
    }

    fiftyIncrement(){
        this.currIncrement = FIFTY;
    }

    twentyIncrement(){
        this.currIncrement = TWENTY;
    }

    fiveIncrement(){
        this.currIncrement = FIVE;
    }

    oneIncrement(){
        this.currIncrement = ONE;
    }

    runBurnAlgorithm(){
        this.graph.runBurnAlgorithm();
    }

    noHit(){
        this.graph.setSelectedVert(null);
    }
 }

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
    interface;
    geometry;
    currentOperation;
    dragging;
    ranAlg; //have we run the algorithm yet?

    constructor(){
        this.interface = new SimUserInterface();
        this.geometry = new WorldGeometry(new Graph());
        this.currentOperation = OPERATIONS.NONE;
        this.dragging = false;
        this.ranAlg = false;
    }
    
     drawSim(){
        this.geometry.draw();
        resetMatrix();
        this.interface.draw();
    }


    //handles click Events
    checkMouseClick(){
        if(!this.dragging){ //prevents weird behaviour

            let operationResult = this.interface.checkHit(mouseX,mouseY); //need to check buttons first

            if(this.geometry.checkHit(mouseX,mouseY)){ //check if adding a vertex!
                //nothing really happens, since checkHit does the work.
            }
            //we know we haven't hit anything at this point if checkHit() from interface returns NONE
            else if(this.currentOperation == OPERATIONS.ADD && operationResult == OPERATIONS.NONE
                    && !this.ranAlg){
                //in this case, the user previously hit ADD, now he clicked the canvas, so add the vertex
                this.geometry.addVertex(mouseX, mouseY);
            }
            else{
                //decide what to do with the buttons!
                this.currentOperation = operationResult; //store it

                switch(operationResult){
                    case OPERATIONS.ADD:
                        //this one is useless
                        break;
                    case OPERATIONS.DEL:
                        if(!this.ranAlg){
                            this.geometry.deleteVertex();
                        }
                        break;
                    case OPERATIONS.EDGE:
                        if(!this.ranAlg){
                            this.geometry.addEdge();
                        }
                        break;
                    case OPERATIONS.ALG:
                        if(!this.ranAlg){
                            this.geometry.runBurnAlgorithm();
                        }
                        this.ranAlg = true;
                        break;
                    case OPERATIONS.NEXT:
                        this.geometry.incrementStage();
                        break;
                    case OPERATIONS.BACK:
                        this.geometry.decrementStage();
                        break;
                    case OPERATIONS.FIFTY:
                        this.geometry.fiftyIncrement();
                        break;
                    case OPERATIONS.TWENTY:
                        this.geometry.twentyIncrement();
                        break;
                    case OPERATIONS.FIVE:
                        this.geometry.fiveIncrement();
                        break;
                    case OPERATIONS.ONE:
                        this.geometry.oneIncrement();
                        break;
                    case OPERATIONS.NONE: //default really
                        this.geometry.resetEdgeAdd();
                        this.geometry.noHit();
                }
            }   
        }

        this.dragging = false;
    }

    checkMouseDrag(){
        this.dragging = true;

        //check if we hit nothing
        if(!this.geometry.checkHit(mouseX,mouseY) && (this.interface.checkHit(mouseX,mouseY) == OPERATIONS.NONE)){
            this.geometry.checkBackgroundHit();
        }
    }

    checkMouseHover(){
        this.interface.checkHover(mouseX, mouseY);
    }

    increaseZoom(){
        this.geometry.increaseZoom();
    }

    decreaseZoom(){
        this.geometry.decreaseZoom();
    }
 }


//You can tell how ambitious I was just reading this next paragraph...

/*
 * GraphSim.js
 * 
 * PROGRAM: Burning Graph Simulator
 * AUTHOR: Cassius Meeches
 * 
 * DESCRIPTION:
 *  An interactive program for creating graphs and running
 *  various algorithms for graph burning. Probably one of the
 *  first to ever be made as there are none available yet online.
 *  Helps for visualizing!
 */

/*
 * Unlike Processing, we can use the window width/height in the setup() function!
 */


let sim; //the outer object

function preload(){
    backgroundText = loadImage('https://i.imgur.com/oVX5j1D.png');
    vertexTexture = loadImage('https://i.imgur.com/BUiZQUQ.png');
    vertexTextureSel = loadImage('https://i.imgur.com/Et4TpDp.png');
    burnedTexture = loadImage('https://i.imgur.com/Ok6cv8c.png');
    burnedTextureSel = loadImage('https://i.imgur.com/FrKvrmI.png');
    addText = loadImage('https://i.imgur.com/DI2ecNn.png');
    delText = loadImage('https://i.imgur.com/hWUNvn3.png');
    edgeText = loadImage('https://i.imgur.com/3QmWvAZ.png');
    algText = loadImage('https://i.imgur.com/AmSFP8O.png');
    nextText = loadImage('https://i.imgur.com/ep8y7iK.png');
    backText = loadImage('https://i.imgur.com/lBho1K5.png');
    fiftyText = loadImage('https://i.imgur.com/SG3YRP9.png');
    twentyText = loadImage('https://i.imgur.com/hBtV21V.png');
    fiveText = loadImage('https://i.imgur.com/1ogH2Fj.png');
    oneText = loadImage('https://i.imgur.com/29ykvwg.png');

    //must define color constants here

    BLUE_1 = color(0,119,182);
    BLUE_2 = color(0,150,199);
    BLUE_3 = color(0,180,216);
    BLUE_4 = color(72,202,228);
    BLUE_5 = color(181, 235, 230);

    ORAN_1 = color(206,66,87);
    ORAN_2 = color(255,127,81);

    PURP_1 = color(106,0,244);
    PURP_2 = color(137,0,242);
    PURP_3 = color(161,0,242);
    PURP_4 = color(177,0,232);

    YELLOW = color(242, 211, 31);

    VERT_GREEN = color(42, 87, 48);
    VERT_RED = color(189, 9, 0);
    VERT_YELLOW = color(242, 211, 31);
}

function setup() {
  createCanvas(800,800, WEBGL);
  ortho(-1, 1, 1, -1); //we're using a 2D coordinate system, so no need for near and far.
  resetMatrix();
  textureMode(NORMAL); //for textures, uses normal UV coord system.
  blendMode(BLEND);
  sim = new SimController();
}

// in P5 this runs continously every frame. Pretty much the main() function.
function draw() {
  sim.checkMouseHover();
  sim.drawSim();
}



//the rest is even stuff really

//Function for event handling of mouse clicks.
function mouseClicked(){
    sim.checkMouseClick();
}

function mouseDragged(){
    sim.checkMouseDrag();
}

function mouseWheel(event) {
    if(event.delta < 0){
        sim.increaseZoom();
    }
    else{
        sim.decreaseZoom();
    }
}
