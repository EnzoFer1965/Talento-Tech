const CLAVE = "la-tienda-carrito-v1";

export function obtenerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) || "[]");
    if (!Array.isArray(datos)) return [];
    return datos.filter(item =>
      item && typeof item.id === "string" && typeof item.nombre === "string" &&
      Number.isFinite(item.precio) && item.precio >= 0 &&
      Number.isSafeInteger(item.cantidad) && item.cantidad > 0 && item.cantidad <= 999
    );
  } catch (error) {
    console.error("No se pudo leer el carrito", error);
    return [];
  }
}

export function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
    return true;
  } catch (error) {
    console.error("No se pudo guardar el carrito", error);
    return false;
  }
}

export function cantidadTotal() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

export function agregarProducto(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    if (existente.cantidad >= 999) return false;
    existente.cantidad++;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }
  return guardarCarrito(carrito);
}
