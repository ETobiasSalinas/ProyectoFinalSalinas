import remeras from './datos.js'; 

window.toggleCarrito = function() {
    const carrito = document.querySelector('.container-productos');
    carrito.classList.toggle('visible-cart'); 
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

window.agregarAlCarrito = function(id) {
    const carrito = obtenerCarrito();
    const producto = remeras.find(prod => prod.id === id);

    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    const productoEnCarrito = carrito.find(prod => prod.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;  
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito(carrito);
    mostrarCarrito();
    actualizarContadorCarrito();
};

async function mostrarRemeras() {
    const remerasDiv = document.getElementById("remeras");
    remerasDiv.innerHTML = '';  

    remeras.forEach(remera => {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${remera.imagen}" alt="${remera.tipo}">
            <h3>${remera.tipo}</h3>
            <p>${remera.resumen}</p>
            <p>Precio: $${remera.precio}</p>
            <button data-id="${remera.id}">Comprar</button>
        `;
        remerasDiv.appendChild(div);

        const botonCompra = div.querySelector('button');
        botonCompra.addEventListener('click', () => agregarAlCarrito(remera.id));
    });
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const contadorProductos = document.getElementById('contador-productos');
    const totalPagar = document.getElementById('carritoTotal');
    const cartProductList = document.getElementById('carritoLista');
    
    let totalCantidad = 0;
    let totalPrecio = 0;

    cartProductList.innerHTML = '';  

    carrito.forEach(producto => {
        let div = document.createElement('div');
        div.innerHTML = `
            <p>${producto.tipo} - Cantidad: ${producto.cantidad} - Precio: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;
        cartProductList.appendChild(div);

        totalCantidad += producto.cantidad;
        totalPrecio += producto.precio * producto.cantidad;
    });

    contadorProductos.textContent = totalCantidad;
    totalPagar.textContent = `$${totalPrecio.toFixed(2)}`;
}


window.eliminarDelCarrito = function(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(prod => prod.id !== id);
    guardarCarrito(carrito);
    mostrarCarrito();
    actualizarContadorCarrito();
}

window.finalizarCompra = function() {
    const CARRITO = obtenerCarrito(); 

    if (CARRITO.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Tu carrito está vacío. Agrega productos antes de finalizar la compra.'
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Compra exitosa',
            text: 'Gracias por tu compra'
        }).then(() => {
            localStorage.setItem('carrito', JSON.stringify([]));
            mostrarCarrito();  
            actualizarContadorCarrito();  
        });
    }
}


function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalCantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    const contadorProductos = document.getElementById('contador-productos');
    contadorProductos.textContent = totalCantidad;
}

mostrarRemeras();
