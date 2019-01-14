console.log("teste")

class Node {
    constructor(type, pos, dir) {
        this.pos = pos;
        this.dir = dir;
        this.type = type;
        this.ports = [null, null, null]; // [[node0, 0], [node1, 1], [node2, 2]]
    }


}

var nodes = [];

var no_0 = new Node(0, {x: 30, y: 30}, {x: 0, y: 1});
nodes.push(no_0);

var no_1 = new Node(0, {x: 80, y: 60}, {x: 0, y: 1});
nodes.push(no_1);

window.onload = function(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    console.log(context);

    setInterval(() => {
        for (node of nodes) {
            context.beginPath();
            context.arc(node.pos.x, node.pos.y, 15, 0, 2 * Math.PI);
            context.stroke();
        };
    }, 1000/30);
}
