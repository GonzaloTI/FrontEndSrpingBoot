let carrito = [];
// Recuperar el ID y el nombre del usuario del almacenamiento local
const storedUserId = localStorage.getItem('userId');
const storedUserName = localStorage.getItem('userName');

// Obtener referencias a los elementos en el HTML
const userNameElement = document.getElementById('user-name');
const userIdElement = document.getElementById('user-id');

// Verificar si los datos están presentes
if (storedUserId && storedUserName) {
  // Actualizar los elementos con los datos del usuario
  userNameElement.textContent = storedUserName;
  userIdElement.textContent = storedUserId;
} else {
  // Los datos no están presentes en el almacenamiento local
  console.log('No se encontraron datos en el almacenamiento local.');
}
function insertarCliente() {
    // Obtener datos del formulario
    var nombre = document.getElementById('nombre').value;
    var nit = document.getElementById('nit').value;
    var email = document.getElementById('email').value;

    // Objeto cliente
    var cliente = {
        nombre: nombre,
        nit: nit,
        email: email
    };

    // Enviar cliente al servidor
    fetch('http://localhost:8098/cliente/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (response.ok) {
            console.log('Cliente insertado correctamente');
        } else {
            console.error('Error al insertar el cliente');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function insertarProducto(producto) {
    console.log( JSON.stringify(producto))
    fetch('http://localhost:8098/producto/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      
    })
    .then(response => {
        if (response.ok) {
            console.log('producto insertado correctamente');
        } else {
            console.error('Error al insertar el producto');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function cargarProductos() {
    fetch('http://localhost:8098/producto/viewall')
        .then(response => response.json())
        .then(data => mostrarProductos(data.object))
        .catch(error => console.error('Error al cargar los productos:', error));
}

// Función para mostrar los productos en la tabla
function mostrarProductos(productos) {
    const tabla = document.querySelector('#tablaProductos');
    const tablaBody = tabla.querySelector('tbody');

    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.stock}</td>
          
            <td>${producto.precio}</td>
            <td>
                <button onclick="agregarAlCarrito(${producto.id},'${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    tabla.style.display = 'block';
}


function agregarAlCarrito(id, nombre, precio) {
    const cantidadInput = document.querySelector('.input-cantidad');
    const cant = parseInt(cantidadInput.value);
    // Agregar el producto al carrito
    carrito.push({ id: id, nombre: nombre, precio: precio, cantidad:cant });
    
    // Actualizar la vista del carrito
    actualizarVistaCarrito(); 
     var totalActual = parseFloat(document.getElementById('totalValor').textContent.substring(1)); // Obtener el total actual como número
    var nuevoTotal = totalActual + precio;
    document.getElementById('totalValor').textContent = '$' + nuevoTotal.toFixed(2); // Actualizar el contenido
}

// Función para actualizar la vista del carrito
function actualizarVistaCarrito() {
    // Limpiar la vista actual del carrito
    document.getElementById('listaCarrito').innerHTML = '';

    // Agregar cada producto del carrito a la vista
    carrito.forEach(producto => {
        // Crear un elemento de lista
        const listItem = document.createElement('li');
        // Agregar el nombre y precio del producto como texto del elemento de lista
        listItem.textContent = `${producto.id} -${producto.nombre} - ${producto.precio} - ${producto.cantidad}`;
        // Agregar el elemento de lista al ul del carrito
        document.getElementById('listaCarrito').appendChild(listItem);
    });
}



// Agregar un evento 'click' al botón
document.addEventListener('DOMContentLoaded', function() {
    const btnTerminarCompra = document.querySelector('.btn-terminar'); // Selecciona por clase
    
    if (btnTerminarCompra) {
        btnTerminarCompra.addEventListener('click', function() {
            enviarCarritoPorAPI();
        });
    } else {
        console.error('No se encontró ningún botón con la clase btn-terminar en el DOM.');
    }
});

function enviarCarritoPorAPI() {
   // Recuperar el ID del usuario del almacenamiento local y convertirlo a entero
const storedUserId = parseInt(localStorage.getItem('userId'), 10);
datos={};
userlist=[]
userlist.push({user:storedUserId})

     datos = {
        carrito: carrito,
        user:userlist
    };
  
    
    console.log(JSON.stringify(datos));
    // Configurar la solicitud fetch
    fetch('http://localhost:8098/carrito/creardetalle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
      
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        // Aquí puedes manejar la respuesta del servidor, si es necesario
    })
    .catch(error => {
        console.error('Error al enviar el carrito:', error);
    });
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the username and password from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const passwordInt = parseInt(password);
    // Create an object with the login data
    const loginData = {
        email: username,
        nit: passwordInt
    };

    console.log( JSON.stringify(loginData));

    // Send the login data to the API
    fetch('http://localhost:8098/cliente/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        // Handle successful login
        console.log('Login successful:', data);

        console.log('ID:', data.object.id);
        console.log('Nombre:', data.object.nombre);
        console.log('Email:', data.object.email);

        localStorage.setItem('userId',data.object.id);
        localStorage.setItem('userName', data.object.nombre);
    })
    .catch(error => {
        // Handle login error
        console.error('Login error:', error.message);
    });
});

