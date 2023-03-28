class Tnode{
    constructor(folderName){
        this.folderName = folderName;
        this.children = []; // TODOS LOS NODOS HIJOS
        this.id = null; // PARA GENERAR LA GRÁFICA
    }
}


class Tree{
    constructor(){
        this.root = new Tnode('/');
        this.root.id = 0;
        this.size = 1; // Para generar los ids
    }

    insert(folderName, fatherPath) {
        let fatherNode = this.getFolder(fatherPath);
        if (!fatherNode) {
          console.log("Ruta no existe");
          return;
        }
      
        // Busca si el nombre de la carpeta ya existe en los hijos del padre
        let existingFolderNames = fatherNode.children.map(child => child.folderName);
        let newName = folderName;
        let counter = 1;
        while (existingFolderNames.includes(newName)) {
          newName = `copia${counter} ${folderName}`;
          counter++;
        }
      
        let newNode = new Tnode(newName);
        this.size += 1;
        newNode.id = this.size;
        fatherNode.children.push(newNode);
      }

    search(path) {
        let node = this.getFolder(path);
        if (node !== null) {
            let newPath = path == '/' ? path + node.folderName : path;
            $('#path').val(newPath);
            $('#carpetas').html(this.getHTML(newPath));
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Carpeta no encontrada',
                text: `La ruta ${path} no existe.`,
            });
        }
    }
    


    getFolder(path){
        // Padre sea una '/'
        // console.log(path);
        if(path == this.root.folderName){
            return this.root;
        }else{
            let temp = this.root;
            let folders = path.split('/');
            folders = folders.filter( str => str !== '');
            let folder = null;
            while(folders.length > 0){
                let currentFolder = folders.shift()
                folder = temp.children.find(child => child.folderName == currentFolder);
                if(typeof folder == 'undefined' || folder == null){
                    return null;
                }
                temp = folder;
            }
            return temp;
        }
    }

    graph(){
        let nodes = "";
        let connections = "";

        let node = this.root;
        let queue = [];
        queue.push(node);
        while(queue.length !== 0){
            let len = queue.length;
            for(let i = 0; i < len; i ++){
                let node = queue.shift();
                nodes += `S_${node.id}[label="${node.folderName}"];\n`;
                node.children.forEach( item => {
                    connections += `S_${node.id} -> S_${item.id};\n`
                    queue.push(item);
                });
            }
        }
        return 'node[shape="record"];\n' + nodes +'\n'+ connections;
    }

    getHTML(path){
        let node = this.getFolder(path);
        let code = "";
        node.children.map(child => {
            code += ` <div class="col-2 folder" onclick="entrarCarpeta('${child.folderName}')">
                        <img src="./images/icons/folder.ico" width="100%"/>
                        <p class="h6 text-center">${child.folderName}</p>
                    </div>`
        })
        return code;
    }

    renameFolder(oldPath, newName) {
        let node = this.getFolder(oldPath);
        if (node !== null) {
          let newPath = '';
          if (oldPath !== '/') {
            // obtener la ruta anterior sin el nombre de la carpeta
            let pathArr = oldPath.split('/');
            pathArr.pop();
            let parentPath = pathArr.join('/');
      
            // construir la nueva ruta con el nuevo nombre de la carpeta
            newPath = `${parentPath}/${newName}`;
          } else {
            newPath = `/${newName}`;
          }
          
          node.folderName = newName;
          node.path = newPath;
          $('#path').val(newPath);
          $('#carpetas').html(this.getHTML(newPath));
        } else {
          console.log('La carpeta no existe');
        }
      }
}