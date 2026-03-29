import {htmlToElement} from "./Utils.mjs";

class Product {
    //Diseñamos la tarjeta de producto y asociamos los eventos
    static  nuevoNodoProducto(titulo,img, carrito, value=0) {
        var html = /*html*/`<li class="cartaLi flex">
                        <div class="card p-2 my-2">
                            <div class="card-body">
                                <p class="card-title">${titulo}</p>
                                <img  src="${img}" /><br>
                                <button type="button" class="btn btn-primary aumentar">+1</button>
                                <button type="button" class="btn btn-primary reducir">-1</button>
                                <button type="button" class="btn btn-primary eliminar">Delete</button>
                                <div class="input-group"> 
                                    <input class="toValue form-control" type="number" min="0" max="10" value="${value}"/>
                                    <span class="input-group-btn">
                                        <button type="button" class="input-group-btn btn  btn-outline-secondary toValueButton">+</button>
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                    </li>`;

        let nodo=htmlToElement(html);

        //Asocio eventos (pongo multiples tipos a modo de ejemplo). Esto se podría utilizar como callback si se quiere separar Product de ShoppingCart
        //SOLO DEJAR LOS QUE SE QUIERAN UTILIZAR
        nodo.querySelector(".aumentar").addEventListener("click",()=>carrito.carritoAumentar(titulo));
        nodo.querySelector(".reducir").addEventListener("click",()=>carrito.carritoReducir(titulo));
        nodo.querySelector(".eliminar").addEventListener("click",()=>carrito.carritoEliminar(titulo));

        //Activar uno u otro dependiendo se se quiere que se actualice el valor al interactuar con el input o al pulsar el botón
        nodo.querySelector(".toValueButton").addEventListener("click",function () {
            carrito.carritoModificarValor(titulo,this.parentNode.parentNode.querySelector(".toValue").value);}
        );
        //nodo.querySelector(".toValue").addEventListener("input",function () {carrito.carritoModificarValor(titulo,this.value)});

        return nodo;
    }

    static  nuevoNodoProductoDesplegable(titulo) {
        var html = /*html*/ `<li>${titulo}</li>`;
        return htmlToElement(html);
    }
}

export {Product};