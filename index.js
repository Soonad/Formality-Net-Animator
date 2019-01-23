class Node {
    constructor(type, position, angle) {
        this.type = type; // 0: initial, 1: white node, 2: black node
        this.position = position;
        this.angle = angle; // angle for port 0
        this.ports = [null, null, null]; // [[node0, 0], [node1, 1], [node2, 2]]
        // Pivots starts in the same positon as the ports
        this.pivots = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
        this.radius = 20;
    }

    getPortPosition(slot) {
        // var add_angle = [0, Math.PI * 2 / 3, Math.PI * 4 / 3][slot];
        var add_angle = [0, getRadianFromAngle(240), getRadianFromAngle(120)][slot];
        var position = add([this.position.x, this.position.y], rotate([this.radius, 0], this.angle + add_angle));
        return {x: position[0], y: position[1]};
    }

}

// Size for canvas element
const height = 400;
const width = 400;
/**
 * Represent a thing clicked. Can be of type Node or Pivot.
 * Type node: ["node", node]
 * Type pivot: ["pivot", node, 0] 
 */
var elementSelected = null; 


// Nodes
var initialNode = new Node(0, {x: width * 0.47 - 5, y: height * 0.05}, getRadianFromAngle());
var nodes = makeNodes();


window.onload = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d"); 
    
    setInitialPositionForPivots();

    // Calls a function or evaluates an expression at specified intervals
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);   
        setInitialNode(context);

        for (node of nodes) {    
            if (node.type == 2) {
                context.strokeStyle = 'blue';
            } else {
                context.strokeStyle = 'black'; 
            }
            drawElements(context, node); 
        };

    }, 1000/30);
    
    canvas.onmousedown = function(e) {
        var positionClicked = [e.offsetX, e.offsetY];
        var maxRadiusDistance = 10;
        var maxRadiusDistanceForPivot = 10;

        elementSelected = null;

        for (var i = 0; i < nodes.length; i++) {    
            // Checks if any node was clicked 
            var distanceFromNode = getDistanceBetween([nodes[i].position.x, nodes[i].position.y], positionClicked);
            if (distanceFromNode <= maxRadiusDistance) {
                elementSelected = ["node", nodes[i]];
            }
            
            // Check if any pivot was clicked
            for (var j = 0; j < 3; j++) {            
                var distanceFromPivot = getDistanceBetween([nodes[i].pivots[j].x, nodes[i].pivots[j].y], positionClicked);
                if (distanceFromPivot <= maxRadiusDistanceForPivot) {
                    elementSelected = ["pivot", nodes[i], j];
                    console.log(">>> 1. Pivot on port "+j+" clicked for node "+i);
                }
            }  
        }

    };

    canvas.onmousemove = function(e) {
        if (elementSelected) {
            var node = elementSelected[1];
            // Check the type of the element selected
            if (elementSelected[0] === "node") {
                node.position = {x: e.offsetX, y: e.offsetY};
            } else if (elementSelected[0] === "pivot") {
                var pivotPort = elementSelected[2];
                node.pivots[pivotPort] = {x: e.offsetX, y: e.offsetY};
            }
        }  
    }

    canvas.onmouseup = function(e) {
        elementSelected = null;
    }
}

// window.addEventListener("keydown", keysPressed, false);
// window.addEventListener("keyup", keysReleased, false);

// var keys = [];

// function keysPressed(e) {
//     // store an entry for every key pressed
//     keys[e.keyCode] = true;
//     if (elementSelected) {
//         var elementToMove = null;
//         if (elementSelected[0] === "pivot") {
//             elementToMove = elementSelected[1].pivots[elementSelected[2]]; // pivot related to one port in one node
//         } else {
//             elementToMove = elementSelected.position;
//         }

//         // left
//         if (keys[37]) {
//             elementToMove.x -= 5;
//         }

//         // right
//         if (keys[39]) {
//             elementToMove.x += 5;
//         }

//         // down
//         if (keys[38]) {
//             elementToMove.y -= 5;
//         }

//         // up
//         if (keys[40]) {
//             elementToMove.y += 5;
//         }

//     }
 
//     e.preventDefault();

// }

// function keysReleased(e) {
//     // mark keys that were released
//     keys[e.keyCode] = false;
// }




