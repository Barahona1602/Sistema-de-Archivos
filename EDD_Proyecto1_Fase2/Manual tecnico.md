Universidad de San Carlos de Guatemala

Facultad de Ingeniería

Escuela de Ciencias y Sistemas

Estructura de Datos

# Manual Técnico - Proyecto Fase 2

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
El Dashborad Admin tiene como función principal cargar los estudiantes para que puedan iniciar sesión. Estos estudiantes se almacenan en un **"Arbol AVL"**, los cuales se pueden mostrar presionando el botón de "Gráfica del Arbol", estos estudiantes también se pueden mostrar en 3 tipos de orden "In order", "Post order" y "Pre order". Los datos de los estudiantes son mostrados en una tabla.

## Usuario
El usuario tiene la capacidad de crear sus carpetas, cargar archivos en las carpetas y dar permiso a otros estudiantes para poder usar los archivos.
En esta parte se usan 4 tipos de EDD, las cuales son las siguientes, acompañadas de su uso:
- **Arbol N-ario o Multicaminos**: Esta estructura se utiliza al crear y almacenar las carpetas, esto debido a que una carpeta puede tener n cantidad de subcarpetas y así sucesivamente. Esta estructura se puede visualizar al presionar el botón de Reporte de carpetas. Este arbol tiene como elementos 
- **Matriz Dispersa**: Se utiliza para guardar los archivos y los permisos otorgados del usuario a otro usuario sobre la carpeta actual. (Esta matriz se sitúa como un elemento del arbol N-ario). Cada carpeta tiene una matriz diferente. La matriz dispersa se puede visualizar al crear el reporte de archivos. La matriz tiene como elementos los ejes X y Y y su contenido.
- **Lista Circular**: La lista circular se utiliza para guardar el historial de acciones del programa, en el cual se puede visualizar la gráfica en el botón de Bitácora, entre sus elementos solo utiliza un dato.

La estructura de los archivos está dividida así:

![image](https://user-images.githubusercontent.com/98893615/230949481-43b2578a-fafb-4ce0-84cf-4c0f31378a91.png)
