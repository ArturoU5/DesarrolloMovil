/**
 * Consumo básico de una API REST pública (GET), tal como pide la rúbrica:
 * "estado de carga", "visualización de datos" y "mensaje de error si
 * falla la petición".
 *
 * RefreshProClean no tiene todavía un backend propio de catálogo. Para
 * esta entrega preliminar:
 *  1) Se hace un GET real a Fake Store API (pública, sin API key),
 *     filtrado solo a categorías de ropa ("men's clothing" y
 *     "women's clothing") — son justamente el tipo de prendas que
 *     atiende una lavandería.
 *  2) A ese resultado se le suma un catálogo local de "cuidado de
 *     ropa" (detergentes, suavizantes, quitamanchas), ya que no existe
 *     una API pública gratuita de insumos de lavandería. Estos datos
 *     locales solo se agregan si el GET tuvo éxito: si la petición
 *     falla, se sigue mostrando el error real (no se "tapa" con datos
 *     locales), para no falsear esa parte de la demostración.
 *
 * Cuando el negocio tenga su propio backend de catálogo, solo habría
 * que cambiar obtenerCatalogo() por el endpoint real: el resto de la
 * app (pantalla, loading, error) no cambiaría.
 */

const API_URL = 'https://fakestoreapi.com/products';
const CATEGORIAS_RELEVANTES = ["men's clothing", "women's clothing"];

export interface ProductoCatalogo {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

// Catálogo local de insumos de cuidado de ropa (no viene de la API: se
// agrega en el cliente porque no existe una API pública gratuita de
// productos de lavandería). IDs altos para no chocar con los de la API.
const CUIDADO_ROPA_LOCAL: ProductoCatalogo[] = [
  {
    id: 9001,
    title: 'Detergente líquido concentrado 1L',
    price: 18.5,
    category: 'cuidado de ropa',
    image: 'https://placehold.co/300x300/2E7DAF/ffffff?text=Detergente',
    description: 'Detergente líquido de alto rendimiento, apto para prendas delicadas.',
  },
  {
    id: 9002,
    title: 'Suavizante de telas 900ml',
    price: 12.9,
    category: 'cuidado de ropa',
    image: 'https://placehold.co/300x300/2FA36B/ffffff?text=Suavizante',
    description: 'Deja las prendas suaves y con fragancia duradera.',
  },
  {
    id: 9003,
    title: 'Quitamanchas multiusos 500ml',
    price: 15.0,
    category: 'cuidado de ropa',
    image: 'https://placehold.co/300x300/F2A93B/ffffff?text=Quitamanchas',
    description: 'Elimina manchas difíciles de grasa, tierra y bebidas antes del lavado.',
  },
  {
    id: 9004,
    title: 'Bolsas de lavandería (pack x10)',
    price: 9.9,
    category: 'cuidado de ropa',
    image: 'https://placehold.co/300x300/8A94A6/ffffff?text=Bolsas',
    description: 'Bolsas de malla para proteger ropa delicada durante el lavado.',
  },
];

export async function obtenerCatalogo(): Promise<ProductoCatalogo[]> {
  let response: Response;
  try {
    response = await fetch(API_URL);
  } catch (error) {
    throw new Error(
      'No se pudo conectar con el servidor. Revisa tu conexión a internet.'
    );
  }

  if (!response.ok) {
    throw new Error(`El servidor respondió con un error (código ${response.status}).`);
  }

  const data = (await response.json()) as ProductoCatalogo[];
  // Solo nos interesan las prendas: es lo que una lavandería atiende.
  const prendas = data.filter((producto) => CATEGORIAS_RELEVANTES.includes(producto.category));

  // El GET a la API fue exitoso: recién ahí se suma el catálogo local
  // de cuidado de ropa (nunca se muestra si la petición falló).
  return [...prendas, ...CUIDADO_ROPA_LOCAL];
}
