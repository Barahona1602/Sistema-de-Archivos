// ------------------------------------------VALIDACIONES DE INICIO------------------------------------------------------
var nombreEstudiante = sessionStorage.getItem("nombreEstudiante");
var carnetEstudiante = sessionStorage.getItem("carnetEstudiante");
if (!sessionStorage.getItem("nombreEstudiante")) {
  Swal.fire({
    icon: "warning",
    title: "No se ha iniciado sesión",
    text: "Por favor, inicia sesión antes de acceder a esta página",
    allowOutsideClick: false,
    timer: 5000,
    backdrop: `
      rgba(0,0,0,0.98)
      center top
      no-repeat
    `,
  }).then(() => {
    window.location.href = "../Login/login.html";
  });
}

//DECLARACONES
var nombreUsuario = nombreEstudiante.split(" ")[0];
var elementoBienvenido = document.querySelector("h1");
elementoBienvenido.textContent = "Bienvenido, " + nombreUsuario;
let listaCircular = new CircularLinkedList();
let tree = new Tree();
let matrix = new SparseMatrix();
// --------------------------------------------------------------------------------------------------------------------

// ------------------------------------------FUNCIONES DE BOTONES------------------------------------------------------

//FUNCION PARA BOTON DE BUSCAR CARPETA
function buscarCarpeta() {
  let path = $("#path").val();
  if (path === "/") {
    $("#path").val(path);
  } else {
    let result = tree.search(path);
  }
}



//FUNCION PARA BOTON DE CREAR CARPETA
function crearCarpeta(e) {
  e.preventDefault();
  let folderName = $("#folderName").val();
  let path = $("#path").val();
  if (folderName === "") {
    Swal.fire({
      icon: "warning",
      title: "Nombre incorrecto",
      text: "Por favor, ingrese un nombre antes de crear la carpeta",
    });
  } else {
    let newName = tree.insert(folderName, path);
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const date = "Fecha: " + `${day}/${month}/${year}`;
    const hour = "Hora: " + `${hours}:${minutes}:${seconds}`;
    var creo = "Se creó carpeta\\n" + newName + "\\n" + date + "\\n" + hour;
    listaCircular.insert(creo);
    localStorage.setItem("listaCircular" + carnetEstudiante, JSON.stringify(JSON.decycle(listaCircular)));
    localStorage.setItem("tree" + carnetEstudiante, JSON.stringify(JSON.decycle(tree)));
    $("#carpetas").html(tree.getHTML(path));
  }
}

//LLAMADAS DEL LOCALSTORAGE
let listaCirData = JSON.retrocycle(JSON.parse(localStorage.getItem("listaCircular" + carnetEstudiante)));
if (listaCirData !== null && listaCirData !== undefined) {
  listaCircular = Object.assign(new CircularLinkedList(), listaCirData);
}

let treeData = JSON.retrocycle(JSON.parse(localStorage.getItem("tree" + carnetEstudiante)));
if (treeData !== null && treeData !== undefined) {
  tree = Object.assign(new Tree(), treeData);
  let path = $("#path").val();
  $("#carpetas").html(tree.getHTML(path));
  //console.log(tree);
}


//FUNCION PARA BOTON DE DAR PERMISO
function darPermiso() {
  // Obtener valores seleccionados en los elementos de formulario
  const archivo = document.getElementById("archivoSelect").value;
  const carnet = document.getElementById("carnetSelect").value;
  const permiso = document.getElementById("permisoSelect").value;
  

  // Validar que se hayan seleccionado opciones en los elementos de formulario
  if (!archivo) {
    Swal.fire({
      icon: "error",
      title: "Archivo no seleccionado",
      text: "Por favor seleccione un archivo",
    });
    return;
  }

  if (!carnet) {
    Swal.fire({
      icon: "error",
      title: "Carnet no seleccionado",
      text: "Por favor seleccione un carnet",
    });
    return;
  }

  if (!permiso) {
    Swal.fire({
      icon: "error",
      title: "Permiso no seleccionado",
      text: "Por favor seleccione un permiso",
    });
    return;
  }
  let path = $("#path").val();
  //tree.insertarDatosMD(path, '"'+archivo+'"', '"'+carnet+'"', '"'+permiso+'"')
  tree.insertarDatosMD(archivo, carnet, permiso, path)
  //matrix.insertarMD(archivo, carnet, permiso);
  //console.log(lastElement);
  // console.log(tree.matrixGrpah(path));
  console.log(`Archivo seleccionado: ${archivo}`);
  console.log(`Carnet seleccionado: ${carnet}`);
  console.log(`Permiso seleccionado: ${permiso}`);
  localStorage.setItem("tree" + carnetEstudiante, JSON.stringify(JSON.decycle(tree)));
  mostrarArchivo();
}




