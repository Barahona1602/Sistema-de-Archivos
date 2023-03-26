var nombreEstudiante = sessionStorage.getItem('nombreEstudiante');
console.log(nombreEstudiante);
var nombreUsuario = nombreEstudiante;
var elementoBienvenido = document.querySelector('h1');
elementoBienvenido.textContent = "Bienvenido " + nombreUsuario;
let tree =  new Tree();


function crearCarpeta(e){
    e.preventDefault();
    let folderName =  $('#folderName').val();
    let path =  $('#path').val();
    tree.insert(folderName, path);
    $('#carpetas').html(tree.getHTML(path))
}

function entrarCarpeta(folderName){
    let path = $('#path').val();
    let curretPath = path == '/'? path + folderName : path + "/"+ folderName;
    console.log(curretPath)
    $('#path').val(curretPath);
    $('#carpetas').html(tree.getHTML(curretPath))
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
          parentNode.children = parentNode.children.filter(child => child !== folderNode);
          $('#path').val(path.split('/').slice(0, -1).join('/'));
          $('#carpetas').html(tree.getHTML($('#path').val()));
          $('#path').val('/' + path.split('/').slice(1, -1).join('/'));
          Swal.fire(
            'Carpeta eliminada',
            'La carpeta ' + tmp + ' ha sido eliminada',
            'success'
          );
        }
      });
    }
  }
}


function renombreCarpeta() {
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
    }
  });
}




