package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
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

// Generar archivo JSON
func (dll *DoublyLinkedList) ToJSON() error {
	// Crear la estructura de datos para almacenar a los alumnos
	alumnos := Alumnos{}

	// Recorrer la lista enlazada y agregar cada alumno a la lista de la estructura de datos
	currentNode := dll.head
	for currentNode != nil {
		alumno := struct {
			Nombre       string `json:"nombre"`
			Carnet       string `json:"carnet"`
			Contraseña   string `json:"contraseña"`
			Carpeta_raiz string `json:"carpeta_raiz"`
		}{
			Nombre:       currentNode.user.nombre + " " + currentNode.user.apellido,
			Carnet:       currentNode.user.carnet,
			Contraseña:   currentNode.user.contraseña,
			Carpeta_raiz: "/",
		}
		alumnos.Alumnos = append(alumnos.Alumnos, alumno)
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
	err = encoder.Encode(alumnos)
	if err != nil {
		fmt.Println("Error al escribir datos en archivo .json:", err)
		return err
	}
	fmt.Println("Archivo .json generado exitosamente")

	return nil
}

type Alumnos struct {
	Alumnos []alumno `json:"alumnos"`
}

type alumno struct {
	Nombre       string `json:"nombre"`
	Carnet       string `json:"carnet"`
	Contraseña   string `json:"contraseña"`
	Carpeta_raiz string `json:"carpeta_raiz"`
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