//FUNCION PARA BOTON DE ELIMINAR CARPETA
function eliminarCarpeta() {
  let path = $("#path").val();
  let folderNode = tree.getFolder(path);
  if (folderNode === null) {
    Swal.fire({
      icon: "warning",
      title: "No hay carpeta seleccionada",
      text: "Seleccione una carpeta para eliminar",
    });
  } else if (folderNode === tree.root) {
    Swal.fire({
      icon: "warning",
      title: "No hay carpeta seleccionada",
      text: "Seleccione una carpeta para eliminar",
    });
  } else {
    let parentNode = tree.getFolder(path.split("/").slice(0, -1).join("/"));
    if (parentNode === null) {
      console.log("No se puede eliminar la carpeta: padre no encontrado");
    } else {
      var tmp = folderNode.folderName;
      Swal.fire({
        title:
          "¿Está seguro que desea eliminar la carpeta " +
          folderNode.folderName +
          "?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const now = new Date();
          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, "0");
          const day = now.getDate().toString().padStart(2, "0");
          const hours = now.getHours().toString().padStart(2, "0");
          const minutes = now.getMinutes().toString().padStart(2, "0");
          const seconds = now.getSeconds().toString().padStart(2, "0");
          const date = "Fecha: " + `${day}/${month}/${year}`;
          const hour = "Hora: " + `${hours}:${minutes}:${seconds}`;
          var creo =
            "Se eliminó carpeta\\n" + tmp + "\\n" + date + "\\n" + hour;
          listaCircular.insert(creo);
          localStorage.setItem(
            "listaCircular" + carnetEstudiante,
            JSON.stringify(JSON.decycle(listaCircular))
          );
          localStorage.removeItem("tree" + carnetEstudiante + folderName);
          parentNode.children = parentNode.children.filter(
            (child) => child !== folderNode
          );
          $("#path").val(path.split("/").slice(0, -1).join("/"));
          $("#carpetas").html(tree.getHTML($("#path").val()));
          $("#path").val("/" + path.split("/").slice(1, -1).join("/"));
          Swal.fire(
            "Carpeta eliminada",
            "La carpeta " + tmp + " ha sido eliminada",
            "success"
          );
          localStorage.setItem("tree" + carnetEstudiante, JSON.stringify(JSON.decycle(tree)));
          $("#carpetas").html(tree.getHTML(path));
        }
      });
    }
  }
}

//FUNCION PARA CREACIÓN DE CARPETAS RECURSIVAS
function entrarCarpeta(folderName) {
  let path = $("#path").val();
  let currentPath = path == "/" ? path + folderName : path + "/" + folderName;
  let folderNode = tree.getFolder(currentPath);
  if (folderNode !== null) {
    $("#path").val(currentPath);
    $("#carpetas").html(tree.getHTML(currentPath));
  } else {
    Swal.fire({
      icon: "warning",
      title: "Carpeta no encontrada",
      text: `La carpeta ${folderName} no existe en la ruta ${path}.`,
    });
  }
}

// FUNCIÓN PARA Logout
function logout() {
  window.location.href = "../Login/login.html";
}

//FUNCION PARA CARGAR ARCHIVOS 
function mostrarArchivo(){
  let path = $("#path").val();
  const archivoSelect = document.getElementById("archivoSelect");
  archivoSelect.options.length = 1;
  const root = tree.getFolder(path);
  root.files.forEach(file => {
    const option = document.createElement("option");
    option.text = file.name;
    archivoSelect.add(option);
  });
  document.getElementById("archivoSelect").selectedIndex = 0;
  document.getElementById("carnetSelect").selectedIndex = 0;
  document.getElementById("permisoSelect").selectedIndex = 0;
}

//FUNCION PARA MOSTRAR PERMISO
function mostrarPermiso() {
  mostrarArchivo();
  if (archivoSelect.length === 1) {
    Swal.fire({
      icon: "error",
      title: "No hay archivos en la carpeta",
      text: "No se pueden otorgar permisos sin archivos",
    });
    return; 
  }else{
  document.getElementsByClassName("btn-dangers")[0].style.display = "block";
  document.getElementById("archivoSelect").style.display = "block";
  document.getElementById("carnetSelect").style.display = "block";
  document.getElementById("permisoSelect").style.display = "block";
  document.getElementsByClassName("btn-dar")[0].style.display = "block";
  document.getElementsByClassName("btn-mostrar")[0].style.display = "none";
  }
}


//FUNCION PARA OCULTAR PERMISOS
function ocultarPermiso(){
  mostrarArchivo()
  document.getElementById("archivoSelect").style.display = "none";
  document.getElementById("carnetSelect").style.display = "none";
  document.getElementById("permisoSelect").style.display = "none";
  document.getElementsByClassName("btn-dar")[0].style.display = "none";
  document.getElementsByClassName("btn-dangers")[0].style.display = "none";
  document.getElementsByClassName("btn-mostrar")[0].style.display = "block";
}

//FUNCION PARA BOTON DE REGRESAR
function regresarPermiso(){
  mostrarArchivo()
  ocultarPermiso();
}

