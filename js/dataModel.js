
function DataModel (){
    if(localStorage.getItem('data') === null) {
        this.root = {
            input: "Sample Value",
            check: false,
            input2: {
                node1: {
                    node2: {
                        input: "Deep Value"
                    }
                }
            }
        }

    } else {
        this.root = JSON.parse(localStorage.getItem('data'))
    }
}

DataModel.prototype.update = function(path, value){

    // recursive function to define value on path
    var traversePath = function(path, value) {
        var nodes = path.split('.');

        if (nodes.length == 1) {
            this[nodes[0]] = value;
        } else {
            if(!this.hasOwnProperty(nodes[0]))
                this[nodes[0]] = {};
            traversePath.apply(this[nodes.shift()], [nodes.join('.'), value])
        }
    };

    traversePath.apply(this, [path, value]);

    localStorage.setItem('data', JSON.stringify(this.root));

};

DataModel.prototype.getValue = function(path){

    // recursive function to get value by path
    var traversePath = function(path) {
        var nodes = path.split('.');

        if (nodes.length == 1) {
            return this[nodes[0]];
        } else {
            if(!this.hasOwnProperty(nodes[0]))
                return null;
            return traversePath.apply(this[nodes.shift()], [nodes.join('.')])
        }
    };

    return traversePath.apply(this, [path])

};


var Data = new DataModel();