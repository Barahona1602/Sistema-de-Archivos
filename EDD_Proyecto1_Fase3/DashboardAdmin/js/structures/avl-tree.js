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

    postOrder() {
        let nodes = [];
        this.postOrderRecursive(this.root, nodes);
        return nodes;
    }

    postOrderRecursive(node, nodes) {
        if (node) {
            this.postOrderRecursive(node.left, nodes);
            this.postOrderRecursive(node.right, nodes);
            nodes.push(node);
        }
    }

    preOrder() {
        let nodes = [];
        this.preOrderRecursive(this.root, nodes);
        return nodes;
    }

    preOrderRecursive(node, nodes) {
        if (node) {
            nodes.push(node);
            this.preOrderRecursive(node.left, nodes);
            this.preOrderRecursive(node.right, nodes);
        }
    }

    getId() {
        return "id" + Math.random().toString(16).slice(2);
    }

    graph() {
        return this.graphRecursive(this.root, this.getId());
    }

    graphRecursive(node, name) {
        if (node) {
            let value = ' node' + name + '  [label = \"' + node.item.nombre + '\\n' + node.item.carnet + '\\nAltura: ' + node.height + '\" shape = \"box\"]';
            let nombreleft = this.getId();
            let graphleft = this.graphRecursive(node.left, nombreleft);
            if (graphleft) {
                value += graphleft + ' node' + name + ' -> ' + 'node' + nombreleft;
            }
            let nombreright = this.getId();
            let graphright = this.graphRecursive(node.right, nombreright);
            if (graphright) {
                value += graphright + ' node' + name + ' -> ' + 'node' + nombreright;
            }
            return value;
        }
        else{
            return null;
        }
   
    }
}