/**
 * Validaciones del formulario de Solicitud.
 * Cada función retorna un string con el mensaje de error, o null si es válido.
 * Se muestran debajo de cada input, como pide la rúbrica.
 */

export const validarClienteNombre = (valor) => {
  if (!valor || !valor.trim()) return 'El nombre del cliente es obligatorio.';
  if (valor.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
  return null;
};

export const validarTelefono = (valor) => {
  if (!valor || !valor.trim()) return 'El teléfono es obligatorio.';
  const soloNumeros = /^[0-9]{6,9}$/;
  if (!soloNumeros.test(valor.trim())) {
    return 'Ingresa un teléfono válido (6 a 9 dígitos).';
  }
  return null;
};

export const validarDireccion = (valor) => {
  if (!valor || !valor.trim()) return 'La dirección es obligatoria.';
  if (valor.trim().length < 5) return 'Describe la dirección con más detalle.';
  return null;
};

export const validarServicio = (valor) => {
  if (!valor) return 'Selecciona un tipo de servicio.';
  return null;
};

export const validarDescripcion = (valor) => {
  if (!valor || !valor.trim()) return 'La descripción es obligatoria.';
  if (valor.trim().length < 10) return 'Agrega más detalle (mínimo 10 caracteres).';
  return null;
};

export const validarFormularioSolicitud = (form) => {
  const errores = {
    clienteNombre: validarClienteNombre(form.clienteNombre),
    telefono: validarTelefono(form.telefono),
    direccion: validarDireccion(form.direccion),
    servicioId: validarServicio(form.servicioId),
    descripcion: validarDescripcion(form.descripcion),
  };
  const esValido = Object.values(errores).every((e) => e === null);
  return { errores, esValido };
};
