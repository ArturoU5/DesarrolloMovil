using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lavanderia.Data;
using Lavanderia.Models;

namespace Lavanderia.Api.Controllers
{
    [Route("api/reservas")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/reservas
        // Listar todas las reservas o filtrar por estado
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas(string? estado)
        {
            var query = _context.Reservas
                .Include(r => r.Usuario)
                .Include(r => r.Servicio)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(estado))
            {
                query = query.Where(r => r.Estado == estado);
            }

            return await query.ToListAsync();
        }

        // GET: api/reservas/5
        // Obtener detalle de una reserva
        [HttpGet("{id}")]
        public async Task<ActionResult<Reserva>> GetReserva(int id)
        {
            var reserva = await _context.Reservas
                .Include(r => r.Usuario)
                .Include(r => r.Servicio)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reserva == null)
                return NotFound();

            return reserva;
        }

        // GET: api/reservas/buscar?texto=juan
        // Buscar por cliente, teléfono, dirección o servicio
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<Reserva>>> Buscar(string texto)
        {
            texto = texto.ToLower();

            var reservas = await _context.Reservas
                .Include(r => r.Usuario)
                .Include(r => r.Servicio)
                .Where(r =>
                    r.Cliente.ToLower().Contains(texto) ||
                    r.Telefono.ToLower().Contains(texto) ||
                    r.Direccion.ToLower().Contains(texto) ||
                    r.Servicio.Nombre.ToLower().Contains(texto))
                .ToListAsync();

            return reservas;
        }

        // POST: api/reservas
        // Registrar una nueva reserva
        [HttpPost]
        public async Task<ActionResult<Reserva>> PostReserva(Reserva reserva)
        {
            reserva.FechaCreacion = DateTime.Now;

            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReserva), new { id = reserva.Id }, reserva);
        }

        // PUT: api/reservas/5
        // Actualizar una reserva completa
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReserva(int id, Reserva reserva)
        {
            if (id != reserva.Id)
                return BadRequest("El ID no coincide.");

            var reservaActual = await _context.Reservas.FindAsync(id);

            if (reservaActual == null)
                return NotFound();

            reservaActual.Cliente = reserva.Cliente;
            reservaActual.Telefono = reserva.Telefono;
            reservaActual.Direccion = reserva.Direccion;
            reservaActual.FechaReserva = reserva.FechaReserva;
            reservaActual.Descripcion = reserva.Descripcion;
            reservaActual.Estado = reserva.Estado;
            reservaActual.Prioridad = reserva.Prioridad;
            reservaActual.UsuarioId = reserva.UsuarioId;
            reservaActual.ServicioId = reserva.ServicioId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/reservas/5
        // Eliminar una reserva
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReserva(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);

            if (reserva == null)
                return NotFound();

            _context.Reservas.Remove(reserva);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}