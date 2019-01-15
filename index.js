class Node {
    constructor(type, position, angle) {
        this.type = type; // 0: white node, 1: black node
        this.position = position;
        this.angle = angle; // angle for port 0
        this.ports = [null, null, null]; // [[node0, 0], [node1, 1], [node2, 2]]
        this.radius = 20;
    }

    getPortPosition(slot) {
        // var add_angle = [0, Math.PI * 2 / 3, Math.PI * 4 / 3][slot];
        var add_angle = [0, getRadianFromAngle(240), getRadianFromAngle(120)][slot];
        var position = add([this.position.x, this.position.y], rotate([this.radius, 0], this.angle + add_angle));
        return {x: position[0], y: position[1]};
    }

}

// Auxiliar to render position
const height = 400;
const width = 400;
var nodeSelected = null;

// Nodes
var nodes = makeNodes();
// var initialNode = new InitialNode({x: width * 0.47 - 5, y: height * 0.05}, 5);
var initialNode = new Node(0, {x: width * 0.47, y: height * 0.05}, getRadianFromAngle(90))

window.onload = function(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d"); 

    setInitialNode(context);
    // setLines(context);

    // Calls a function or evaluates an expression at specified intervals
    setInterval(() => {
        for (node of nodes) {    
            if (node.type == 1) {
                context.strokeStyle = 'blue';
            } else {
                context.strokeStyle = 'black'; 
            }

            drawTriangle(context, node); 
        };

    }, 1000/30);
    
    canvas.onclick = function(e) {
        var positionClicked = [e.offsetX, e.offsetY];
        var maxRadiusDistance = 20;

        nodeSelected = null;

        for (var i = 0; i < nodes.length; i++) {     
            var distanceFromNode = getDistanceBetween([nodes[i].position.x, nodes[i].position.y], positionClicked);
            if (distanceFromNode <= maxRadiusDistance) {
                nodeSelected = nodes[i];
                console.log(">>> Node clicked: "+i);
            }
        }
        if (nodeSelected !== null) {
            console.log(">> Node selected: "+[nodeSelected.position.x, nodeSelected.position.y]);
        }
    
    };
}

function getDistanceBetween([ax, ay], [bx, by]) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

// Defines the properties for each node
function makeNodes() {
    var nodes = [];

    var node0 = new Node(0, {x: width * 0.5, y: height * 0.2}, getRadianFromAngle(90));
    nodes.push(node0);


    var node1 = new Node(0, {x: width * 0.3, y: height * 0.40}, getRadianFromAngle());
    nodes.push(node1);

    var node2 = new Node(1, {x: width * 0.20, y: height * 0.60}, getRadianFromAngle());
    nodes.push(node2);

    // -10 is to align an upside down node with the others
    var node3 = new Node(0, {x: width * 0.40, y: height * 0.60 - 10}, getRadianFromAngle(90));
    nodes.push(node3); 


    var node4 = new Node(0, {x: width - (width * 0.3), y: height * 0.40}, getRadianFromAngle());
    nodes.push(node4);


    // [[node0, 0], [node1, 1], [node2, 2]]
    connectPorts([node0, 0], [node1, 0]);
    connectPorts([node0, 1], [node4, 0]);
    connectPorts([node0, 2], [node0, 2]);

    connectPorts([node1, 1], [node2, 0]);
    connectPorts([node1, 2], [node3, 2]);

    connectPorts([node2, 1], [node3, 0]);
    connectPorts([node2, 2], [node3, 1]);

    connectPorts([node4, 1], [node4, 2]);

    return nodes;
}


// ----- Auxiliar functions -----
// Add two vectors returing a new one
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

function connectPorts([nodeA, slotA], [nodeB, slotB]) {
    nodeA.ports[slotA] = [nodeB, slotB];
    nodeB.ports[slotB] = [nodeA, slotA];
}

