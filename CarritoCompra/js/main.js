//Dependencias
import {ShoppingCart} from "./Data/ShoppingCart.mjs";
import {solicarProductosServer} from "./AJAX/memeAPI.mjs";
import {Product} from "./Components/Product.mjs";

//Variables globables
let carrito;
let queryContenido=".content";
let queryDesplegable=".carritoDesplegable";
let queryDesplegado=".carritoDesplegado";


//Inicialización de la página
window.addEventListener("load",init);

async function init(){
    //Inicialización del carrito
    carrito=new ShoppingCart();
    //Obtengo posición DIV principal
    var div=document.querySelector(queryContenido);

    //Obtengo productos de Servidor
    var productos= await solicarProductosServer();

    //Añado los productos del servidor
    for(let i=0;i<3;i++){
        var nodo=Product.nuevoNodoProducto(productos[i].name,productos[i].url,carrito,1)
        div.appendChild(nodo);
    }

    //Carrito desplegable
    document.querySelector(queryDesplegable).addEventListener("mouseenter",mostrarCarrito);
    document.querySelector(queryDesplegable).addEventListener("mouseleave",ocultarCarrito);

}



//Carrito desplegable
function mostrarCarrito(){
    let nodo=document.querySelector(queryDesplegado);
    actualizarDesplegable(nodo,carrito.carritoActual);
    nodo.style.display="block";
}

function ocultarCarrito(){
    document.querySelector(queryDesplegado).style.display="none"
}

function actualizarDesplegable(nodo,carritoActual){
    //1. Obtengo la capa donde voy a mostrar la información
    var carritoDespl=nodo;

    //2. Elimino el contenido actual de dicha capa
    while(carritoDespl.firstChild) carritoDespl.removeChild(carritoDespl.firstChild);

    //3. Añado los elementos actuales del carrito a la capa
    for (let [key, value] of carritoActual) {
        var nodo=Product.nuevoNodoProductoDesplegable(`${key} - ${value}`);
        carritoDespl.appendChild(nodo);
    }
}