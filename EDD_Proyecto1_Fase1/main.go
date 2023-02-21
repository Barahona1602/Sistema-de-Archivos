package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
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

func (dll *DoublyLinkedList) ToJSON() error {
	// Recorrer la lista enlazada y crear un array de mapas
	users := []map[string]string{}
	currentNode := dll.head
	for currentNode != nil {
		userMap := map[string]string{
			"nombre":       currentNode.user.nombre + " " + currentNode.user.apellido,
			"carnet":       currentNode.user.carnet,
			"contraseña":   currentNode.user.contraseña,
			"carpeta_raiz": "/",
		}
		users = append(users, userMap)
		currentNode = currentNode.next
	}

	// Escribir la cadena de texto en un archivo
	f, err := os.Create("usuarios.json")
	if err != nil {
		fmt.Println("Error al crear archivo .json:", err)
		return err
	}
	defer f.Close()

	encoder := json.NewEncoder(f)
	encoder.SetIndent("", "  ")
	err = encoder.Encode(users)
	if err != nil {
		fmt.Println("Error al escribir datos en archivo .json:", err)
		return err
	}
	fmt.Println("Archivo .json generado exitosamente")

	return nil
}

// Colas de estudiantes
type Queue []User

func (q *Queue) Enqueue(user User) {
	*q = append(*q, user)
	q.ToGraphviz()
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
	f, err := os.Create("Inicios de sesión/estudiantes.dot")
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

	cmd := exec.Command("dot", "-Tpng", "Inicios de sesión/estudiantes.dot", "-o", "Inicios de sesión/estudiantes.png")
	if err = cmd.Run(); err != nil {
		fmt.Println("Error al generar imagen de grafo:", err)
		return
	}
}

// Graphviz para pila de inicio de sesión
func generateGraph2(s2 Stack2) {
	f, err := os.Create("Aprobación de estudiantes/admin.dot")
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

	cmd := exec.Command("dot", "-Tpng", "Aprobación de estudiantes/admin.dot", "-o", "Aprobación de estudiantes/admin.png")
	if err = cmd.Run(); err != nil {
		fmt.Println("Error al generar imagen de grafo:", err)
		return
	}
}

func (q *Queue) ToGraphviz() {
	if len(*q) == 0 {
		fmt.Println("La cola está vacía")
		return
	}

	// Construir el grafo
	var b strings.Builder
	b.WriteString("digraph {\n")
	b.WriteString("    rankdir=\"TB\";\n")
	for i, user := range *q {
		fmt.Fprintf(&b, "    node%d[label=\"%v\"];\n", i, user)
		if i > 0 {
			fmt.Fprintf(&b, "    node%d -> node%d;\n", i-1, i)
		}
	}
	b.WriteString("}")

	// Escribir el archivo .dot
	dotFile, err := os.Create("Estudiantes en cola/queue.dot")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer dotFile.Close()
	_, err = dotFile.WriteString(b.String())
	if err != nil {
		fmt.Println(err)
		return
	}

	// Generar el gráfico con Graphviz
	cmd := exec.Command("dot", "-Tpng", "Estudiantes en cola/queue.dot", "-o", "Estudiantes en cola/queue.png")
	err = cmd.Run()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Archivo de imagen generado en queue.png")
}

func (dll *DoublyLinkedList) ToGraphviz2() error {
	// Abrir el archivo de salida
	f, err := os.Create("Lista doble/lista.dot")
	if err != nil {
		return err
	}
	defer f.Close()

	// Escribir el encabezado del archivo DOT
	_, err = fmt.Fprintln(f, "digraph G {")
	if err != nil {
		return err
	}

	// Agregar los atributos shape y rankdir
	_, err = fmt.Fprintln(f, "  node [shape=box];")
	if err != nil {
		return err
	}
	_, err = fmt.Fprintln(f, "  rankdir=LR;")
	if err != nil {
		return err
	}

	// Recorrer la lista doblemente enlazada y escribir los nodos
	node := dll.head
	for node != nil {
		nodeLabel := fmt.Sprintf("%s %s\n%s", node.user.nombre, node.user.apellido, node.user.carnet)
		_, err = fmt.Fprintf(f, "  %s [label=\"%s\"];\n", node.user.carnet, nodeLabel)
		if err != nil {
			return err
		}
		node = node.next
	}

	// Recorrer la lista doblemente enlazada y escribir las conexiones
	node = dll.head
	for node != nil {
		if node.next != nil {
			_, err = fmt.Fprintf(f, "  %s -> %s [dir=both];\n", node.user.carnet, node.next.user.carnet)
			if err != nil {
				return err
			}
		}
		node = node.next
	}

	// Escribir el pie del archivo DOT
	_, err = fmt.Fprintln(f, "}")
	if err != nil {
		return err
	}

	// Ejecutar el comando dot para generar el archivo PNG
	cmd := exec.Command("dot", "-Tpng", "Lista doble/lista.dot", "-o", "Lista doble/lista.png")
	err = cmd.Run()
	if err != nil {
		return err
	}

	return nil
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
