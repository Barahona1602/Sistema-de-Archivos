package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/sqweek/dialog"
)

type User struct {
	nombre     string
	apellido   string
	carnet     string
	contraseña string
}

type Node struct {
	user     User
	next     *Node
	previous *Node
}

type DoublyLinkedList struct {
	head *Node
	tail *Node
}

// Colas de estudiantes
type Queue []User

func (q *Queue) Enqueue(user User) {
	*q = append(*q, user)
}

func (dll *DoublyLinkedList) Insert(user User) {
	newNode := &Node{user: user}

	if dll.head == nil {
		dll.head = newNode
		dll.tail = newNode
	} else {
		dll.tail.next = newNode
		newNode.previous = dll.tail
		dll.tail = newNode
	}
}

// Pila de aprobar o rechazar estudiantes

type Stack2 []string

func (s2 *Stack2) Pop() string {
	if len(*s2) == 0 {
		return ""
	}
	index := len(*s2) - 1
	element := (*s2)[index]
	*s2 = (*s2)[:index]
	return element
}

func (s2 *Stack2) Push(startTime string) {
	*s2 = append(*s2, startTime)
	generateGraph2(*s2)
}

// Pila de inicio de sesión
type Stack []string

func (s *Stack) Pop() string {
	if len(*s) == 0 {
		return ""
	}
	index := len(*s) - 1
	element := (*s)[index]
	*s = (*s)[:index]
	return element
}

func (s *Stack) Push(nombre string, apellido string, hora string, carnet string) {
	usuario := carnet + "\n" + nombre + " " + apellido
	estaRepetido := false
	for i, v := range *s {
		if strings.Contains(v, usuario) {
			(*s)[i] = v + "\n" + hora
			estaRepetido = true
			break
		}
	}
	if !estaRepetido {
		*s = append(*s, usuario+"\n"+"Se inició sesión:"+"\n"+hora)
	}
	generateGraph(*s)
}

// Graphviz para pila de inicio de sesión
func generateGraph(s Stack) {
	f, err := os.Create("estudiantes.dot")
	if err != nil {
		fmt.Println("Error al crear archivo de grafo:", err)
		return
	}
	defer f.Close()

	_, err = f.WriteString("digraph {\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}

	// Escribir nodos
	_, err = f.WriteString("node [shape=box]\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	_, err = f.WriteString("{rank=same ")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	for i, v := range s {
		_, err = f.WriteString(fmt.Sprintf("\"%s\"", v))
		if err != nil {
			fmt.Println("Error al escribir en archivo de grafo:", err)
			return
		}
		if i < len(s)-1 {
			_, err = f.WriteString(" -> ")
			if err != nil {
				fmt.Println("Error al escribir en archivo de grafo:", err)
				return
			}
		}
	}
	_, err = f.WriteString("}\n")

	// Escribir conexiones
	_, err = f.WriteString("edge [dir=none]\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	_, err = f.WriteString("{rank=same ")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	for i, v := range s {
		_, err = f.WriteString(fmt.Sprintf("\"%s\"", v))
		if err != nil {
			fmt.Println("Error al escribir en archivo de grafo:", err)
			return
		}
		if i < len(s)-1 {
			_, err = f.WriteString(" -> ")
			if err != nil {
				fmt.Println("Error al escribir en archivo de grafo:", err)
				return
			}
		}
	}
	_, err = f.WriteString("}\n")

	_, err = f.WriteString("}\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}

	cmd := exec.Command("dot", "-Tpng", "estudiantes.dot", "-o", "estudiantes.png")
	if err = cmd.Run(); err != nil {
		fmt.Println("Error al generar imagen de grafo:", err)
		return
	}
}

// Graphviz para pila de inicio de sesión
func generateGraph2(s2 Stack2) {
	f, err := os.Create("admin.dot")
	if err != nil {
		fmt.Println("Error al crear archivo de grafo:", err)
		return
	}
	defer f.Close()

	_, err = f.WriteString("digraph {\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}

	// Escribir configuración de grafo
	_, err = f.WriteString("rankdir=LR;\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}

	// Escribir nodos
	_, err = f.WriteString("node [shape=box]\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	_, err = f.WriteString("{rank=same ")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	for i, v := range s2 {
		_, err = f.WriteString(fmt.Sprintf("\"%s\"", v))
		if err != nil {
			fmt.Println("Error al escribir en archivo de grafo:", err)
			return
		}
		if i < len(s)-1 {
			_, err = f.WriteString(" -> ")
			if err != nil {
				fmt.Println("Error al escribir en archivo de grafo:", err)
				return
			}
		}
	}
	_, err = f.WriteString("}\n")

	// Escribir conexiones
	_, err = f.WriteString("edge [dir=none]\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	_, err = f.WriteString("{rank=same ")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}
	for i, v := range s2 {
		_, err = f.WriteString(fmt.Sprintf("\"%s\"", v))
		if err != nil {
			fmt.Println("Error al escribir en archivo de grafo:", err)
			return
		}
		if i < len(s2)-1 {
			_, err = f.WriteString(" -> ")
			if err != nil {
				fmt.Println("Error al escribir en archivo de grafo:", err)
				return
			}
		}
	}
	_, err = f.WriteString("}\n")

	_, err = f.WriteString("}\n")
	if err != nil {
		fmt.Println("Error al escribir en archivo de grafo:", err)
		return
	}

	cmd := exec.Command("dot", "-Tpng", "admin.dot", "-o", "admin.png")
	if err = cmd.Run(); err != nil {
		fmt.Println("Error al generar imagen de grafo:", err)
		return
	}
}

// Función para ordenar lista por carnet
func (dll *DoublyLinkedList) OrdenarPorCarnet() {
	for {
		permutacion := false
		current := dll.head
		for current != nil && current.next != nil {
			if current.user.carnet > current.next.user.carnet {
				current.user, current.next.user = current.next.user, current.user
				permutacion = true
			}
			current = current.next
		}
		if !permutacion {
			break
		}
	}
}

// Función para ordenar lista por nombre
func (dll *DoublyLinkedList) BuscarUsuario(carnet string) *Node {
	for node := dll.head; node != nil; node = node.next {
		if node.user.carnet == carnet {
			return node
		}
	}
	return nil
}

// Standby
func standby() {
	fmt.Println("Gracias por usar el programa")
	var choice int
	fmt.Scan(&choice)
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
}

func main() {
	menuInicioSesion(&DoublyLinkedList{})
	admin()
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

				fmt.Println("La pila es:", s)
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

			fmt.Println("La pila es:", s)

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
					fmt.Printf("El usuario %s %s ha sido agregado correctamente al sistema\n", user.nombre, user.apellido)
					// Eliminar el usuario seleccionado de la cola
					copy(queue[index-1:], queue[index:])
					queue = queue[:len(queue)-1]
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
			}

			defer file.Close()

			reader := csv.NewReader(file)
			reader.Comma = ','

			records, err := reader.ReadAll()
			if err != nil {
				panic(err)
			}

			for _, record := range records {
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
