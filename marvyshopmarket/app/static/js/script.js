const menu = document.getElementById('menu-hamburguesa');
const menuDesplegable = document.getElementById('menu-desplegable');
const cerrar= document.querySelector('.cerrar')

menu.addEventListener('click', () => {
    menuDesplegable.style.display = 'flex';
});

cerrar.addEventListener('click',()=>{
    menuDesplegable.style.display = 'none'
})

