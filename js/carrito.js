import { obtenerCarrito, guardarCarrito } from "./almacenamiento.js";

const lista = document.getElementById("lista-carrito");
const total = document.getElementById("total-carrito");
const vaciar = document.getElementById("vaciar-carrito");
const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency", currency: "ARS", maximumFractionDigits: 0
});

function modificar(id, cambio) {
  const carrito = obtenerCarrito();
  const item = carrito.find(producto => producto.id === id);
  if (!item) return;
  item.cantidad += cambio;
  if (item.cantidad <= 0) carrito.splice(carrito.indexOf(item), 1);
  if (item.cantidad > 999) return;
  if (guardarCarrito(carrito)) renderizar();
  else alert("No se pudo guardar el cambio.");
}

function crearBoton(texto, accion, descripcion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.setAttribute("aria-label", descripcion);
  boton.addEventListener("click", accion);
  return boton;
}

function renderizar() {
  if (!lista || !total || !vaciar) return;
  const carrito = obtenerCarrito();
  lista.replaceChildren();
  for (const item of carrito) {
    const fila = document.createElement("li");
    fila.className = "item-carrito";
    const nombre = document.createElement("span");
    nombre.textContent = item.nombre;
    const subtotal = document.createElement("span");
    subtotal.textContent = formatoPrecio.format(item.precio * item.cantidad);
    const controles = document.createElement("div");
    controles.className = "controles-carrito";
    const cantidad = document.createElement("span");
    cantidad.textContent = `Cantidad: ${item.cantidad}`;
    controles.append(
      crearBoton("−", () => modificar(item.id, -1), `Quitar una unidad de ${item.nombre}`),
      cantidad,
      crearBoton("+", () => modificar(item.id, 1), `Agregar una unidad de ${item.nombre}`),
      crearBoton("Eliminar", () => {
        const nuevo = obtenerCarrito().filter(producto => producto.id !== item.id);
        if (guardarCarrito(nuevo)) renderizar();
        else alert("No se pudo eliminar el producto.");
      }, `Eliminar ${item.nombre}`)
    );
    fila.append(nombre, controles, subtotal);
    lista.append(fila);
  }
  if (carrito.length === 0) {
    const mensaje = document.createElement("li");
    mensaje.textContent = "Tu carrito está vacío.";
    lista.append(mensaje);
  }
  total.textContent = formatoPrecio.format(carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0));
  vaciar.disabled = carrito.length === 0;
}

if (vaciar) vaciar.addEventListener("click", () => {
  if (guardarCarrito([])) renderizar();
  else alert("No se pudo vaciar el carrito.");
});
renderizar();
