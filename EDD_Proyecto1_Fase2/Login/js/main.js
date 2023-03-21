/*==================================================================
[ Validate ]*/
var input = $('.validate-input .input100');


$('.validate-form').on('submit', function (e) {
    e.preventDefault();
    var check = true;
    var email = $("input[name='email']").val();
    var password = $("input[name='pass']").val();

    if(email === "admin" && password === "admin") {
        window.location.href = "../DashboardAdmin/admin.html";
        return;
    }

    for (var i = 0; i < input.length; i++) {
        if (validate(input[i]) == false) {
            showValidate(input[i]);
            check = false;
        }
    }
        var studentsData = localStorage.getItem('studentsData');
        if (studentsData) {
            var studentsArray = JSON.parse(studentsData);
            // Iterar a través de los objetos de estudiantes para encontrar una coincidencia
            for (var j = 0; j < studentsArray.length; j++) {
                var carnss=studentsArray[j].carnet.toString()
                if (carnss === email && studentsArray[j].password === password) {
                    // Redireccionar al estudiante a la página estudiantes.html si se encuentra una coincidencia
                    //window.location.href = "../estudiantes.html";
                    alert("Bienvenido " + studentsArray[j].nombre);
                    return;
                }
            }
        alert("Nombre de usuario o contraseña incorrectos");
    }

    return check;
});

$('.validate-form .input100').each(function () {
    $(this).focus(function () {
        hideValidate(this);
    });
});

function validate(input) {
    if($(input).attr('name') == 'email') {
        if($(input).val().trim() === '') {
            return false;
        }
    }
    else if ($(input).attr('name') == 'pass') {
        if ($(input).val().trim() === '') {
            return false;
        }
    }
}

function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}
