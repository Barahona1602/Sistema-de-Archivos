class HashTable {
    constructor() {
      this.table = new Array(7); // Creamos un array de tamaño `size` para almacenar la tabla hash
      this.items = 0; // Inicializamos la cantidad de elementos en cero
      this.prime = 11; // Creamos un número primo inicial para aumentar la capacidad de la tabla cuando sea necesario
    }
  
    // Método para calcular el hash a partir del carnet del usuario
    hash(carnet) {
      const encodedCarnet = carnet.toString().split("").reduce((acc, curr) => acc + curr.charCodeAt(0), 0); // Codificamos el carnet convirtiendo cada carácter en su código ASCII y sumándolos
      return encodedCarnet % this.table.length; // Utilizamos el resto de la división entre el valor codificado del carnet y el tamaño de la tabla como índice
    }
  
    // Método para insertar un elemento en la tabla hash
    insert({carnet, nombre, password}) {
        console.log(carnet);
      // Verificamos si la tabla ya ha llegado al 75% de su capacidad
      if ((this.items / this.table.length) >= 0.75) {
        this.increaseSize(); // Si es así, aumentamos el tamaño de la tabla
      }
      const key = this.hash(carnet); // Obtenemos el índice de la tabla a partir del carnet
      let position = key;
      let found = false;
      let jump = 1; // Inicializamos la cantidad de saltos en 1
      while (this.table[position]) { // Mientras haya colisión en la posición
        if (this.table[position].carnet === carnet) { // Si el carnet ya está en la tabla, actualizamos el valor del nodo
          this.table[position].nombre = nombre;
          this.table[position].password = password;
          found = true;
          break;
        }
        position = (key + Math.pow(jump, 2)) % this.table.length; // Aplicamos la fórmula de salto al cuadrado
        jump++; // Incrementamos la cantidad de saltos
      }
      if (!found) { // Si terminamos de recorrer la tabla y no encontramos el carnet, insertamos el nodo
        this.table[position] = {carnet, nombre, password};
        this.items++; // Incrementamos la cantidad de elementos en la tabla
      }
    }
  
    // Método para aumentar el tamaño de la tabla hash
    increaseSize() {
      const primes = [17, 31, 61, 127, 257, 521, 1031, 2053, 4099, 8209, 16411, 32771, 65537]; // Creamos un array de números primos para elegir el próximo número primo adecuado para aumentar el tamaño de la tabla
      const newSize = primes.find(prime => (prime > this.table.length)); // Seleccionamos el primer número primo mayor que el tamaño actual de la tabla
      const tempTable = [...this.table]; // Creamos una copia temporal de la tabla
      this.table = new Array(newSize); // Creamos una nueva tabla con el nuevo tamaño
      this.items = 0; // Reiniciamos la cantidad de elementos en cero
      this.prime = primes[primes.indexOf(newSize) + 1]; // Actualizamos el número primo para la próxima vez que sea necesario aumentar el tamaño de la tabla
      tempTable.forEach(item => { // Recorremos cada elemento de la tabla anterior
        if (item) { // Si el elemento es válido
          this.insert(item); // Insertamos el elemento en la nueva tabla
        }
      });
    }

    loadDataToTable() {
        const studentsData = localStorage.getItem('studentsData');
        if (studentsData) {
          const studentsArray = JSON.parse(studentsData);
          const tableBody = $('#studentsTable tbody'); // Obtén el cuerpo de la tabla HTML
          tableBody.empty(); // Vacía la tabla HTML antes de cargar nuevos datos
      
          studentsArray.forEach(student => { // Recorre cada elemento de la tabla hash
            const { carnet, nombre, password } = student;
            const row = $('<tr>'); // Crea una nueva fila de tabla
            // Crea tres celdas de tabla para el carnet, nombre y contraseña, respectivamente
            const carnetCell = $('<td>').text(carnet);
            const nombreCell = $('<td>').text(nombre);
            const passCell = $('<td>').text(password);
            row.append(carnetCell, nombreCell, passCell); // Agrega las celdas a la fila
            tableBody.append(row); // Agrega la fila al cuerpo de la tabla HTML
          });
        }
      }

  }