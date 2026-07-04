using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lavanderia.Data;
using Lavanderia.Models;

namespace Lavanderia.Api.Controllers
{
    [Route("api/servicios")]
    [ApiController]
    public class ServiciosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiciosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/servicios
        // Listar todos los servicios o filtrar por estado activo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Servicio>>> GetServicios(bool? activo)
        {
            var query = _context.Servicios.AsQueryable();

            if (activo.HasValue)
            {
                query = query.Where(s => s.Activo == activo.Value);
            }

            return await query.ToListAsync();
        }

        // GET: api/servicios/5
        // Obtener detalle de un servicio
        [HttpGet("{id}")]
        public async Task<ActionResult<Servicio>> GetServicio(int id)
        {
            var servicio = await _context.Servicios.FirstOrDefaultAsync(s => s.Id == id);

            if (servicio == null)
                return NotFound();

            return servicio;
        }

        // GET: api/servicios/buscar?texto=lavado
        // Buscar por nombre o descripción
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<Servicio>>> Buscar(string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
                return await _context.Servicios.ToListAsync();

            texto = texto.ToLower();

            var servicios = await _context.Servicios
                .Where(s => s.Nombre.ToLower().Contains(texto) || s.Descripcion.ToLower().Contains(texto))
                .ToListAsync();

            return servicios;
        }

        // POST: api/servicios
        // Crear un nuevo servicio
        [HttpPost]
        public async Task<ActionResult<Servicio>> PostServicio(Servicio servicio)
        {
            _context.Servicios.Add(servicio);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServicio), new { id = servicio.Id }, servicio);
        }

        // PUT: api/servicios/5
        // Actualizar un servicio completo
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicio(int id, Servicio servicio)
        {
            if (id != servicio.Id)
                return BadRequest("El ID no coincide.");

            var servicioActual = await _context.Servicios.FindAsync(id);

            if (servicioActual == null)
                return NotFound();

            servicioActual.Nombre = servicio.Nombre;
            servicioActual.Descripcion = servicio.Descripcion;
            servicioActual.Precio = servicio.Precio;
            servicioActual.DuracionEstimada = servicio.DuracionEstimada;
            servicioActual.Activo = servicio.Activo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/servicios/5
        // Eliminar un servicio
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);

            if (servicio == null)
                return NotFound();

            _context.Servicios.Remove(servicio);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
