package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/sqweek/dialog"
)

// *****************************************************************************
// MAIN
func main() {
	menuInicioSesion(&DoublyLinkedList{})
	admin()
}

// Standby
func standby() {
	fmt.Println("Gracias por usar el programa")
	var choice int
	fmt.Scan(&choice)
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
}

var s = Stack{}

// Función para iniciar sesión
func menuInicioSesion(dll *DoublyLinkedList) {
	var carnet, contrasenia string
	var userNode *Node

	for {
		fmt.Println("* * * * * * * Inicio de Sesión* * * * * * *")
		fmt.Println("*          1. Iniciar sesión              *")
		fmt.Println("*          2. Salir                       *")
		fmt.Println("* * * * * * * * * * * * * * * * * * * * * *")
		fmt.Print("Ingrese una opción: ")
		var opcion int
		_, err := fmt.Scan(&opcion)
		if err != nil {
			fmt.Println("Error al leer la entrada del usuario.")
			continue
		}
		if opcion == 2 {
			os.Exit(0)
		} else if opcion != 1 {
			fmt.Println("Opción inválida.")
			continue
		}
		fmt.Print("Ingresa tu usuario: ")
		_, err = fmt.Scan(&carnet)
		if err != nil {
			fmt.Println("Error al leer la entrada del usuario.")
			continue
		}
		if carnet == "admin" {
			fmt.Print("Ingresa tu contraseña: ")
			_, err := fmt.Scan(&contrasenia)
			if err != nil {
				fmt.Println("Error al leer la entrada del usuario.")
				continue
			}
			if contrasenia == "admin" {
				fmt.Println("Bienvenido admin")
				now := time.Now()
				var hora string = now.Format("02/01/2006 15:04:05")
				s.Push("admin", "", hora, carnet)
				admin()
				continue
			} else {
				fmt.Println("Contraseña incorrecta.")
				continue
			}
		}
		userNode = dll.BuscarUsuario(carnet)
		if userNode == nil {
			fmt.Println("Usuario no encontrado.")
			continue
		}
		fmt.Print("Ingresa tu contraseña: ")
		_, err = fmt.Scan(&contrasenia)
		if err != nil {
			fmt.Println("Error al leer la entrada del usuario.")
			continue
		}
		if contrasenia != userNode.user.contraseña {
			fmt.Println("Contraseña incorrecta.")
			continue
		} else {
			fmt.Printf("Bienvenido, %s %s.\n", userNode.user.nombre, userNode.user.apellido)
			now := time.Now()
			var hora string = now.Format("02/01/2006 15:04:05")

			s.Push(userNode.user.nombre, userNode.user.apellido, hora, carnet)

			fmt.Print("¿Desea salir? (y/n)")
			var opcion2 string
			fmt.Scan(&opcion2)
			if opcion2 == "y" {
				menuInicioSesion(dll)
			}
			if opcion2 == "n" {
				standby()
			}
		}
	}
}

var doublyLinkedList = DoublyLinkedList{}
var queue = Queue{}
var s2 Stack2

