import { agregarProducto, cantidadTotal } from "./almacenamiento.js";

const contenedor = document.getElementById("catalogo-productos");
const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta";

  const imagen = document.createElement("img");
  imagen.src = `./${producto.img}`;
  imagen.alt = producto.alt;

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.textContent = producto.descripcion;

  const precio = document.createElement("p");
  precio.className = "precio";
  precio.textContent = formatoPrecio.format(producto.precio);

  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = "Agregar al carrito";

  boton.addEventListener("click", () => {
    if (agregarProducto(producto)) actualizarContador();
    else alert("No se pudo guardar el carrito.");
  });

  tarjeta.append(imagen, titulo, descripcion, precio, boton);
  return tarjeta;
}

async function cargarCatalogo() {
  if (!contenedor) return;

  try {
    const respuesta = await fetch("./data/productos.json");
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const productos = await respuesta.json();
    if (!Array.isArray(productos) || !productos.every(producto =>
      typeof producto.id === "string" &&
      typeof producto.nombre === "string" &&
      typeof producto.descripcion === "string" &&
      Number.isFinite(producto.precio) && producto.precio >= 0 &&
      typeof producto.img === "string" &&
      typeof producto.alt === "string"
    )) throw new Error("Formato de catálogo inválido");

    const tarjetas = productos.map(crearTarjeta);
    contenedor.replaceChildren(...tarjetas);
  } catch (error) {
    console.error("No se pudo cargar el catálogo; se conservan las tarjetas HTML.", error);
  }
}

function actualizarContador() {
  const enlace = document.querySelector('a[href="./pages/carrito.html"]');
  if (enlace) enlace.textContent = `Carrito (${cantidadTotal()})`;
}

actualizarContador();
cargarCatalogo();
