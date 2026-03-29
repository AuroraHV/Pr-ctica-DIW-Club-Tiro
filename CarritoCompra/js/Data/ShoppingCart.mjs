export class ShoppingCart {
    key;
    carritoActual;
    constructor(key="carrito") {
        this.key=key;
        this.carritoActual=this.getCart();
    }

    //Uso del local storage
    getCart() {
        let carritoMemoria = localStorage.getItem(this.key);
        if (carritoMemoria == null) {
            return new Map();
        } else {
            return new Map(Object.entries(JSON.parse(carritoMemoria)));
        }
    }

    updateLocalStorage(){
        localStorage.setItem(this.key, JSON.stringify(Object.fromEntries(this.carritoActual)));
    }

    //Getters
    getNumberElementInCarrito(name) {
        return this.carritoActual.has(name) ? this.carritoActual.get(name) : 0;
    }

    //Metodos de establecer info

    carritoAumentar(nombreLibro) {
        this.carritoActual.set(nombreLibro, (this.carritoActual.get(nombreLibro) || 0) + 1);
        this.updateLocalStorage();
    }

    carritoReducir(nombreLibro) {      
        if (this.carritoActual.has(nombreLibro)) {
            let nuevoValor = this.carritoActual.get(nombreLibro) - 1;
            if (nuevoValor > 0) {
                this.carritoActual.set(nombreLibro, nuevoValor);
            } else {
                this.carritoActual.delete(nombreLibro);
            }
        }

        this.updateLocalStorage();
    }

    carritoEliminar(nombreLibro) {
        this.carritoActual.delete(nombreLibro);
        this.updateLocalStorage();
    }

    carritoModificarValor(nombreLibro, value) {
        if (value > 0) {
            this.carritoActual.set(nombreLibro, value);
        } else {
            this.carritoActual.delete(nombreLibro);
        }
        this.updateLocalStorage();
    }
}