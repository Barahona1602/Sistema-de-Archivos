if (sessionStorage.getItem('admin') !== 'admin') {
  Swal.fire({
    icon: 'warning',
    title: 'No se ha iniciado sesión',
    text: 'Por favor, inicia sesión como administrador antes de acceder a esta página',
    closeOnClickOutside: false,
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



// DECLARACIÓN DE LAS ESTRUCTURAS A UTILIZAR
let avlTree = new AvlTree();

function loadStudentsForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const form = Object.fromEntries(formData);
  let studentsArray = [];

  // cargar los estudiantes del archivo
  try {
    let fr = new FileReader();
    fr.readAsText(form.inputFile);
    fr.onload = () => {
      studentsArray = JSON.parse(fr.result).alumnos;
      let studentsData = localStorage.getItem('studentsData');
      let studentsDataArray = studentsData ? JSON.parse(studentsData) : [];

      let newStudentsArray = [];
      let repeatedStudentsArray = [];

      // verificar si los estudiantes ya existen en localStorage
      for (let i = 0; i < studentsArray.length; i++) {
        let studentExists = false;

        for (let j = 0; j < studentsDataArray.length; j++) {
          if (studentsArray[i].carnet === studentsDataArray[j].carnet) {
            studentExists = true;
            repeatedStudentsArray.push(studentsArray[i].carnet);
            break;
          }
        }

        if (!studentExists) {
          newStudentsArray.push(studentsArray[i]);
          studentsDataArray.push(studentsArray[i]);
        }
      }

      // mostrar mensaje de estudiantes repetidos
      if (repeatedStudentsArray.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Estudiantes repetidos',
          text: `Los estudiantes con los siguientes carnets ya existen en la lista: ${repeatedStudentsArray.join(', ')}`
        });
      }

      // AGREGAR A LA TABLA LOS ALUMNOS CARGADOS 
      $('#studentsTable tbody').html(
        studentsDataArray.map((item, index) => {
          return(`
            <tr>
              <th>${item.carnet}</th>
              <td>${item.nombre}</td>
              <td>${item.password}</td>
            </tr>
          `);
        }).join('')
      );

      for(let i = 0; i < newStudentsArray.length; i++){
        avlTree.insert(newStudentsArray[i]);
      }

      // GUARDAR DATOS EN LOCALSTORAGE
      localStorage.setItem('studentsData', JSON.stringify(studentsDataArray));
      console.log(studentsDataArray);
    }
  } catch(error){
    Swal.fire({
      icon: 'warning',
      title: 'Archivo incorrecto',
      text: 'Error en la subida de los estudiantes'
    });      
  }
}


  // CARGAR DATOS DEL LOCAL STORAGE AL RECARGAR LA PÁGINA
function loadDataFromLocalStorage() {
  const studentsData = localStorage.getItem('studentsData');
  if (studentsData) {
    const studentsArray = JSON.parse(studentsData);
    $('#studentsTable tbody').html(
      studentsArray.map((item, index) => {
        return(`
          <tr>
            <th>${item.carnet}</th>
            <td>${item.nombre}</td>
            <td>${item.password}</td>
          </tr>
        `);
      }).join('')
    );
    for(let i = 0; i < studentsArray.length; i++){
      avlTree.insert(studentsArray[i]);
    }
  }
}

// EVENTO ONLOAD PARA CARGAR DATOS DEL LOCAL STORAGE AL RECARGAR LA PÁGINA
window.onload = function() {
  loadDataFromLocalStorage();
};

// FUNCIÓN PARA AGREGAR RECORRIDOS
function showStudentsForm(e){
  e.preventDefault();
  const formData = new FormData(e.target);
  const form = Object.fromEntries(formData);
  if(avlTree.root !== null){
    switch(form.traversal){
      case 'inOrder':
          inOrder()
        break;
      case 'preOrder':
        preOrder()
        break;
      case 'postOrder':
        postOrder()
        break;
      default:
        $('#studentsTable tbody').html("")
        break;
    }
  }
}

// FUNCIÓN PARA GRAPHVIZ
function showAvlGraph(){
  let url = 'https://quickchart.io/graphviz?graph=';
  let body = `digraph G { ${avlTree.graph()} }`
  $("#graph").attr("src", url + body);
}

// FUNCIÓN PARA Logout
function logout() {
  window.location.href = "../Login/login.html";
}

function inOrder(){
  let nodos = avlTree.inOrder();

  // Agregar cada item en una fila de la tabla HTML
  let tableBody = document.querySelector('#studentsTable tbody');
  let row = "";
  for (let i = 0; i < nodos.length; i++) {
      let current = nodos[i];
      row += `
          <tr>
              <th>${current.item.carnet}</th>
              <td>${current.item.nombre}</td>
              <td>${current.item.password}</td>
          </tr>
      `;
  }
  tableBody.innerHTML = row;
}

function postOrder(){
  let nodos = avlTree.postOrder();

  // Agregar cada item en una fila de la tabla HTML
  let tableBody = document.querySelector('#studentsTable tbody');
  let row = "";
  for (let i = 0; i < nodos.length; i++) {
      let current = nodos[i];
      row += `
          <tr>
              <th>${current.item.carnet}</th>
              <td>${current.item.nombre}</td>
              <td>${current.item.password}</td>
          </tr>
      `;
  }
  tableBody.innerHTML = row;
}

function preOrder(){
  let nodos = avlTree.preOrder();

  // Agregar cada item en una fila de la tabla HTML
  let tableBody = document.querySelector('#studentsTable tbody');
  let row = "";
  for (let i = 0; i < nodos.length; i++) {
      let current = nodos[i];
      row += `
          <tr>
              <th>${current.item.carnet}</th>
              <td>${current.item.nombre}</td>
              <td>${current.item.password}</td>
          </tr>
      `;
  }
  tableBody.innerHTML = row;
}

