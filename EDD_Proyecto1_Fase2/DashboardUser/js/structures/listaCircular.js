class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  insert(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else {
      newNode.next = this.head;
      if (this.tail) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
    }
    this.length++;
  }

  generateGraph() {
    let graph = 'digraph G {\n';
    graph += 'rankdir="LR";\n';
    graph += 'node[shape=box];\n';
    if (this.head) {
      let currentNode = this.head;
      let i = 0;
      do {
        graph += `${i} [label="${currentNode.data}"];\n`;
        if (currentNode.next && currentNode.next !== this.head) {
          graph += `${i} -> ${i+1};\n`;
        }
        currentNode = currentNode.next;
        i++;
      } while (currentNode !== this.head);
      // add arrow from last node to head node
      graph += `${i-1} -> 0;\n`;
    }
    graph += '}';
    console.log(graph)
    return graph;
  }   
}

  

  
  
  