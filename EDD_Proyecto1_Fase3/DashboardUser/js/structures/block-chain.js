// CLASE DEL BLOCQUE DEL BLOCK-CHAIN
class Block{
    constructor(index, timestamp, transmitter, receiver, message, previusHash, hash){
        this.index = index;
        this.timestamp = timestamp;
        this.transmitter = transmitter;
        this.receiver = receiver;
        this.message = message;
        this.previusHash = previusHash; // HASH DEL BLOQUE ANTERIOR
        this.hash = hash; // HASH DEL BLOQUE ACTUAL
        
        // APUNTADORES DEL NODO
        this.next = null;
        this.prev = null;
    }
}

class BlockChain{
    // CONSTRUCTOR PARA LA LISTA DOBLE
    constructor(){
        this.head = null;
        this.end = null;
        this.size = 0;
    }

    // INSERCIÓN SÓLO AL FINAL **FUNCIÓN ASÍNCRONA**
    async insert(timestamp, transmitter, receiver, message){
        let newNode = new Block(this.size,timestamp, transmitter, receiver, message, "","");
        if(this.head == null){
            // HASH ANTERIOR DEL PRIMER BLOQUE
            newNode.previusHash = "00000";
            // ASIGNAR EL HASH AL BLOQUE ACTUAL
            newNode.hash = await this.getSha256(newNode);
            // INSERTAR EL NODO
            this.head = newNode;
            this.end = newNode;
            // AUMENTAR TAMAÑO
            this.size++;
        }else{
            // ASIGNAR PRIMERO EL HASH ANTERIOR
            newNode.previusHash = this.end.hash;
            // CREAR EL HASH ACTUAL
            newNode.hash = await this.getSha256(newNode);
            // INSERTAR EL NODO AL FINAL
            this.end.next = newNode;
            newNode.prev = this.end;
            this.end = newNode;
            // AUMENTAR TAMAÑO
            this.size++;
        }
    }

    // MÉTODO PARA OBTENER SHA256 DE UN BLOQUE
    // REF: https://stackoverflow.com/questions/63736585/why-does-crypto-subtle-digest-return-an-empty-object
    async getSha256(block){
        // PASAR EL OBJETO A STRING
        let str = JSON.stringify(block).toString();
        // OBTENER LOS BYTES DEL STRING 
        let bytes = new TextEncoder().encode(str);
        // OBTENER BYTES DEL HASH
        let hashBytes = await window.crypto.subtle.digest("SHA-256", bytes);
        // PASAR EL HASH A STRING 
        let hash = Array.prototype.map.call(new Uint8Array(hashBytes), x => ('00' + x.toString(16)).slice(-2)).join('');
        // RETORNAR EL HASH
        return hash;
    }

    // METODO PARA IMPRIMIR EN CONSOLA
    print(){        
        if(this.head !== null){
            let temp = this.head;
            while(temp !== null){
                console.log(temp);
                temp = temp.next;
            }
        }
    }

    // NÚMEROS DE CARNET DEL CHAT
    getMessages(transmitter, receiver){
        if(this.head !== null){
            let msgs = "";
            let temp = this.head;
            while(temp !== null){
                if(String(temp.receiver) === String(transmitter)){
                    if(String(temp.transmitter) === String(receiver)){
                        msgs += `<li class="list-group-item received">${temp.message}</li>`;
                    }
                }else if(String(temp.transmitter) === String(transmitter)){
                    if(String(temp.receiver) === String(receiver)){
                        msgs += `<li class="list-group-item sent" style="text-align: right">${temp.message}</li>`;
                    }
                }
                temp = temp.next;
            }
            if(msgs){
                return `
                    <ul class="list-group">
                        ${msgs}
                    </ul>
                `;
            }
        }
        return "No hay mensajes";
    }

    blockReport(index = 0){
        if(this.head){
            let temp = this.head;
            while(temp !== null){
                if(temp.index === index){
                    const mensaje = CryptoJS.SHA256(temp.message).toString();
                    // EL NOMBRE DE LA TABLA TIENE EL INDEX DEL BLOQUE, PARA PODER OBTENER EL SIGUIENTE O EL ANTERIOR
                    return `
                        <table class="table table-bordered text-light" id="block-table" name="${temp.index}">
                            <tbody>
                                <tr>
                                    <th scope="row" class="col-3">Index</th>
                                    <td class="col-9">${temp.index}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Timestamp</th>
                                    <td class="col-9">${temp.timestamp}</td>
                                </tr>
                                <tr>
                                    <th scope="row">emisor</th>
                                    <td>${temp.transmitter}</td>
                                </tr>
                                <tr>
                                    <th scope="row">receptor</th>
                                    <td>${temp.receiver}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Mensaje</th>
                                    <td>${mensaje}</td>
                                </tr>
                                <tr>
                                    <th scope="row">PreviousHash</th>
                                    <td>${temp.previusHash}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Hash</th>
                                    <td>${temp.hash}</td>
                                </tr>
                            </tbody>
                        </table>
                    `;
                }else{
                    temp = temp.next;
                }

            }
        }
        return "";
    }

    toDot() {
        let graph = "digraph Blockchain {\n";
        let node = this.head;
        let contador = 0;
        while (node != null) {     
            let label = "TimeStamp= " + node.timestamp + "\\nemisor: " + node.transmitter + "\\nreceptor: " + node.receiver + "\\nprevious: " + node.previusHash;
            graph += `  ${contador} [shape=box, label="${label}"]\n`;
            if (node.next != null) {
                graph += `  ${contador} -> ${contador+1}\n`;
            }
            contador++;
            node = node.next;    
        }
        graph += "}\n";
        console.log(graph)
        return graph;
    }
    


}