// Defines the properties of each node
function makeNodes() {
    var nodes = [];

    var node0 = new Node(1, {x: width * 0.5, y: height * 0.2}, getRadianFromAngle(90));
    nodes.push(node0);


    var node1 = new Node(1, {x: width * 0.3, y: height * 0.40}, getRadianFromAngle());
    nodes.push(node1);

    var node2 = new Node(2, {x: width * 0.20, y: height * 0.60}, getRadianFromAngle());
    nodes.push(node2);

    // -10 is to align an upside down node with the others
    var node3 = new Node(1, {x: width * 0.40, y: height * 0.60 - 10}, getRadianFromAngle(90));
    nodes.push(node3); 


    var node4 = new Node(1, {x: width - (width * 0.3), y: height * 0.40}, getRadianFromAngle());
    nodes.push(node4);


    // Connections between ports
    connectPorts([node0, 0], [node1, 0]);
    connectPorts([node0, 1], [node4, 0]);
    connectToInitialNode([node0, 2]);

    connectPorts([node1, 1], [node2, 0]);
    connectPorts([node1, 2], [node3, 2]);

    connectPorts([node2, 1], [node3, 0]);
    connectPorts([node2, 2], [node3, 1]);

    connectPorts([node4, 1], [node4, 2]);

    return nodes;
}


// ----- Auxiliar functions -----
// Gets the distance between 2 points
function getDistanceBetween([ax, ay], [bx, by]) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

// Add two vectors returning a new one
function add([ax, ay], [bx, by]) {
    return [ax + bx, ay + by];
}

// Rotate a vector in an angle
function rotate([ax, ay], angle) {
    return [
        Math.cos(angle) * ax - Math.sin(angle) * ay, 
        Math.sin(angle) * ax + Math.cos(angle) * ay];
}

function getRadianFromAngle(angle = 270) {
    return angle * Math.PI / 180;
}

// -- Conections between nodes --
function connectPorts([nodeA, slotA], [nodeB, slotB]) {
    nodeA.ports[slotA] = [nodeB, slotB];
    nodeB.ports[slotB] = [nodeA, slotA];
}

function connectToInitialNode([nodeA, slotA]){
    nodeA.ports[slotA] = [initialNode, 0];
    initialNode.ports[0] = [nodeA, slotA];
}

// ----- Drawing ------
// Draw the initial node as a small circle
function setInitialNode(context) {
    context.beginPath();
    context.arc(initialNode.position.x, initialNode.position.y, 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}

function setInitialPositionForPivots() { 
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < 3; j++) {
            nodes[i].pivots[j] = nodes[i].getPortPosition(j);
        } 
    }  
}

// Draw the shape of a triangle according to it's ports and it's connections
function drawElements(context, node) {

    context.strokeStyle = 'black';   
    if (elementSelected) {
        // Highlight the selected element
        if (elementSelected[1] === node && elementSelected[0] === "node") {
            context.strokeStyle = 'green'; 
        }
    }

    // -- Triangles --
    context.beginPath();
    // Port 0 to 1
    context.moveTo(node.getPortPosition(0).x, node.getPortPosition(0).y);
    context.lineTo(node.getPortPosition(1).x, node.getPortPosition(1).y);
    
    // Port 1 to 2
    context.moveTo(node.getPortPosition(1).x, node.getPortPosition(1).y);
    context.bezierCurveTo(node.getPortPosition(1).x, node.getPortPosition(1).y, 
                            node.position.x, node.position.y, 
                            node.getPortPosition(2).x, node.getPortPosition(2).y);

    // Port 2 to 0
    context.moveTo(node.getPortPosition(2).x, node.getPortPosition(2).y);
    context.lineTo(node.getPortPosition(0).x, node.getPortPosition(0).y);

    context.closePath();
    context.stroke(); 

    // node.ports has the format of: [[node0, 0], [node1, 1], [node2, 2]]
    for (var i = 0; i < 3; i++) {
        var portPosition = node.getPortPosition(i);
        var portPivot = node.pivots[i];

        var nodeToConnect = node.ports[i][0];
        var slotToConnect = node.ports[i][1];
        if (nodeToConnect.type !== 0) {
            var portToConnectPosition = nodeToConnect.getPortPosition(slotToConnect);
            var portToConnectPivot = nodeToConnect.pivots[slotToConnect];
        } else {
            var portToConnectPivot = initialNode.position;
            var portToConnectPosition = initialNode.position;
        }
        // Updates the pivot position
        // node.pivots[i] = add([node.pivots[i].x, node.pivots[i].y], [node.position.x, node.position.y]);
    
        // -- Drawing pivots and lines -- 
        context.strokeStyle = 'black';
        context.fillStyle = 'black'; 
        // Create a line (curved, if it has a pivot) from the node beeing drawn and "nodeToConnect"
        context.beginPath();
        context.moveTo(portPosition.x, portPosition.y);
        context.bezierCurveTo(portPivot.x, portPivot.y, 
                            portToConnectPivot.x, portToConnectPivot.y,
                            portToConnectPosition.x, portToConnectPosition.y);
        context.stroke(); 

        // Highlight the selected pivot
        if (elementSelected) {
            if (elementSelected[1] === node && elementSelected[2] === i) { // Pivot on a selected node
                context.strokeStyle = 'green';
                context.fillStyle = 'green'; 
            }
        }
        // Shows the position of the pivots
        context.beginPath();
        context.arc(node.pivots[i].x, node.pivots[i].y, 3, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
    }
}

