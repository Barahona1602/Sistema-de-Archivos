class AvlNode {
    constructor(item) {
        this.item = item;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AvlTree {
    constructor() {
        this.root = null;
    }

    height(node) {
        return node ? node.height : 0;
    }

    balanceFactor(node) {
        return this.height(node.left) - this.height(node.right);
    }

    balanceRecursive(node) {
        let balanceFactor = this.balanceFactor(node);
        if (balanceFactor > 1) {
            if (this.balanceFactor(node.left) < 0) {
                node.left = this.rotateLeft(node.left);
            }
            return this.rotateRight(node);
        } else if (balanceFactor < -1) {
            if (this.balanceFactor(node.right) > 0) {
                node.right = this.rotateRight(node.right);
            }
            return this.rotateLeft(node);
        } else {
            return node;
        }
    }

    rotateLeft(node) {
        let nodoright = node.right;
        node.right = nodoright.left;
        nodoright.left = node;
        node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
        nodoright.height = Math.max(this.height(nodoright.left), this.height(nodoright.right)) + 1;
        return nodoright;
    }

    rotateRight(node) {
        let nodoleft = node.left;
        node.left = nodoleft.right;
        nodoleft.right = node;
        node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
        nodoleft.height = Math.max(this.height(nodoleft.left), this.height(nodoleft.right)) + 1;
        return nodoleft;
    }


    insert(item) {
        let newNode = new AvlNode(item);
        this.root = this.insertRecursive(this.root, newNode);
        tablaHash.insert(item.carnet, item.nombre, item.password);
        const tableBody = $('#studentsTable tbody'); 
        tableBody.empty(); 
        tablaHash.table.forEach(std => {
            const row = $('<tr>'); 
            const carnetCell = $('<td>').text(std.carnet);
            const nombreCell = $('<td>').text(std.nombre);
            const passCell = $('<td>').text(std.password);
            row.append(carnetCell, nombreCell, passCell); 
            tableBody.append(row); 
        });
    }

    
    


    insertRecursive(node, newNode) {
        if (!node) {
            return newNode;
        }
        if (newNode.item.carnet < node.item.carnet) {
            node.left = this.insertRecursive(node.left, newNode);
        } else if (newNode.item.carnet > node.item.carnet) {
            node.right = this.insertRecursive(node.right, newNode);
        } else {
            // Si el carnet ya existe, no se inserta el nuevo node
            return node;
        }
        node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
        return this.balanceRecursive(node);
    }


    inOrder() {
        let nodes = [];
        this.inOrderRecursive(this.root, nodes);
        return nodes;
    }

    inOrderRecursive(node, nodes) {
        if (node) {
            this.inOrderRecursive(node.left, nodes);
            nodes.push(node);
            this.inOrderRecursive(node.right, nodes);
        }
    }


}