// Función para administrar usuarios
func admin() {
	var nombre, apellido, carnet, contraseña string
	for {
		fmt.Println("* * * * * * * Administración de usuarios * * * * * * *")
		fmt.Println("*      1. Ver estudiantes pendientes de aprobación   *")
		fmt.Println("*      2. Ver estudiantes aprobados                  *")
		fmt.Println("*      3. Registrar nuevo estudiante                 *")
		fmt.Println("*      4. Carga masiva de estudiantes                *")
		fmt.Println("*      5. Cerrar sesión                              *")
		fmt.Println("* * * * * * * * * * * * * *  * * * * * * * * * * * * *")
		fmt.Print("Ingrese una opción: ")
		var choice int
		fmt.Scan(&choice)
		scanner := bufio.NewScanner(os.Stdin)
		scanner.Scan()

		switch choice {

		// Ver estudiantes pendientes de aprobación
		case 1:

			for {
				fmt.Println("Ha seleccionado la opción 1")
				fmt.Println("Los usuarios pendientes de aprobación son:")
				for i, user := range queue {
					fmt.Printf("%d - Nombre: %s, Apellido: %s, Carnet: %s, Contraseña: %s\n", i+1, user.nombre, user.apellido, user.carnet, user.contraseña)
				}
				fmt.Println("¿A qué usuario desea aprobar?")
				fmt.Println("Ingrese 0 para salir")
				scanner.Scan()
				answer := scanner.Text()
				index := 0
				fmt.Sscan(answer, &index)
				if index == 0 {
					break
				}

				if index < 1 || index > len(queue) {
					fmt.Println("Indice inválido")
					continue
				}
				user := queue[index-1]
				fmt.Printf("¿Desea agregar al usuario %s %s al sistema? (y/n): ", user.nombre, user.apellido)
				scanner.Scan()
				answer = scanner.Text()
				if answer == "y" {
					doublyLinkedList.Insert(user)
					doublyLinkedList.ToJSON()
					fmt.Printf("El usuario %s %s ha sido agregado correctamente al sistema\n", user.nombre, user.apellido)
					// Eliminar el usuario seleccionado de la cola
					copy(queue[index-1:], queue[index:])
					queue = queue[:len(queue)-1]
					queue.ToGraphviz()
					doublyLinkedList.ToGraphviz2()
					now2 := time.Now()
					var hora string = now2.Format("02/01/2006 15:04:05")
					s2.Push("Se aprobó a Estudiante" + "\n" + hora)
				}

			}

			// Ver estudiantes aprobados
		case 2:
			fmt.Println("Ha seleccionado la opción 2")
			fmt.Println("Los usuarios aprobados en el sistema son:")
			doublyLinkedList.OrdenarPorCarnet()
			for node := doublyLinkedList.head; node != nil; node = node.next {
				fmt.Printf("Nombre: %s, Apellido: %s, Carnet: %s, Contraseña: %s\n", node.user.nombre, node.user.apellido, node.user.carnet, node.user.contraseña)
			}

			// Registrar nuevo estudiante
		case 3:
			fmt.Println("Ha seleccionado la opción 3")
			fmt.Println("Ingrese datos para agregar al usuario:")
			for {
				fmt.Print("Nombre: ")
				scanner.Scan()
				nombre = scanner.Text()
				if nombre == "" {
					break
				}

				fmt.Print("Apellido: ")
				scanner.Scan()
				apellido = scanner.Text()

				fmt.Print("Carnet: ")
				scanner.Scan()
				carnet = scanner.Text()

				fmt.Print("Contraseña: ")
				scanner.Scan()
				contraseña = scanner.Text()

				user2 := User{nombre: nombre, apellido: apellido, carnet: carnet, contraseña: contraseña}
				queue.Enqueue(user2)
			}

			// Carga masiva de estudiantes
		case 4:
			fmt.Println("Ha seleccionado la opción 4")

			// Seleccionar archivo CSV
			path, err := dialog.File().Filter("CSV Files", "csv").Title("Seleccionar archivo CSV").Load()
			if err != nil {
				fmt.Println("Error al seleccionar archivo:", err)
				continue
			}

			// Abrir archivo CSV
			file, err := os.Open(path)
			if err != nil {
				fmt.Println("Error al abrir archivo:", err)
				continue
			}
			defer file.Close()

			reader := csv.NewReader(file)
			reader.Comma = ','

			// Leer y descartar la primera línea
			if _, err := reader.Read(); err != nil {
				fmt.Println("Error al leer la primera línea:", err)
			}

			// Leer registros y procesarlos
			for {
				record, err := reader.Read()
				if err == io.EOF {
					break
				}
				if err != nil {
					fmt.Println("Error al leer registro:", err)
					continue
				}

				// Procesar registro
				nombresplit := record[1]
				palabras := strings.Split(nombresplit, " ")
				nombre := palabras[0]
				apellido := palabras[1]
				carnet := record[0]
				contraseña := record[2]
				user := User{
					nombre,
					apellido,
					carnet,
					contraseña,
				}
				queue.Enqueue(user)
				fmt.Println("Se agregaron los usuarios correctamente")
			}

			// Cerrar sesión
		case 5:
			menuInicioSesion(&doublyLinkedList)
		default:
			fmt.Println("Opción inválida, por favor intente de nuevo.")
		}
	}

}
