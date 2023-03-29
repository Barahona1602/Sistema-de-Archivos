var nombreEstudiante = sessionStorage.getItem('nombreEstudiante');
if (!sessionStorage.getItem('nombreEstudiante')) {
  Swal.fire({
    icon: 'warning',
    title: 'No se ha iniciado sesión',
    text: 'Por favor, inicia sesión antes de acceder a esta página',
    allowOutsideClick: false, 
    timer: 5000,
    backdrop: `
      rgba(0,0,0,0.98)
      center top
      no-repeat
    ` 
  }).then(() => {
    window.location.href = '../Login/login.html';
  });
}



console.log(nombreEstudiante);
var nombreUsuario = nombreEstudiante;
var elementoBienvenido = document.querySelector('h1');
elementoBienvenido.textContent = "Bienvenido " + nombreUsuario;



let listaCircular = new CircularLinkedList();
let tree =  new Tree();


function circularToJSON(obj) {
  const cache = new Set();
  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return undefined;
      }
      cache.add(value);
    }
    return value;
  });
}

function jsonToCircular(json) {
  const cache = new Map();
  return JSON.parse(json, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return cache.get(value);
      }
      cache.set(value, value);
    }
    return value;
  });
}


function crearCarpeta(e){
  e.preventDefault();
  let folderName =  $('#folderName').val();
  let path =  $('#path').val();
  if (folderName === '') {
      Swal.fire({
          icon: 'warning',
          title: 'Nombre incorrecto',
          text: 'Por favor, ingrese un nombre antes de crear la carpeta',
      });
  } else {
      let newName = tree.insert(folderName, path);
      const now = new Date();
      const year = now.getFullYear(); 
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0'); 
      const hours = now.getHours().toString().padStart(2, '0'); 
      const minutes = now.getMinutes().toString().padStart(2, '0'); 
      const seconds = now.getSeconds().toString().padStart(2, '0'); 
      const date = "Fecha: " + `${day}/${month}/${year}`;
      const hour = "Hora: " + `${hours}:${minutes}:${seconds}`;
      var creo = "Se creó carpeta\\n" + newName + "\\n" + date + "\\n" + hour;
      listaCircular.insert(creo);
      localStorage.setItem('listaCircular'+nombreUsuario, JSON.stringify(JSON.decycle(listaCircular)));
      localStorage.setItem('tree'+nombreUsuario, JSON.stringify(tree));    
      $('#carpetas').html(tree.getHTML(path));
  }
}



let listaCirData = JSON.retrocycle(JSON.parse(localStorage.getItem('listaCircular'+nombreUsuario)));
if (listaCirData !== null && listaCirData !== undefined) {
  listaCircular = Object.assign(new CircularLinkedList(), listaCirData);
}

let treeData = JSON.parse(localStorage.getItem('tree'+nombreUsuario));
if (treeData !== null && treeData !== undefined) {
  tree = Object.assign(new Tree(), treeData);
  let path = $('#path').val();
  $('#carpetas').html(tree.getHTML(path));
  console.log(tree)
}




function entrarCarpeta(folderName) {
  let path = $('#path').val();
  let currentPath = path == '/' ? path + folderName : path + "/" + folderName;
  let folderNode = tree.getFolder(currentPath);
  if (folderNode !== null) {
    // si se encuentra la carpeta, se actualiza la ruta y se muestra el contenido de la carpeta
    $('#path').val(currentPath);
    $('#carpetas').html(tree.getHTML(currentPath));
  } else {
    // si no se encuentra la carpeta, se muestra un mensaje de error
    Swal.fire({
      icon: 'warning',
      title: 'Carpeta no encontrada',
      text: `La carpeta ${folderName} no existe en la ruta ${path}.`,
    });
  }
}


function retornarInicio(){
    $('#path').val("/");
    $('#carpetas').html(tree.getHTML("/"))
}


