# Fase 1 Proyecto EDD
#### Pablo Josué Barahona Luncey
#### 202109715

## Descripción del problema
La facultad de ingeniería desea tener una forma de almacenar archivos importantes, pero actualmente no cuentan con un sistema que se ajuste a sus necesidades por lo que se plantea la solución de crear un sistema propio. Este sistema debe de ser capaz de ser utilizado en cualquier sistema operativo por lo que se plantea la posibilidad de que la aplicación sea un sitio web mediante el uso de Github Pages. El sistema debe tener un funcionamiento similar a Google Drive con la característica que la Universidad de San Carlos sea propietario del mismo, además de otras características propias de la aplicación. Según los requerimientos antes mencionados se desea que usted como estudiante de ingeniería en sistemas desarrolle la aplicación para el manejo de archivos para la Universidad de San Carlos de Guatemala de la facultad de Ingeniería. El sistema denominado como EDD GoDrive debe de llevar el control de usuarios, donde cada uno de los cursos de la carrera de ingeniería en sistemas debe de contar con un espacio de almacenamiento donde se puede subir, crear y eliminar carpetas, así como también archivos. Los usuarios también tendrán la opción de modificar los nombres de carpetas y archivos ya creados. La aplicación debe de ser responsiva y amigable al usuario. A continuación, se da una explicación más detallada de lo solicitado.

## Descripción del programa
Para la resolución de este problema se utilizó lo siguiente:
Se crearon 3 archivos que contienen diferentes datos, los cuales son "estructuras", "graphviz" y "main"
- Estructuras:
En este archivo se crearon las Estructuras de Datos a utilizar, entre ellas se encuentra la lista enlazada doble, la pilas y las colas, como también archivo para generar el Json.
- Main: 
En este archivo se crearon los métodos y la lógica a usar. Entre ellos se encuentra el método de inicio de sesión, el cual contiene la función de Administrador, este permite aprobar usuarios, agregarlos, entre otras funciones.
-Graphviz:
En este archivo se crearon las estructuras graphviz para generar reportes y ver de forma visual las estructuras.

Para poder ejecutar este programa se tienen 2 opciones:
- Ya se generó el archivo .exe, por lo cual para ejecutarlo, basta en abrir el cmd del origen del archivo (EDD_Proyecto1_Fase1), y para ejecutarlo solo debemos de ingresar esto:
```sh
./EDD_Proyecto1_Fase1.exe
```
- Otra forma para poder generarlo consiste en abrir el cmd del origen del archivo (EDD_Proyecto1_Fase1), y para ejecutarlo solo debemos de ingresar esto:
```sh
go run .
```
También se pueden visualizar 4 carpetas: las cuales guardan los reportes en graphviz, las cuales son:
- Aprobación de estudiantes: este contiene el día y fecha que se aprobó un estudiante.
- Estudiantes en cola: Este contiene la información de los estudiantes que aún no han sido aprobados.
- Inicios de sesión: Este contiene la información de cuando una persona inicia sesión.
- Lista doble: Este contiene la información de los estudiantes aprobados.

En resumen, podremos ver todos estos archivos que se muestran a continuación:
![image](https://user-images.githubusercontent.com/98893615/221267288-acc7eb4f-0a39-46f7-883b-33b966820379.png)
