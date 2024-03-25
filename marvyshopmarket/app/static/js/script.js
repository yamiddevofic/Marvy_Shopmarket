const menu = document.getElementById('menu-hamburguesa');
const menuDesplegable = document.getElementById('menu-desplegable');
const cerrar= document.querySelector('.cerrar')

menu.addEventListener('click', () => {
    menuDesplegable.style.display = 'flex';
});

cerrar.addEventListener('click',()=>{
    menuDesplegable.style.display = 'none'
})

// function eliminarRegistro(id) {
//     // Aquí puedes hacer lo que quieras con el ID del registro
//     console.log("Eliminar registro con ID:", id);
//     // Por ejemplo, puedes enviar una solicitud AJAX para eliminar el registro del backend
// }