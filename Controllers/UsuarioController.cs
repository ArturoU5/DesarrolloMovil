using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lavanderia.Data;
using Lavanderia.Models;

namespace Lavanderia.Api.Controllers
{
    [Route("api/usuarios")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/usuarios
        // Listar todos los usuarios o filtrar por estado activo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios(bool? activo)
        {
            var query = _context.Usuarios.AsQueryable();

            if (activo.HasValue)
            {
                query = query.Where(u => u.Activo == activo.Value);
            }

            return await query.ToListAsync();
        }

        // GET: api/usuarios/5
        // Obtener detalle de un usuario
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null)
                return NotFound();

            return usuario;
        }

        // GET: api/usuarios/buscar?texto=juan
        // Buscar por nombre, apellido, correo o cargo
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<Usuario>>> Buscar(string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
                return await _context.Usuarios.ToListAsync();

            texto = texto.ToLower();

            var usuarios = await _context.Usuarios
                .Where(u =>
                    u.Nombre.ToLower().Contains(texto) ||
                    u.Apellido.ToLower().Contains(texto) ||
                    u.Correo.ToLower().Contains(texto) ||
                    u.Cargo.ToLower().Contains(texto))
                .ToListAsync();

            return usuarios;
        }

        // POST: api/usuarios
        // Crear un nuevo usuario
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        // PUT: api/usuarios/5
        // Actualizar un usuario completo
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
                return BadRequest("El ID no coincide.");

            var usuarioActual = await _context.Usuarios.FindAsync(id);

            if (usuarioActual == null)
                return NotFound();

            usuarioActual.Nombre = usuario.Nombre;
            usuarioActual.Apellido = usuario.Apellido;
            usuarioActual.Correo = usuario.Correo;
            usuarioActual.Telefono = usuario.Telefono;
            usuarioActual.Cargo = usuario.Cargo;
            usuarioActual.Activo = usuario.Activo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/usuarios/5
        // Eliminar un usuario
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
