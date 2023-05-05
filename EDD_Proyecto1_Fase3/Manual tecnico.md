Universidad de San Carlos de Guatemala

Facultad de Ingeniería

Escuela de Ciencias y Sistemas

Estructura de Datos

# Manual Técnico - Proyecto Fase 3

| Nombre | Carnet |  
| ------ | ------ |  
| Pablo Josué Barahona Luncey | 202109715 |  

## Descripción General
Se creó un sistema de archivos llamado EDD - GoDrive, en el cual se lleva un control de usuarios en el sistema, donde cada usuario puede ver sus carpetas, sus archivos y su historial de acciones. Entre esas funciones, el administrador puede cargar estudiantes y los estudiantes pueden eliminar o crear carpetas y subir archivos en las carpetas.
El objetivo principal del programa es el uso de Estructuras de Datos
El programa está creado con JavaScript, HTML y CSS. 

## Login
Al inicio del programa se verá un login donde el usuario predeterminado es el admin, con usuario "admin" y contraseña "admin", esto redigirá a la página "Dashboard Admin", la cual puede cargar usuarios, estos usuarios posteriormente, podrán iniciar sesión con su numero de carnet y contraseña.

## Dashboard Admin
El Dashborad Admin tiene como función principal cargar los estudiantes para que puedan iniciar sesión. Estos estudiantes se almacenan en un **"Arbol AVL"** y luego se inserta en una **"Tabla Hash"** en donde la contraseña de los usuarios se encuentra encriptada con SHA256, los cuales se muestran en la tabla del programa. También tenemos los reportes de los archivos, los cuales se almacenan en el localstorage y se muestran en una tabla. Por último tenemos una tabla con los datos de los mensajes, acá se utiliza la estructura **"Blockchain"** que almacena los mensajes, por último se puede generar un reporte de todos los mensajes.

## Usuario
El usuario tiene la capacidad de crear sus carpetas, cargar archivos en las carpetas y dar permiso a otros estudiantes para poder usar los archivos.
En esta parte se usan 4 tipos de EDD, las cuales son las siguientes, acompañadas de su uso:
- **Grafo No Dirigido**: Esta estructura se utiliza al crear y almacenar las carpetas, esto debido a que una carpeta puede tener n cantidad de subcarpetas y así sucesivamente. Esta estructura se puede visualizar al presionar el botón de Reporte de carpetas.
- **BlockChain**: Se utiliza para guardar los mensajes enviados entre los usuarios, los cuales se encriptan y se utiliza una estructura SHA256. Con este almacenamiento, se logra hacer el reporte del administrador y así tener un mejor control de los mensajes.
- **Lista Circular**: La lista circular se utiliza para guardar el historial de acciones del programa, en el cual se puede visualizar la gráfica en el botón de Bitácora, entre sus elementos solo utiliza un dato.

La estructura de los archivos está dividida así:

![image](https://user-images.githubusercontent.com/98893615/236372039-017f903d-1994-48ba-98da-9a9e368fc5ff.png)
