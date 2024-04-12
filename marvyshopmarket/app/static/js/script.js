const container = document.getElementById('container')
const containerProductos = document.getElementById('container-producto')
const check = document.getElementById('dark')
// Función para detectar el tamaño de la pantalla
function detectScreenSize() {
    // Obtiene el ancho y alto de la pantalla
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    // Verifica si el ancho de la pantalla es igual o mayor a cierto valor (por ejemplo, 800px)
    if (screenWidth < 960) {

        fetch('/datos')
            .then(response => response.json())
            .then(data => {
                let contenidoHTML = '';
                data.forEach(producto => {
                    if (producto.cantidad>5 && producto.cantidad<10){
                        contenidoHTML += `
                        <div style="padding: 2%; background: yellow; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                            <div>
                                <a href="/editar-producto/${producto.id}" style="color: var(--claro-principal);" class="editar-producto"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a href="/eliminar-producto/${ producto.id }" style="color: var(--btn-claro-cancelar)" class="eliminar-producto"><i class="fas fa-trash-alt"></i></a>
                            </div>
                            <div>${producto.id}</div>
                            <div></div><img src="data:image/png;base64,${producto.imagen}" width= 20%;>
                            <div>Nombre: ${producto.nombre}<br></div>
                            <div>Cantidad: ${producto.cantidad}<br></div>
                            <div>Precio: ${producto.precio}<br></div>
                            <div>Tienda: ${producto.tienda.nombre}<br></div>
                            <div>Ubicación: ${producto.tienda.ubicacion}</div>
                        </div>`;
                    }else if (producto.cantidad >0 && producto.cantidad <=5){
                        contenidoHTML += `
                        <div style="padding: 2%; background: orange; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                            <div>
                                <a href="/editar-producto/${producto.id}" style="color: var(--claro-principal);" class="editar-producto"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a href="/eliminar-producto/${ producto.id }" style="color: var(--btn-claro-cancelar)" class="eliminar-producto"><i class="fas fa-trash-alt"></i></a>
                            </div>
                            <div>${producto.id}</div>
                            <div></div><img src="data:image/png;base64,${producto.imagen}" width= 20%;>
                            <div>Nombre: ${producto.nombre}<br></div>
                            <div>Cantidad: ${producto.cantidad}<br></div>
                            <div>Precio: ${producto.precio}<br></div>
                            <div>Tienda: ${producto.tienda.nombre}<br></div>
                            <div>Ubicación: ${producto.tienda.ubicacion}</div>
                        </div>`;
                    }else if (producto.cantidad >=10){
                        contenidoHTML += `
                        <div style="padding: 2%; background: #62BF04; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                            <div>
                                <a href="/editar-producto/${producto.id}" style="color: var(--claro-principal);" class="editar-producto"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a href="/eliminar-producto/${ producto.id }" style="color: var(--btn-claro-cancelar)" class="eliminar-producto"><i class="fas fa-trash-alt"></i></a>
                            </div>
                            <div>${producto.id}</div>
                            <div></div><img src="data:image/png;base64,${producto.imagen}" width= 20%;>
                            <div>Nombre: ${producto.nombre}<br></div>
                            <div>Cantidad: ${producto.cantidad}<br></div>
                            <div>Precio: ${producto.precio}<br></div>
                            <div>Tienda: ${producto.tienda.nombre}<br></div>
                            <div>Ubicación: ${producto.tienda.ubicacion}</div>
                        </div>`;
                    }else{
                        contenidoHTML += `
                        <div style="padding: 2%; background: red; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                            <div></div><img src="data:image/png;base64,${producto.imagen}" width= 20%;>
                            <div>Nombre: ${producto.nombre}<br></div>
                            <div>Cantidad: ${producto.cantidad}<br></div>
                            <div>Precio: ${producto.precio}<br></div>
                            <div>Tienda: ${producto.tienda.nombre}<br></div>
                            <div>Ubicación: ${producto.tienda.ubicacion}</div>
                        </div>`;
                    }
                });
                containerProductos.innerHTML = contenidoHTML;
            });
    }

    // // Verifica si el alto de la pantalla es igual o mayor a cierto valor (por ejemplo, 600px)
    // if (screenHeight == 600) {
    //     // Ejecutar código cuando la pantalla tiene un alto igual o mayor a 600px
    //     console.log("La pantalla tiene al menos 600px de alto.");
    // }
}

// Función para activar el modo oscuro
function activarModoOscuro() {
    document.body.classList.remove('dark-mode');
}

// Función para desactivar el modo oscuro
function desactivarModoOscuro() {
    document.body.classList.add('dark-mode');
}

// Función para guardar la preferencia del usuario en el almacenamiento local
function guardarPreferenciaModoOscuro(darkValue) {
    localStorage.setItem('modoOscuro', darkValue);
}

// Función para cargar la preferencia del usuario desde el almacenamiento local
function cargarPreferenciaModoOscuro() {
    const darkValue = localStorage.getItem('modoOscuro');
    if (darkValue === '1') {
        activarModoOscuro();
        check.checked = true;
    } else {
        desactivarModoOscuro();
        check.checked = false;
    }
}


// Manejar el cambio en el checkbox
check.addEventListener('change', function() {
    const darkValue = this.checked ? '1' : '0';
    if (this.checked) {
        activarModoOscuro();
    } else {
        desactivarModoOscuro();
    }
    guardarPreferenciaModoOscuro(darkValue);
});

// Cargar la preferencia del usuario al cargar la página
window.addEventListener('load', function() {
    detectScreenSize();
    cargarPreferenciaModoOscuro();
});

const menu = document.getElementById('menu-hamburguesa');
const menuDesplegable = document.getElementById('menu-desplegable');
const cerrar= document.querySelector('.cerrar')
const cerrar_dos= document.querySelector('.cerrar_dos')
const buscador= document.getElementById('buscador-container')

menu.addEventListener('click', () => {
    menuDesplegable.style.display = 'flex';
});

cerrar.addEventListener('click',()=>{
    menuDesplegable.style.display = 'none';
})
cerrar_dos.addEventListener('click', ()=>{
    window.location.href= '/home';
})




// function eliminarRegistro(id) {
//     // Aquí puedes hacer lo que quieras con el ID del registro
//     console.log("Eliminar registro con ID:", id);
//     // Por ejemplo, puedes enviar una solicitud AJAX para eliminar el registro del backend
// }