function showGraph(){
  let url = 'https://quickchart.io/graphviz?graph=';
  let body;
  if (tree.root.children.length === 0) {
    Swal.fire({
      icon: 'info',
      text: 'No hay carpetas creadas',
    })
      return;
  } else {
      body = `digraph G { ${tree.graph()} }`;
      $("#graph2").attr("src", url + body);
  }
}




// FUNCIÓN PARA Logout
function logout() {
  window.location.href = "../Login/login.html";
}



function eliminarCarpeta() {
  let path = $('#path').val();
  let folderNode = tree.getFolder(path);
  if (folderNode === null) {
    Swal.fire({
      icon: 'warning',
      title: 'No hay carpeta seleccionada',
      text: 'Seleccione una carpeta para eliminar'
    });
  } else if (folderNode === tree.root) {
    Swal.fire({
      icon: 'warning',
      title: 'No hay carpeta seleccionada',
      text: 'Seleccione una carpeta para eliminar'
    });
  } else {
    let parentNode = tree.getFolder(path.split('/').slice(0, -1).join('/'));
    if (parentNode === null) {
      console.log('No se puede eliminar la carpeta: padre no encontrado');
    } else {
      // Mostrar alerta para confirmar eliminación de carpeta
      var tmp=folderNode.folderName
      Swal.fire({
        title: '¿Está seguro que desea eliminar la carpeta ' + folderNode.folderName + '?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const now = new Date();
          const year = now.getFullYear(); 
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0'); 
          const hours = now.getHours().toString().padStart(2, '0'); 
          const minutes = now.getMinutes().toString().padStart(2, '0'); 
          const seconds = now.getSeconds().toString().padStart(2, '0'); 
          const date = "Fecha: " + `${day}/${month}/${year}`;
          const hour = "Hora: " + `${hours}:${minutes}:${seconds}`;
          var creo = "Se eliminó carpeta\\n" + tmp + "\\n" + date + "\\n" + hour;
          listaCircular.insert(creo);
          localStorage.setItem('listaCircular'+nombreUsuario, JSON.stringify(JSON.decycle(listaCircular)));
          localStorage.removeItem('tree' + nombreUsuario + folderName);
          parentNode.children = parentNode.children.filter(child => child !== folderNode);
          $('#path').val(path.split('/').slice(0, -1).join('/'));
          $('#carpetas').html(tree.getHTML($('#path').val()));
          $('#path').val('/' + path.split('/').slice(1, -1).join('/'));
          Swal.fire(
            'Carpeta eliminada',
            'La carpeta ' + tmp + ' ha sido eliminada',
            'success'
          );
          localStorage.setItem('tree' + nombreUsuario, JSON.stringify(tree));
          $('#carpetas').html(tree.getHTML(path));
        }
      });
    }
  }
}


function renombreCarpeta() {
  console.log(localStorage.getItem('tree'+nombreUsuario, JSON.stringify(tree)));
  let oldPath = $('#path').val();

  // Verificar si hay carpeta seleccionada
  if (oldPath=="/") {
    Swal.fire({
      icon: 'info',
      title: 'Carpeta inválida',
      text: 'Seleccione una carpeta para renombrar',
    });
    return;
  }

  Swal.fire({
    title: 'Ingrese el nuevo nombre de la carpeta:',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Cambiar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Por favor, ingrese un nombre válido';
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      let newName = result.value;
      tree.renameFolder(oldPath, newName);
      localStorage.setItem('tree'+nombreUsuario, JSON.stringify(tree));
    }
  });
}



function buscarCarpeta() {
  let path = $('#path').val();
  if (path === '/') {
    $('#path').val(path);
  } else {
    let result = tree.search(path);
  }
}



function showGraphC(){
  let url = 'https://quickchart.io/graphviz?graph=';
  let body;
  
  if(listaCircular.length === 0){
    Swal.fire({
      icon: 'info',
      title: 'Sin acciones',
      text: 'No se han realizado acciones en el sistema',
    });
  } else {
    body = `${listaCircular.generateGraph()}`;
    $("#graph4").attr("src", url + body);
  }
}

