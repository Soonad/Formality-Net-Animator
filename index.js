class Node {
    constructor(type, position, angle) {
        this.type = type; // 0: white node, 1: black node
        this.position = position;
        this.angle = angle; // angle for port 0? 
        this.ports = [null, null, null]; // [[node0, 0], [node1, 1], [node2, 2]]
    }
}

class PositionType {
    // up or down. Returns a position calculation for the triangle
}

// Auxiliar to render position
const height = 400;
const width = 400;

// Nodes
var nodes = [];

var node0 = new Node(0, {x: width * 0.5, y: height * 0.2}, {x: 0, y: 1});
nodes.push(node0);

var node1 = new Node(0, {x: width * 0.3, y: height * 0.35}, {x: 0, y: 1});
nodes.push(node1);

var node2 = new Node(0, {x: width - (width * 0.3), y: height * 0.35}, {x: 0, y: 1});
nodes.push(node2);

// Closer to node 1
var node3 = new Node(1, {x: width * 0.20, y: height * 0.50}, {x: 0, y: 1});
nodes.push(node3);
var node4 = new Node(0, {x: width * 0.40, y: height * 0.50}, {x: 0, y: 1});
nodes.push(node4); 

window.onload = function(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    console.log(context);

    setInitialNode(context);

    // Calls a function or evaluates an expression at specified intervals
    setInterval(() => {
        for (node of nodes) {
            context.beginPath();
            context.arc(node.position.x, node.position.y, 15, 0, 2 * Math.PI);
            context.stroke();
        };
    }, 1000/30);
    
}

function setInitialNode(context) {
    context.beginPath();
    context.arc(width * 0.47, height * 0.05, 5, 0, 2 * Math.PI);
    context.stroke();
}
