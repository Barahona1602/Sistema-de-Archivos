package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

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
