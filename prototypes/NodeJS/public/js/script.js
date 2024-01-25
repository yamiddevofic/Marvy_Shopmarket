function bloquearRetroceso() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
}
window.addEventListener('load', bloquearRetroceso);


var fechaYHoraElemento = document.getElementById("fechaYHora");
function actualizarFechaYHora() {
    var fechaHoraActual = new Date();
        fechaYHoraElemento.innerHTML = fechaHoraActual.toLocaleString();
    }
// Actualizo la fecha y hora cada segundo
setInterval(actualizarFechaYHora, 1000);
// Mostrar la fecha y hora inicial
actualizarFechaYHora();


function menu_desplegable() {
    var menu = document.getElementById("menu_desplegable");
    var fondo = document.getElementById("fondo_oscuro");
    var circle_opc = document.getElementById("circle_opc");
    var menuDos = document.getElementById("menu_desplegable_2");
    if ((menu.style.display === "none" && fondo.style.display === "none" && menuDos.style.display==="none")){
        fondo.style.display = "block";
        fondo.style.position = "fixed";
        menu.style.position = "absolute";
        menu.style.display = "flex";
        circle_opc.style.display = "none";
  
    } else {
        menu.style.display = "none";
        fondo.style.display = "none";
        circle_opc.style.display = "flex";
        menuDos.style.display = "none";
    }
    
}

function cerrar_menu() {
    var menu = document.getElementById("menu_desplegable");
    var fondo = document.getElementById("fondo_oscuro");
    var circle_opc = document.getElementById("circle_opc");
    menu.style.display = "none";
    circle_opc.style.display = "flex";
    var fondo = document.getElementById("fondo_oscuro");
    fondo.style.display = "none";
    menuDos.style.display = "flex";
}

function toggleMenu() {
    var menu = document.getElementById("menu_desplegable_2");
    menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "flex" : "none";
}


