const containerProductos = document.getElementById('container-producto')
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

// Llama a la función detectScreenSize cuando se carga la página y cuando se redimensiona la ventana
window.onload = detectScreenSize;
window.onresize = detectScreenSize;

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
