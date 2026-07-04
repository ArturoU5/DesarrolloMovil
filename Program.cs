using Lavanderia.Data;
using Microsoft.EntityFrameworkCore;

using System.Text;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



//Agregamos linea HTTP CLIENTE PARA CONSUMIR WEB SERVICE
builder.Services.AddHttpClient();
builder.Services.AddControllers();

var app = builder.Build();
app.UseAuthentication(); // AUTORIZACIÓN
app.UseAuthorization(); // AUTORIZACIÓN
app.MapControllers();

app.Run();