// =====================================================================
//  CONFIG DE LA BARBERÍA — lo único que se cambia para cada demo nueva.
//  Textos con { es, en } salen en los dos idiomas.
// =====================================================================
window.BARBERIA = {
  nombre: "Yuri Barber Shop",
  eslogan: {
    es: "La barbería de la familia en Hialeah",
    en: "Hialeah's family barbershop",
  },
  intro: {
    es: "Más de una década cortando a varias generaciones en Palm Ave. Aquí no eres un cliente más: eres de la casa.",
    en: "Over a decade cutting hair for generations on Palm Ave. Here you're not just a client, you're family.",
  },

  // Datos de Google Maps
  rating: 4.9,
  resenasTotal: 1016,
  googleMapsUrl: "https://www.google.com/maps/place/Yuri+Barber+Shop/@25.8384178,-80.2822089,17z",
  direccion: "1800 Palm Ave, Hialeah, FL 33010",
  telefono: "(305) 805-1199",
  telefonoLink: "+13058051199",
  // Número de WhatsApp en formato internacional, sin "+" ni espacios
  whatsapp: "13058051199",
  instagram: "yuri_barbershop", // vacío = no se muestra
  // Por dónde llegan las reservas: "whatsapp" o "instagram" (copia el mensaje y abre el chat)
  canalReserva: "instagram",

  // Horario: 0 = domingo … 6 = sábado. [abre, cierra] en horas 24h. null = cerrado
  horario: {
    0: [9, 15],
    1: [9, 19],
    2: [9, 19],
    3: [9, 19],
    4: [9, 19],
    5: [9, 19],
    6: [9, 19],
  },
  zonaHoraria: "America/New_York",

  // true = muestra el aviso de "precios de ejemplo" (para la demo)
  preciosDeEjemplo: true,
  servicios: [
    { id: "corte", nombre: { es: "Corte de pelo", en: "Haircut" }, precio: 25, min: 35,
      desc: { es: "Fade, clásico, tijera o lo que pidas.", en: "Fade, classic, scissors or whatever you ask for." } },
    { id: "corte-barba", nombre: { es: "Corte y barba", en: "Haircut & beard" }, precio: 35, min: 50,
      desc: { es: "Corte completo más arreglo de barba con navaja.", en: "Full haircut plus razor beard shaping." } },
    { id: "barba", nombre: { es: "Barba", en: "Beard" }, precio: 15, min: 20,
      desc: { es: "Perfilado, toalla caliente y navaja.", en: "Line-up, hot towel and razor." } },
    { id: "ninos", nombre: { es: "Corte de niño", en: "Kids haircut" }, precio: 20, min: 30,
      desc: { es: "Con paciencia de verdad. Los padres lo saben.", en: "With real patience. Parents know it." } },
    { id: "cerquillo", nombre: { es: "Cerquillo / Shape-up", en: "Line-up / Shape-up" }, precio: 10, min: 15,
      desc: { es: "Para mantenerte fresco entre cortes.", en: "Stay fresh between cuts." } },
  ],

  // Barberos (la reserva permite elegir uno o "el que esté libre")
  barberos: [
    { nombre: "Yuri", rol: { es: "Dueño y barbero", en: "Owner & barber" } },
  ],

  // Reseñas REALES de Google (extractos cortos, con nombre del autor)
  resenas: [
    { autor: "Manuel Gonzalez", texto: "Frecuento esta barbería hace 8 años donde el dueño Yuri te hace sentir más que un cliente, un miembro más de su familia." },
    { autor: "familia angel", texto: "Desde que llegué a este país es el único lugar donde pelo a mis hijos. Llevo 10 años con esta barbería y no la cambio." },
    { autor: "Efraín Méndez", texto: "Lo máximo que hay en Hialeah. Súper recomendado, no se van a arrepentir." },
  ],

  // Foto de fondo de la portada (vacío = sin foto)
  // Fotos del propietario en Google Maps. Cuando cierre el trato, pídele las originales y ponlas en img/
  portada: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TQ48fMED8GpKn8WAbDkvtKC1oCGOsV9xxT42WTDj0azcVIjzTXwW3N_wddj74gQ8MQwm6kCOeMiQ_BUuN1HJ4rsuX74XNE9W350YMpb1nl9dMgnw9Ul2IXka4aH1clDUkntYwKCNPWDOE=w1600-h1000-k-no",

  // Galería: rutas o URLs de fotos. Vacío = muestra espacios de ejemplo.
  galeria: [
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QkHAj7hjG7K0iYFmqyTWn2lI-JOtJXs4v9EimK-TDKmPGQk2XOQ-7Ln_OMwt1gSg_fWQJ0nP8Bo4U-Pdz_OubH3528MEgXMTidt-QBtEknw_vwmVjLd3GGqEijBS0WOuez503v=w700-h700-k-no",
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RLt4WesDADFbDqqYwlxZdIz8QktcMsZ1BHAidB2KNvXE_1xeCk3QvfU-rxZ4nirLerVoCJz31ymJ4UcwjKHU_h0Hn7Zh7aoHBf2qXO-dbnnOCpmXrn0MFoEBZJlS-gsWkUQJs2=w700-h700-k-no",
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RxtWf94fxB0UJuxPt8LRzgVMEBmeTs1K5DVkSOqHbIT3DXuzNUbJhNpmbTxEGVlvj_QVWXpVY1hvFCLFVFNCD5gwkVUX1CsJFk4n2IFs8d9jGpyhH3LPkb6tl9MNKQoRG8_jOW=w700-h700-k-no",
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Tw9KUzdxHioKBMepgp-zeqtcSFSzm7WJPKnO4g1R3JmpCLsS1FzDNJxC98j19lB9JbD00cJig6KlGTX05_7rbX6xR4UW8HjPwhtnKHDQPM3_ON2KzJrxbje3Ci1pBVgdDPVNz8=w700-h700-k-no",
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RWTD4Ia-Qewkm1mJbv0ZZYNTNWgFaFArwtIjbZDzy6Nw7J8GeYVD68ANqtNADOfljO8GKWNj7yps8Yiap87djJ4V8bOdu9PIXtme4SPqdqxiu5Lhx_GVStuOb0fDnqshfBIaWP=w700-h700-k-no",
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Th26ITZi1xcSdUUGUGR_BFCqonV3n9-TU-LbNBWKH5vMY3P3BkOAEPsfjx9LRCtIBVIhzisfoREOAYgw8F_LKGPFQrAZRi0UY4tXx9gYLZxMzoFqc2vrg-lhOUEU9dsDh4HjTy=w700-h700-k-no",
  ],

  // Etiquetas que salen bajo la portada
  sellos: [
    { es: "Familiar", en: "Family-friendly" },
    { es: "Niños bienvenidos", en: "Kids welcome" },
    { es: "Hablamos español", en: "We speak English & Spanish" },
    { es: "Multicultural", en: "Multicultural" },
  ],

  // Colores de la marca
  colores: { acento: "#c8a24a", acento2: "#b3262e" },
};
