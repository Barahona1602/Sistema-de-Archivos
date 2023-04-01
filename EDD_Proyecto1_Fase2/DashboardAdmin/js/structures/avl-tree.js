//--------------------------------------------------------------------------
//                      CLASE NODO
//--------------------------------------------------------------------------
class AvlNode {
    constructor(item) {
      this.item = item;
      this.left = null;
      this.right = null;
      this.height = 1;
    }
  }
  
  //--------------------------------------------------------------------------
  //                   VARIABLES GLOBALES
  //--------------------------------------------------------------------------
  let nodes = "";
  let connections = "";
  
  //--------------------------------------------------------------------------
  //                   CLASE ARBOL AVL
  //--------------------------------------------------------------------------
  class AvlTree {
    constructor() {
      this.root = null;
    }
  
    insert(item) {
      let nuevoNodo = new AvlNode(item);
      this.root = this.#insertRecursive(this.root, nuevoNodo);
    }
  
    height(node) {
      return node ? node.height : 0;
    }
  
    getMaxHeight(nodo) {
        if (!nodo) {
          return 0;
        }
        return this.height(nodo.left) - this.height(nodo.right);
      }
      
  
    //--------------------------------------------------------------------------
    //                  METODO DE INSERCIÓN
    //--------------------------------------------------------------------------
    #insertRecursive(nuevoNodo, nodo) {
      if (!nodo) {
        return nuevoNodo;
      }
      if (nuevoNodo.item.carnet < nodo.item?.carnet) {
        nodo.left = this.#insertRecursive(nuevoNodo, nodo.left);
      } else if (nuevoNodo.item.carnet > nodo.item?.carnet) {
        nodo.right = this.#insertRecursive(nuevoNodo, nodo.right);
      } else {
        // Si el carnet ya existe, no se inserta el nuevo nodo
        return nodo;
      }
      
      nodo.height = this.getMaxHeight(nodo.left, nodo.right) + 1;
      return this.#balancear(nodo);
    }
  
    //--------------------------------------------------------------------------
    //                   ROTACIONES
    //--------------------------------------------------------------------------
    #rotateRight(nodo) {
        let nodoLeft = nodo.left;
        if (!nodoLeft) {
          return nodo;
        }
        nodo.left = nodoLeft.right;
        nodoLeft.right = nodo;
        nodo.height = this.height(nodo.left, nodo.right) + 1;
        nodoLeft.height = this.height(nodoLeft.left, nodoLeft.right) + 1;
        return nodoLeft;
      }
      
  
    #rotateLeft(nodo) {
      let nodoRight = nodo.right;
      nodo.right = nodoRight.left;
      nodoRight.left = nodo;
      nodo.height = this.height(nodo.left, nodo.right) + 1;
      nodoRight.height = this.height(nodoRight.left, nodoRight.right) + 1;
      return nodoRight;
    }

    #balancear(nodo) {
        let factorBalance = this.getMaxHeight(nodo);
        if (factorBalance > 1) {
            if (this.getMaxHeight(nodo.left) < 0) {
                nodo.left = this.#rotateLeft(nodo.left);
            }
            return this.#rotateRight(nodo);
        } else if (factorBalance < -1) {
            if (this.getMaxHeight(nodo.right) > 0) {
                nodo.right = this.#rotateRight(nodo.right);
            }
            return this.#rotateLeft(nodo);
        } else {
            return nodo;
        }
    }

    //--------------------------------------------------------------------------
    //                  REPORTE DEL ARBOL
    //--------------------------------------------------------------------------
    treeGraph() {       
        nodes = "";
        connections = "";
        this.#treeGraphRecursive(this.root);
        console.log(nodes,connections);
        return nodes + connections;
    }

    #treeGraphRecursive(current){
        if (current == null) {
            return;
        }
        if(current.left != null){
            this.#treeGraphRecursive(current.left);
            connections += `S_${current.item.carnet} -> S_${current.left.item.carnet};\n`;
        }
        nodes += `S_${current.item.carnet}[label="${current.item.nombre}\\n${current.item.carnet}\\nAltura:${current.height}"];\n`;
        if(current.right != null){
            this.#treeGraphRecursive(current.right);
            connections += `S_${current.item.carnet} -> S_${current.right.item.carnet};\n`;
        }
    }
    
    
    
    //--------------------------------------------------------------------------
    //                  RECORRIDO IN ORDER
    //--------------------------------------------------------------------------
    inOrder(){
        let html = this.#inOrderRecursive(this.root);
        return html;
    }
    #inOrderRecursive(current){
        let row = "";
        if(current.left != null){
            row += this.#inOrderRecursive(current.left);
        }
        row +=`
            <tr>
                <th>${current.item.carnet}</th>
                <td>${current.item.nombre}</td>
                <td>${current.item.password}</td>
            </tr>
        `;
        if(current.right != null){
            row += this.#inOrderRecursive(current.right);
        }
        return row;
    }
    //--------------------------------------------------------------------------
    //                  RECORRIDO PRE ORDER
    //--------------------------------------------------------------------------
    preOrder(){
        let html = this.#preOrderRecursive(this.root);
        return html;
    }
    #preOrderRecursive(current){
        let row = "";
        row +=`
            <tr>
                <th>${current.item.carnet}</th>
                <td>${current.item.nombre}</td>
                <td>${current.item.password}</td>
            </tr>
        `;
        if(current.left != null){
            row += this.#inOrderRecursive(current.left);
        }
        if(current.right != null){
            row += this.#inOrderRecursive(current.right);
        }
        return row;
    }

    //--------------------------------------------------------------------------
    //                  RECORRIDO POST ORDER
    //--------------------------------------------------------------------------
    postOrder(){
        let html = this.#postOrderRecursive(this.root);
        return html;
    }
    #postOrderRecursive(current){
        let row = "";
        if(current.left != null){
            row += this.#inOrderRecursive(current.left);
        }
        if(current.right != null){
            row += this.#inOrderRecursive(current.right);
        }
        row +=`
            <tr>
                <th>${current.item.carnet}</th>
                <td>${current.item.nombre}</td>
                <td>${current.item.password}</td>
            </tr>
        `;
        return row;
    }


}