// ----- Drawing ------
// Draw the initial node as a small circle
function setInitialNode(context) {
    context.beginPath();
    context.arc(initialNode.position.x, initialNode.position.y, 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}

// Draw the shape of a triangle according to it's ports
function drawTriangle(context, node) {
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

    // Draw connection between nodes
    // node.ports has the format of: [[node0, 0], [node1, 1], [node2, 2]]

    for (var i = 0; i < node.ports.length; i++) {
        context.beginPath();
        context.moveTo(node.getPortPosition(i).x, node.getPortPosition(i).y);
        var nodeToConnect = node.ports[i][0];
        var portToConnect = node.ports[i][1];
        var portPosition = nodeToConnect.getPortPosition(portToConnect);
        context.lineTo(portPosition.x, portPosition.y) ;
        context.stroke(); 
    }
}

// Draw all lines conecting the triangles
function setLines(context) {
    // bezierCurveTo: 
        // Control point 1 (first two numbers), Control point 2 (second two numbers) and end point (last two numbers)
    
    // Initial node to Node 0 (1)
    context.beginPath();
    context.moveTo(initialNode.position.x, initialNode.position.y);
    context.lineTo(nodes[0].getPortPosition(2).x, nodes[0].getPortPosition(2).y)
    context.stroke();

    // Node 0 (0) to Node 1 (0)   
    context.beginPath();
    context.moveTo(nodes[0].getPortPosition(0).x, nodes[0].getPortPosition(0).y);
    context.bezierCurveTo(nodes[0].position.x, nodes[0].position.y + 50, 
                          nodes[1].position.x, nodes[1].position.y - 50, 
                          nodes[1].getPortPosition(0).x, nodes[1].getPortPosition(0).y);
    context.stroke();

    // Node 1 (1) to Node 2 (0)   
    context.beginPath();
    context.moveTo(nodes[1].getPortPosition(1).x, nodes[1].getPortPosition(1).y);
    context.bezierCurveTo(nodes[1].getPortPosition(1).x, nodes[1].getPortPosition(1).y + 30, 
                          nodes[2].position.x, nodes[2].position.y - 30, 
                          nodes[2].getPortPosition(0).x, nodes[2].getPortPosition(0).y);
    context.stroke();

    // Node 1 (2) to Node 3 (0)   
    context.beginPath();
    context.moveTo(nodes[1].getPortPosition(2).x, nodes[1].getPortPosition(2).y);
    context.bezierCurveTo(nodes[1].getPortPosition(2).x - 10, nodes[1].getPortPosition(2).y + 30,  
                          nodes[3].getPortPosition(2).x, nodes[3].getPortPosition(2).y - 10, 
                          nodes[3].getPortPosition(2).x, nodes[3].getPortPosition(2).y);
    context.stroke();

    // Node 0 (1) to Node 4 (0)   
    context.beginPath();
    context.moveTo(nodes[0].getPortPosition(1).x, nodes[0].getPortPosition(1).y);
    context.bezierCurveTo(nodes[0].getPortPosition(1).x, nodes[0].getPortPosition(1).y - 50,  
                          nodes[0].getPortPosition(1).x + 60, nodes[0].getPortPosition(1).y - 50, 
                          nodes[4].getPortPosition(0).x, nodes[4].getPortPosition(0).y);
    context.stroke();

    // Node 2 (1) to Node 3 (0)   
    context.beginPath();
    context.moveTo(nodes[2].getPortPosition(1).x, nodes[2].getPortPosition(1).y);
    context.bezierCurveTo(nodes[2].getPortPosition(1).x, nodes[2].getPortPosition(1).y + 50,  
                          nodes[3].getPortPosition(0).x, nodes[3].getPortPosition(0).y + 50, 
                          nodes[3].getPortPosition(0).x, nodes[3].getPortPosition(0).y);
    context.stroke();    

    // Node 2 (2) to Node 3 (1)   
    context.beginPath();
    context.moveTo(nodes[2].getPortPosition(2).x, nodes[2].getPortPosition(2).y);
    context.bezierCurveTo(nodes[2].getPortPosition(2).x, nodes[2].getPortPosition(2).y + 70,  
                          nodes[3].getPortPosition(1).x + 30, nodes[3].getPortPosition(1).y + 70, 
                          nodes[3].getPortPosition(1).x, nodes[3].getPortPosition(1).y);
    context.stroke(); 

    // Node 4 (1) to Node 4 (2)   
    context.beginPath();
    context.moveTo(nodes[4].getPortPosition(1).x, nodes[4].getPortPosition(1).y);
    context.bezierCurveTo(nodes[4].getPortPosition(1).x, nodes[4].getPortPosition(1).y + 20,  
                          nodes[4].getPortPosition(2).x, nodes[4].getPortPosition(2).y + 20, 
                          nodes[4].getPortPosition(2).x, nodes[4].getPortPosition(2).y);
    context.stroke(); 


}
