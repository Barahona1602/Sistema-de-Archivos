var carnetEstudiante = sessionStorage.getItem("carnetEstudiante");

$(document).ready(() => {
  var permisosData = JSON.parse(localStorage.getItem("permisosData"));
  var archivosSelect = $("#archivos");
  for (var i = 0; i < permisosData.length; i++) {
    if (permisosData[i].Destino === carnetEstudiante) {
      var option = $("<option></option>");
      if (permisosData[i].Type === "text/plain") {
        option.text(permisosData[i].Archivo + ".txt");
      } else if (permisosData[i].Type === "application/pdf") {
        option.text(permisosData[i].Archivo + ".pdf");
      } else if (permisosData[i].Type === "image/jpeg") {
        option.text(permisosData[i].Archivo + ".jpg");
      } else if (permisosData[i].Type === "image/png") {
        option.text(permisosData[i].Archivo + ".png");
      } else {
        option.text(permisosData[i].Archivo);
      }
      option.attr("value", i);
      archivosSelect.append(option);
    }
  }

  archivosSelect.on("change", function () {
    var permiso = permisosData[$(this).val()].Permiso;
    var type = permisosData[$(this).val()].Type;
    var content = permisosData[$(this).val()].Content;
    if (type === "text/plain") {
      if (permiso === "r") {
        $("#visualizador").html(
          '<textarea readonly="readonly" style="width: 775px; height: 400px;">' + content + '</textarea>'
        );
        
      } else if (permiso === "r-w") {
        $("#visualizador").html(
          '<textarea style="width: 775px; height: 400px;">' + content + "</textarea>"
      );
      }
    } else if (type === "application/pdf") {
      $("#visualizador").html('<embed src="' + content + '" type="application/pdf" width="100%" height="400px" />');
    } else if (type === "image/jpeg" || type === "image/png") {
      $("#visualizador").html('<img src="' + content + '" width="100%" height="400px"/>');
    }
  });

  $(document).on("input", "#visualizador textarea", function () {
    var index = archivosSelect.val();
    permisosData[index].Content = $(this).val();
    localStorage.setItem("permisosData", JSON.stringify(permisosData));
  });

  $("#descargar").on("click", function() {
    descargar();
  });
  
  function descargar() {
    var index = archivosSelect.val();
    var type = permisosData[index].Type;
    var content = permisosData[index].Content;
    var archivo = permisosData[index].Archivo;
  
    if (type === "text/plain") {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      );
      element.setAttribute("download", archivo + ".txt");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (type === "application/pdf") {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        content
      );
      element.setAttribute("download", archivo + ".pdf");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (type === "image/jpeg" || type === "image/png") {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        content
      );
      element.setAttribute("download", archivo);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      window.open(content);
    }
  }
});  

function regresar() {
  window.location.href = "./users.html";
}