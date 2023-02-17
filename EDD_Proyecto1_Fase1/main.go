package main

import (
	"bufio"
	"fmt"
	"os"
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

func main() {
	queue := Queue{}
	var nombre, apellido, carnet, contraseña string
	for {
		fmt.Println("* * * * * * * Administración de usuarios * * * * * * *")
		fmt.Println("*      1. Ver estudiantes pendientes de aprobación   *")
		fmt.Println("*      2. Ver estudiantes aprobados                  *")
		fmt.Println("*      3. Registrar nuevo estudiante                 *")
		fmt.Println("*      4. Carga masiva de estudiantes                *")
		fmt.Println("*      5. Cerrar sesión                              *")
		fmt.Println("* * * * * * * * * * * * * *  * * * * * * * * * * * * *")

		var choice int
		fmt.Scan(&choice)
		scanner := bufio.NewScanner(os.Stdin)
		scanner.Scan()
		doublyLinkedList := DoublyLinkedList{}

		switch choice {
		case 1:
			fmt.Println("Ha seleccionado la opción 1")
			fmt.Println("Los usuarios en la cola son:")
			for i, user := range queue {
				fmt.Printf("%d - Nombre: %s, Apellido: %s, Usuario: %s, Contraseña: %s\n", i+1, user.nombre, user.apellido, user.carnet, user.contraseña)
			}

			for {
				fmt.Print("¿A qué usuario desea aprobar? (0 para terminar): ")
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
				fmt.Printf("¿Desea agregar al usuario %s %s a la lista doblemente enlazada? (y/n): ", user.nombre, user.apellido)
				scanner.Scan()
				answer = scanner.Text()
				if answer == "y" {
					doublyLinkedList.Insert(user)
					fmt.Printf("El usuario %s %s ha sido agregado a la lista doblemente enlazada\n", user.nombre, user.apellido)
				}

			}
			//Arreglar lista doblemente enlazada
		case 2:
			fmt.Println("Ha seleccionado la opción 2")
			fmt.Println("Los usuarios en la lista doblemente enlazada son:")
			for node := doublyLinkedList.head; node != nil; node = node.next {
				fmt.Printf("Nombre: %s, Apellido: %s, Usuario: %s, Contraseña: %s\n", node.user.nombre, node.user.apellido, node.user.carnet, node.user.contraseña)
			}

		case 3:
			fmt.Println("Ha seleccionado la opción 3")
			fmt.Println("Ingrese datos para agregar a la cola:")
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

				fmt.Print("Usuario: ")
				scanner.Scan()
				carnet = scanner.Text()

				fmt.Print("Contraseña: ")
				scanner.Scan()
				contraseña = scanner.Text()

				user2 := User{nombre: nombre, apellido: apellido, carnet: carnet, contraseña: contraseña}
				queue.Enqueue(user2)
			}
		case 4:
			fmt.Println("Ha seleccionado la opción 4")
		case 5:
			return
		default:
			fmt.Println("Opción inválida, por favor intente de nuevo.")
		}
	}

}
