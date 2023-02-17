package main

import (
	"bufio"
	"fmt"
	"os"
)

type User struct {
	name     string
	surname  string
	username string
	password string
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
	var name, surname, username, password string

	fmt.Println("Ingrese datos para agregar a la cola (presione Enter para terminar):")
	scanner := bufio.NewScanner(os.Stdin)

	for {
		fmt.Print("Nombre: ")
		scanner.Scan()
		name = scanner.Text()
		if name == "" {
			break
		}

		fmt.Print("Apellido: ")
		scanner.Scan()
		surname = scanner.Text()

		fmt.Print("Usuario: ")
		scanner.Scan()
		username = scanner.Text()

		fmt.Print("Contraseña: ")
		scanner.Scan()
		password = scanner.Text()

		user := User{name: name, surname: surname, username: username, password: password}
		queue.Enqueue(user)
	}

	fmt.Println("Los usuarios en la cola son:")
	for i, user := range queue {
		fmt.Printf("%d - Nombre: %s, Apellido: %s, Usuario: %s, Contraseña: %s\n", i+1, user.name, user.surname, user.username, user.password)
	}

	doublyLinkedList := DoublyLinkedList{}

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
		fmt.Printf("¿Desea agregar al usuario %s %s a la lista doblemente enlazada? (y/n): ", user.name, user.surname)
		scanner.Scan()
		answer = scanner.Text()
		if answer == "y" {
			doublyLinkedList.Insert(user)
			fmt.Printf("El usuario %s %s ha sido agregado a la lista doblemente enlazada\n", user.name, user.surname)
		}
	}

	fmt.Println("Los usuarios en la lista doblemente enlazada son:")
	for node := doublyLinkedList.head; node != nil; node = node.next {
		fmt.Printf("Nombre: %s, Apellido: %s, Usuario: %s, Contraseña: %s\n", node.user.name, node.user.surname, node.user.username, node.user.password)
	}
}
