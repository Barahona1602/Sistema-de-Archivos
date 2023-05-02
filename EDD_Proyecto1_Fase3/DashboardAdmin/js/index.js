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
let tablaHash = new HashTable();

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

      for(let i = 0; i < newStudentsArray.length; i++){
        const encryptedPassword = CryptoJS.SHA256(newStudentsArray[i].password).toString();
        newStudentsArray[i].password = encryptedPassword;
        avlTree.insert(newStudentsArray[i]);

      }

      

      // GUARDAR DATOS EN LOCALSTORAGE
      localStorage.setItem('studentsData', JSON.stringify(studentsDataArray));
      studentsData = localStorage.getItem('studentsData');
      if (studentsData) {
        const studentsDataArray = JSON.parse(studentsData);
        for(let i = 0; i < studentsDataArray.length; i++){
          // desencriptar la contraseña
          const decryptedPassword = CryptoJS.SHA256(studentsDataArray[i].password).toString();
          studentsDataArray[i].password = decryptedPassword;
          avlTree.insert(studentsDataArray[i]);
        }
      }
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
function loadPermisosFromLocalStorage() {
  const permisosData = localStorage.getItem('permisosData');
  console.log(permisosData)
  if (permisosData) {
    const permisosArray = JSON.parse(permisosData);
    $('#permisosTable tbody').html(
      permisosArray.map((item, index) => {
        if (item.Type === 'text/plain') {
          // Si es un archivo de texto plano, agregar un enlace para descargar el archivo
          return(`
            <tr>
              <th>${item.Propietario}</th>
              <td>${item.Destino}</td>
              <td>${item.Ubicacion}</td>
              <td>
                <a href="#" class="link-like" onclick="downloadTxt('${item.Content}','${item.Archivo}')">${item.Archivo}</a>
              </td>
              <td>${item.Permiso}</td>
            </tr>
          `);
        } else {
          // Si no es un archivo de texto plano, agregar un enlace para descargar el archivo como antes
          return(`
            <tr>
              <th>${item.Propietario}</th>
              <td>${item.Destino}</td>
              <td>${item.Ubicacion}</td>
              <td>
                <a href="${item.Content}" download="${item.Archivo}">${item.Archivo}</a>
              </td>
              <td>${item.Permiso}</td>
            </tr>
          `);
        }
      }).join('')
    );
  }
}

function downloadTxt(text, name) {
  // Crear un objeto Blob
  const blob = new Blob([text], { type: 'text/plain' });

  // Crear una URL temporal para el Blob
  const url = URL.createObjectURL(blob);

  // Crear un elemento "a" para descargar el archivo
  const a = document.createElement('a');
  a.href = url;
  a.download = name+".txt";

  // Hacer clic en el enlace para descargar el archivo
  document.body.appendChild(a);
  a.click();

  // Limpiar la URL temporal
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



// CARGAR DATOS DEL LOCAL STORAGE AL RECARGAR LA PÁGINA
function loadDataFromLocalStorage() {
  const studentsData = localStorage.getItem('studentsData');
  if (studentsData) {
    const studentsDataArray = JSON.parse(studentsData);
    for(let i = 0; i < studentsDataArray.length; i++){
      // desencriptar la contraseña
      const decryptedPassword = CryptoJS.SHA256(studentsDataArray[i].password).toString();
      studentsDataArray[i].password = decryptedPassword;
      avlTree.insert(studentsDataArray[i]);
    }
  }
}

// EVENTO ONLOAD PARA CARGAR DATOS DEL LOCAL STORAGE AL RECARGAR LA PÁGINA
window.onload = function() {
  loadDataFromLocalStorage();
  loadPermisosFromLocalStorage();
};

// FUNCIÓN PARA GRAPHVIZ
function showAvlGraph(){
  let url = 'https://quickchart.io/graphviz?graph=';
  let body = `digraph G { ${hash.toGraphviz()} }`
  $("#graph").attr("src", url + body);
}

// FUNCIÓN PARA Logout
function logout() {
  window.location.href = "../Login/login.html";
}


