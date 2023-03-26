// DECLARACIÓN DE LAS ESTRUCTURAS A UTILIZAR
let avlTree = new AvlTree();

// FUNCIÓN PARA MANEJAR FORMULARIOS
function loadStudentsForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = Object.fromEntries(formData);
    let studentsArray = [];
    try {
      let fr = new FileReader();
      fr.readAsText(form.inputFile);
      fr.onload = () => {
        studentsArray = JSON.parse(fr.result).alumnos;
        // AGREGAR A LA TABLA LOS ALUMNOS CARGADOS 
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
        // GUARDAR DATOS EN LOCALSTORAGE
        localStorage.setItem('studentsData', JSON.stringify(studentsArray));
        var studentsData = localStorage.getItem('studentsData');
        if (studentsData) {
            var studentsArray = JSON.parse(studentsData);
            console.log(studentsArray);
          }
          
      }
    } catch(error){
      console.log(error);
      swal("Archivo incorrecto", "Error en la subida de los estudiantes", "warning");
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
        $('#studentsTable tbody').html(
          avlTree.inOrder()
        )
        break;
      case 'preOrder':
        $('#studentsTable tbody').html(
          avlTree.preOrder()
        )
        break;
      case 'postOrder':
        $('#studentsTable tbody').html(
          avlTree.postOrder()
        )
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
  let body = `digraph G { ${avlTree.treeGraph()} }`
  console.log(body);
  $("#graph").attr("src", url + body);
}

// FUNCIÓN PARA Logout
function logout() {
  window.location.href = "../Login/login.html";
}

