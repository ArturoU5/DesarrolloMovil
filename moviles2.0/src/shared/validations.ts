/**
 * Validaciones del formulario de Solicitud.
 * Cada función retorna un string con el mensaje de error, o null si es válido.
 * Se muestran debajo de cada input, como pide la rúbrica.
 */

export const validarClienteNombre = (valor: string): string | null => {
  if (!valor || !valor.trim()) return 'El nombre del cliente es obligatorio.';
  if (valor.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
  return null;
};

export const validarTelefono = (valor: string): string | null => {
  if (!valor || !valor.trim()) return 'El teléfono es obligatorio.';
  const soloNumeros = /^[0-9]{6,9}$/;
  if (!soloNumeros.test(valor.trim())) {
    return 'Ingresa un teléfono válido (6 a 9 dígitos).';
  }
  return null;
};

export const validarDireccion = (valor: string): string | null => {
  if (!valor || !valor.trim()) return 'La dirección es obligatoria.';
  if (valor.trim().length < 5) return 'Describe la dirección con más detalle.';
  return null;
};

export const validarServicio = (valor: string | null): string | null => {
  if (!valor) return 'Selecciona un tipo de servicio.';
  return null;
};

export const validarCantidadPrendas = (valor: string): string | null => {
  if (!valor || !valor.trim()) return 'Indica la cantidad de prendas.';
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) {
    return 'Ingresa un número entero mayor a 0.';
  }
  return null;
};

export const validarPrecio = (valor: string): string | null => {
  if (!valor || !valor.trim()) return 'Indica el precio estimado.';
  const numero = Number(valor);
  if (Number.isNaN(numero) || numero <= 0) {
    return 'Ingresa un precio válido mayor a 0.';
  }
  return null;
};

export const validarDescripcion = (valor: string): string | null => {
  if (!valor || !valor.trim()) return 'La descripción es obligatoria.';
  if (valor.trim().length < 10) return 'Agrega más detalle (mínimo 10 caracteres).';
  return null;
};

export interface FormularioSolicitud {
  clienteNombre: string;
  telefono: string;
  direccion: string;
  servicioId: string | null;
  cantidadPrendas: string;
  precio: string;
  descripcion: string;
}

export interface ErroresFormularioSolicitud {
  clienteNombre: string | null;
  telefono: string | null;
  direccion: string | null;
  servicioId: string | null;
  cantidadPrendas: string | null;
  precio: string | null;
  descripcion: string | null;
}

export const validarFormularioSolicitud = (
  form: FormularioSolicitud
): { errores: ErroresFormularioSolicitud; esValido: boolean } => {
  const errores: ErroresFormularioSolicitud = {
    clienteNombre: validarClienteNombre(form.clienteNombre),
    telefono: validarTelefono(form.telefono),
    direccion: validarDireccion(form.direccion),
    servicioId: validarServicio(form.servicioId),
    cantidadPrendas: validarCantidadPrendas(form.cantidadPrendas),
    precio: validarPrecio(form.precio),
    descripcion: validarDescripcion(form.descripcion),
  };
  const esValido = Object.values(errores).every((e) => e === null);
  return { errores, esValido };
};
