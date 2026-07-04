
namespace Lavanderia.Models
{
public class Reserva
{
    public int Id { get; set; }

    public string Cliente { get; set; } = string.Empty;

    public string Telefono { get; set; } = string.Empty;

    public string Direccion { get; set; } = string.Empty;

    public DateTime FechaReserva { get; set; }

    public string Descripcion { get; set; } = string.Empty;

    public string Estado { get; set; } = "Pendiente";

    public string Prioridad { get; set; } = "Media";

    public DateTime FechaCreacion { get; set; } = DateTime.Now;

    public int UsuarioId { get; set; }

    public Usuario Usuario { get; set; } = null!;

    public int ServicioId { get; set; }

    public Servicio Servicio { get; set; } = null!;
    
}
}