//FUNCION PARA BOTON DE MODIFICAR CARPETA
function renombreCarpeta() {
  let oldPath = $("#path").val();

  if (oldPath == "/") {
    Swal.fire({
      icon: "info",
      title: "Carpeta inválida",
      text: "Seleccione una carpeta para renombrar",
    });
    return;
  }

  Swal.fire({
    title: "Ingrese el nuevo nombre de la carpeta:",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Cambiar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value) {
        return "Por favor, ingrese un nombre válido";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      let newName = result.value;
      tree.renameFolder(oldPath, newName);
      localStorage.setItem("tree" + carnetEstudiante, JSON.stringify(JSON.decycle(tree)));
    }
  });
}



//FUNCION PARA BOTON DE INICIO
function retornarInicio() {
  $("#path").val("/");
  $("#carpetas").html(tree.getHTML("/"));
  ocultarPermiso()
  mostrarArchivo()
}

//FUNCION PARA MOSTAR ARCHIVOS AL RECARGAR
window.addEventListener("load", function() {
  ocultarPermiso()
  mostrarArchivo()
});
//-----------------------------------------------------------------------------------------------------------------------

// ------------------------------------------FUNCIONES DEL GRAHPVIZ------------------------------------------------------
//GRAFICAR ARBOL
function showGraph() {
  let url = "https://quickchart.io/graphviz?graph=";
  let body;
  if (tree.root.children.length === 0) {
    Swal.fire({
      icon: "info",
      text: "No hay carpetas creadas",
    });
    return;
  } else {
    body = `digraph G { ${tree.graph()} }`;
    $("#graph2").attr("src", url + body);
  }
}


//GRAFICAR MATRIZ DISPERSA
function showGraphMD() {
  let path = $('#path').val();
  if (archivoSelect.length === 1) {
    Swal.fire({
      icon: "error",
      title: "No hay archivos en la carpeta",
      text: "Agrega archivos a la carpeta",
    });
    return;
  } else {
  let url = 'https://quickchart.io/graphviz?graph=';
  console.log(tree.matrixGrpah(path))
  let body = `digraph G { ${tree.matrixGrpah(path)} }`
  $("#graph3").attr("src", url + body);
  }
}


//GRAFICAR LISTA CIRCULAR
function showGraphC() {
  let url = "https://quickchart.io/graphviz?graph=";
  let body;

  if (listaCircular.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Sin acciones",
      text: "No se han realizado acciones en el sistema",
    });
  } else {
    body = `${listaCircular.generateGraph()}`;
    $("#graph4").attr("src", url + body);
  }
}
//------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------FUNCIONES DE PERMISOS------------------------------------------------------
var studentsData = JSON.parse(localStorage.getItem("studentsData"));
var carnetSelect = document.getElementById("carnetSelect");
for (var i = 0; i < studentsData.length; i++) {
  var option = document.createElement("option");
  option.text = studentsData[i].carnet;
  option.value = studentsData[i].carnet;
  carnetSelect.appendChild(option);
}

function cargarArchivosCarpetaPadre() {
  const archivoSelect = document.getElementById("archivoSelect");
  const root = tree.getFolder(path);

  // Borra los elementos anteriores excepto el primero
  while (archivoSelect.childElementCount > 1) {
    archivoSelect.removeChild(archivoSelect.lastChild);
  }

  root.files.forEach(file => {
    const option = document.createElement("option");
    option.text = file.name;
    archivoSelect.add(option);
  });
}



const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  function downloadTxt(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  async function subirArchivo(e) {
    e.preventDefault();
    const input = document.querySelector('#file');
    const file = input.files[0];
    var fileName = file.name.split(".")[0];
  
    // Validar si ya existe un archivo con el mismo nombre en la carpeta actual
    let path = $("#path").val();
    let folder = tree.getFolder(path);
    if (folder) {
      let existingFileNames = folder.files.map(file => file.name);
      let newName = fileName;
      let counter = 1;
      while (existingFileNames.includes(newName)) {
        newName = `${fileName} (copia${counter})`;
        counter++;
      }
      fileName = newName; // Asignar el nuevo nombre al archivo
    }
  
    const formData = new FormData(e.target);
    const form = Object.fromEntries(formData);
    if (folder) {
      if (form.file.type === "text/plain") {
        let fr = new FileReader();
        fr.onload = function() {
          console.log(fr.result);
          folder.files.push({
            name: fileName,
            content: fr.result,
            type: form.file.type,
          });
  
          localStorage.setItem("tree" + carnetEstudiante, JSON.stringify(JSON.decycle(tree)));
          $('#carpetas').html(tree.getHTML(path));
        };
        fr.readAsText(form.file);
      } else {
        let parseBase64 = await toBase64(form.file);
        folder.files.push({
          name: fileName,
          content: parseBase64,
          type: form.file.type,
        });
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const date = "Fecha: " + `${day}/${month}/${year}`;
        const hour = "Hora: " + `${hours}:${minutes}:${seconds}`;
        var creo = "Se creó archivo\\n" + fileName + "\\n" + date + "\\n" + hour;
        listaCircular.insert(creo);
        localStorage.setItem("listaCircular" + carnetEstudiante, JSON.stringify(JSON.decycle(listaCircular)));
        localStorage.setItem("tree" + carnetEstudiante, JSON.stringify(JSON.decycle(tree)));
        $('#carpetas').html(tree.getHTML(path));
      }
    }
  }



