var nombreEstudiante = sessionStorage.getItem("nombreEstudiante");
var carnetEstudiante = sessionStorage.getItem("carnetEstudiante");

let transmitter = carnetEstudiante;

// MOSTRAR LOS USUARIOS EN LOS SELECTS
$(document).ready(() => {
    var studentsData = JSON.parse(localStorage.getItem("studentsData"));
    var transmitter = document.getElementById("transmitter");
    for (var i = 0; i < studentsData.length; i++) {
        if (studentsData[i].carnet != carnetEstudiante){
        var option = document.createElement("option");
        option.text = studentsData[i].nombre;
        option.value = studentsData[i].carnet;
        transmitter.appendChild(option);
        }
    }

});

// INSTANCIA DE LA CLASE
let blockChain = new BlockChain();

function cargarmsg(){
    let block = JSON.retrocycle(JSON.parse(localStorage.getItem("blockChain")));
    if (block !== null && block !== undefined) {
    blockChain = Object.assign(new BlockChain(), block);
  }
}


let block = JSON.retrocycle(JSON.parse(localStorage.getItem("blockChain")));
if (block !== null && block !== undefined) {
    blockChain = Object.assign(new BlockChain(), block);
  }

// ACTUALIZAR AMBOS CHATS 
function updateChats(){
    cargarmsg()
    let receiver = $('#transmitter').val();
    $('#transmitter-chat').html(blockChain.getMessages(transmitter, receiver));
    
}

setInterval(updateChats, 1500);

function getDate() {
    const now = new Date();
    const day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    const month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return `${day}-${month}-${year}::${hours}:${minutes}:${seconds}`;
  }
  

  async function sendMessage(whoSend){
    // OBTENER VALORES DEL SELECT 
    let receiver = $('#transmitter').val();
    // VERIFICAR QUE HAYA SELECCIONADO UN USUARIO
    if(receiver){
        switch(whoSend){
            case 'transmitter':
                // OBTENER MENSAJE A ENVIAR
                let msgt = $('#msg-transmitter').val();
                // VERIFICAR QUE EL MENSAJE NO ESTÉ VACÍO
                if(msgt.trim() === ''){
                    // MOSTRAR MENSAJE DE ERROR CON SWEETALERT2
                    Swal.fire({title: "Error",icon: "error",text: "El texto del mensaje está vacío",});
                    return;
                }
                // INSERTAR MENSAJE EN BLOCKCHAIN
                await blockChain.insert(getDate(), transmitter, receiver, msgt);
                localStorage.setItem("blockChain", JSON.stringify(JSON.decycle(blockChain)));
                // LIMPIAR INPUT
                $('#msg-transmitter').val("");
            break;
        }
        updateChats();
        cargarmsg();
    }else{
        // MOSTRAR MENSAJE DE ERROR CON SWEETALERT2
        Swal.fire({title: "Error",icon: "error",text: "No ha seleccionado un usuario",});
    }
}

function regresar() {
    window.location.href = "./users.html";
  }




