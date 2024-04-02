
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