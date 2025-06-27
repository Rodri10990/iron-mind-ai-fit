
import { useLocalStorage } from './useLocalStorage';

export interface Exercise {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  description: string;
  imageUrl: string;
  restTime: number;
  instructions: string[];
  tips: string[];
}

const defaultExercises: Exercise[] = [
  // PECHO
  {
    id: 1,
    name: "Press de Banca",
    category: "pecho",
    difficulty: "Intermedio",
    equipment: "Barra",
    primaryMuscles: ["Pectorales"],
    secondaryMuscles: ["Tríceps", "Deltoides anterior"],
    description: "Ejercicio fundamental para el desarrollo del pecho y fuerza de empuje.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 120,
    instructions: [
      "Acuéstate en el banco con los pies firmemente en el suelo",
      "Agarra la barra con las manos separadas al ancho de los hombros",
      "Baja la barra controladamente hasta tocar el pecho",
      "Empuja la barra hacia arriba hasta la extensión completa"
    ],
    tips: [
      "Mantén los omóplatos retraídos durante todo el movimiento",
      "No rebotes la barra en el pecho",
      "Controla la fase excéntrica (bajada)"
    ]
  },
  {
    id: 2,
    name: "Press Inclinado con Mancuernas",
    category: "pecho",
    difficulty: "Intermedio",
    equipment: "Mancuernas",
    primaryMuscles: ["Pectorales superiores"],
    secondaryMuscles: ["Deltoides anterior", "Tríceps"],
    description: "Excelente para desarrollar la parte superior del pecho.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Ajusta el banco a 30-45 grados de inclinación",
      "Sostén las mancuernas a la altura del pecho",
      "Empuja hacia arriba y ligeramente hacia adentro",
      "Baja controladamente hasta sentir estiramiento"
    ],
    tips: [
      "No uses demasiada inclinación (máximo 45°)",
      "Mantén los pies firmes en el suelo",
      "Controla el peso en todo momento"
    ]
  },
  {
    id: 3,
    name: "Flexiones de Pecho",
    category: "pecho",
    difficulty: "Principiante",
    equipment: "Peso corporal",
    primaryMuscles: ["Pectorales"],
    secondaryMuscles: ["Tríceps", "Core", "Deltoides"],
    description: "Ejercicio básico y efectivo usando el peso corporal.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Colócate en posición de plancha",
      "Manos al ancho de los hombros",
      "Baja el pecho hacia el suelo",
      "Empuja hacia arriba hasta la extensión completa"
    ],
    tips: [
      "Mantén el cuerpo recto como una tabla",
      "No dejes caer las caderas",
      "Respira correctamente: inhala al bajar, exhala al subir"
    ]
  },
  {
    id: 4,
    name: "Aperturas con Mancuernas",
    category: "pecho",
    difficulty: "Intermedio",
    equipment: "Mancuernas",
    primaryMuscles: ["Pectorales"],
    secondaryMuscles: ["Deltoides anterior"],
    description: "Ejercicio de aislamiento para definir y estirar el pecho.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 75,
    instructions: [
      "Acuéstate en el banco con mancuernas sobre el pecho",
      "Baja los brazos en arco amplio",
      "Siente el estiramiento en el pecho",
      "Regresa por el mismo arco hasta arriba"
    ],
    tips: [
      "Mantén una ligera flexión en los codos",
      "No uses peso excesivo",
      "Controla el movimiento lentamente"
    ]
  },
  {
    id: 5,
    name: "Fondos en Paralelas",
    category: "pecho",
    difficulty: "Intermedio",
    equipment: "Paralelas",
    primaryMuscles: ["Pectorales inferiores"],
    secondaryMuscles: ["Tríceps", "Deltoides anterior"],
    description: "Excelente para la parte inferior del pecho y tríceps.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Sujétate de las paralelas con brazos extendidos",
      "Inclínate ligeramente hacia adelante",
      "Baja controladamente flexionando los brazos",
      "Empuja hacia arriba hasta la posición inicial"
    ],
    tips: [
      "Inclínate hacia adelante para trabajar más pecho",
      "No bajes demasiado para evitar lesiones",
      "Mantén el core activo"
    ]
  },
  {
    id: 6,
    name: "Press Declinado",
    category: "pecho",
    difficulty: "Intermedio",
    equipment: "Barra",
    primaryMuscles: ["Pectorales inferiores"],
    secondaryMuscles: ["Tríceps", "Deltoides anterior"],
    description: "Enfocado en la parte inferior del pecho.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Acuéstate en banco declinado (15-30°)",
      "Agarra la barra al ancho de hombros",
      "Baja hasta tocar la parte inferior del pecho",
      "Empuja hacia arriba controladamente"
    ],
    tips: [
      "Asegúrate bien en el banco",
      "No uses declinación excesiva",
      "Mantén los pies bien sujetos"
    ]
  },

  // ESPALDA
  {
    id: 7,
    name: "Peso Muerto",
    category: "espalda",
    difficulty: "Avanzado",
    equipment: "Barra",
    primaryMuscles: ["Erector espinal", "Glúteos"],
    secondaryMuscles: ["Isquiotibiales", "Trapecios", "Dorsales"],
    description: "Ejercicio completo para la cadena posterior y fuerza general.",
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop",
    restTime: 180,
    instructions: [
      "Colócate frente a la barra con los pies al ancho de caderas",
      "Agarra la barra con las manos fuera de las piernas",
      "Mantén la espalda recta y levanta extendiendo caderas y rodillas",
      "Termina completamente erguido con hombros hacia atrás"
    ],
    tips: [
      "La barra debe mantenerse cerca del cuerpo",
      "Inicia el movimiento con las caderas, no con la espalda",
      "Mantén la cabeza en posición neutra"
    ]
  },
  {
    id: 8,
    name: "Dominadas",
    category: "espalda",
    difficulty: "Intermedio",
    equipment: "Barra de dominadas",
    primaryMuscles: ["Dorsales", "Bíceps"],
    secondaryMuscles: ["Romboides", "Trapecios medios"],
    description: "Excelente ejercicio para desarrollar la fuerza de tracción.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Cuelga de la barra con agarre pronado",
      "Separa las manos al ancho de los hombros",
      "Tira del cuerpo hacia arriba hasta que la barbilla pase la barra",
      "Baja controladamente hasta la extensión completa"
    ],
    tips: [
      "Evita balancearte o usar impulso",
      "Inicia el movimiento tirando de los omóplatos hacia abajo",
      "Mantén el core activo durante todo el ejercicio"
    ]
  },
  {
    id: 9,
    name: "Remo con Barra",
    category: "espalda",
    difficulty: "Intermedio",
    equipment: "Barra",
    primaryMuscles: ["Dorsales", "Romboides"],
    secondaryMuscles: ["Bíceps", "Deltoides posterior"],
    description: "Excelente para desarrollar grosor en la espalda.",
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Inclínate hacia adelante con la barra en las manos",
      "Mantén la espalda recta y el core activo",
      "Tira de la barra hacia el abdomen",
      "Baja controladamente hasta la extensión"
    ],
    tips: [
      "No uses impulso del cuerpo",
      "Aprieta los omóplatos al tirar",
      "Mantén los codos cerca del cuerpo"
    ]
  },
  {
    id: 10,
    name: "Jalones al Pecho",
    category: "espalda",
    difficulty: "Principiante",
    equipment: "Polea alta",
    primaryMuscles: ["Dorsales"],
    secondaryMuscles: ["Bíceps", "Romboides"],
    description: "Alternativa a las dominadas para principiantes.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 75,
    instructions: [
      "Siéntate en la máquina con las rodillas fijas",
      "Agarra la barra con agarre amplio",
      "Tira hacia el pecho apretando los omóplatos",
      "Sube controladamente hasta la extensión"
    ],
    tips: [
      "No te inclines excesivamente hacia atrás",
      "Enfócate en usar la espalda, no los brazos",
      "Mantén el pecho erguido"
    ]
  },
  {
    id: 11,
    name: "Remo con Mancuerna",
    category: "espalda",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Dorsales"],
    secondaryMuscles: ["Bíceps", "Deltoides posterior"],
    description: "Ejercicio unilateral para corregir desequilibrios.",
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Apóyate en el banco con una rodilla y mano",
      "Con la mano libre toma la mancuerna",
      "Tira hacia la cadera manteniendo el codo cerca",
      "Baja controladamente hasta la extensión"
    ],
    tips: [
      "Mantén la espalda recta durante todo el movimiento",
      "No rotar el torso al tirar",
      "Siente el trabajo en la espalda, no en el brazo"
    ]
  },
  {
    id: 12,
    name: "Hiperextensiones",
    category: "espalda",
    difficulty: "Principiante",
    equipment: "Banco de hiperextensiones",
    primaryMuscles: ["Erector espinal"],
    secondaryMuscles: ["Glúteos", "Isquiotibiales"],
    description: "Fortalece la zona lumbar y mejora la postura.",
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Colócate en el banco con las caderas apoyadas",
      "Cruza los brazos sobre el pecho",
      "Baja controladamente flexionando la cadera",
      "Sube hasta formar una línea recta"
    ],
    tips: [
      "No hiperextiendas la columna hacia atrás",
      "Controla el movimiento en ambas direcciones",
      "Mantén el cuello en posición neutra"
    ]
  },

  // PIERNAS
  {
    id: 13,
    name: "Sentadilla",
    category: "piernas",
    difficulty: "Intermedio",
    equipment: "Barra",
    primaryMuscles: ["Cuádriceps", "Glúteos"],
    secondaryMuscles: ["Isquiotibiales", "Core"],
    description: "El rey de los ejercicios para piernas y fuerza funcional.",
    imageUrl: "https://images.unsplash.com/photo-1566241142230-c05d99cd6b44?w=400&h=300&fit=crop",
    restTime: 180,
    instructions: [
      "Coloca la barra en la parte superior de la espalda",
      "Separa los pies al ancho de los hombros",
      "Desciende flexionando caderas y rodillas",
      "Sube empujando a través de los talones"
    ],
    tips: [
      "Mantén la espalda recta durante todo el movimiento",
      "Las rodillas deben seguir la dirección de los pies",
      "Desciende hasta que los muslos estén paralelos al suelo"
    ]
  },
  {
    id: 14,
    name: "Zancadas",
    category: "piernas",
    difficulty: "Intermedio",
    equipment: "Mancuernas",
    primaryMuscles: ["Cuádriceps", "Glúteos"],
    secondaryMuscles: ["Isquiotibiales", "Pantorrillas"],
    description: "Ejercicio unilateral para fuerza y equilibrio.",
    imageUrl: "https://images.unsplash.com/photo-1566241142230-c05d99cd6b44?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Da un paso largo hacia adelante",
      "Baja flexionando ambas rodillas a 90°",
      "Empuja con el talón para volver a la posición inicial",
      "Alterna las piernas o completa una serie por pierna"
    ],
    tips: [
      "Mantén el torso erguido",
      "No dejes que la rodilla trasera toque el suelo",
      "El paso debe ser lo suficientemente largo"
    ]
  },
  {
    id: 15,
    name: "Curl de Isquiotibiales",
    category: "piernas",
    difficulty: "Principiante",
    equipment: "Máquina",
    primaryMuscles: ["Isquiotibiales"],
    secondaryMuscles: ["Pantorrillas"],
    description: "Ejercicio de aislamiento para la parte posterior del muslo.",
    imageUrl: "https://images.unsplash.com/photo-1566241142230-c05d99cd6b44?w=400&h=300&fit=crop",
    restTime: 75,
    instructions: [
      "Acuéstate boca abajo en la máquina",
      "Coloca los tobillos bajo los rodillos",
      "Flexiona las rodillas llevando los talones hacia los glúteos",
      "Baja controladamente hasta la extensión"
    ],
    tips: [
      "No arquees excesivamente la espalda",
      "Controla la fase excéntrica",
      "Mantén las caderas pegadas al banco"
    ]
  },
  {
    id: 16,
    name: "Extensión de Cuádriceps",
    category: "piernas",
    difficulty: "Principiante",
    equipment: "Máquina",
    primaryMuscles: ["Cuádriceps"],
    secondaryMuscles: [],
    description: "Ejercicio de aislamiento para el frente del muslo.",
    imageUrl: "https://images.unsplash.com/photo-1566241142230-c05d99cd6b44?w=400&h=300&fit=crop",
    restTime: 75,
    instructions: [
      "Siéntate en la máquina con la espalda apoyada",
      "Coloca los tobillos detrás de los rodillos",
      "Extiende las piernas hasta la posición recta",
      "Baja controladamente hasta el ángulo inicial"
    ],
    tips: [
      "No uses impulso para levantar el peso",
      "Mantén la espalda pegada al respaldo",
      "Controla todo el rango de movimiento"
    ]
  },
  {
    id: 17,
    name: "Prensa de Piernas",
    category: "piernas",
    difficulty: "Principiante",
    equipment: "Máquina",
    primaryMuscles: ["Cuádriceps", "Glúteos"],
    secondaryMuscles: ["Isquiotibiales"],
    description: "Alternativa segura a la sentadilla para principiantes.",
    imageUrl: "https://images.unsplash.com/photo-1566241142230-c05d99cd6b44?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Siéntate en la máquina con la espalda apoyada",
      "Coloca los pies en la plataforma al ancho de hombros",
      "Baja las rodillas hacia el pecho",
      "Empuja la plataforma hasta casi la extensión completa"
    ],
    tips: [
      "No bloquees completamente las rodillas",
      "Mantén los pies planos en la plataforma",
      "Respira correctamente durante el movimiento"
    ]
  },
  {
    id: 18,
    name: "Elevación de Pantorrillas",
    category: "piernas",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Pantorrillas"],
    secondaryMuscles: [],
    description: "Fortalece y define los músculos de la pantorrilla.",
    imageUrl: "https://images.unsplash.com/photo-1566241142230-c05d99cd6b44?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Párate derecho con mancuernas en las manos",
      "Elévate sobre las puntas de los pies",
      "Mantén la posición por un segundo",
      "Baja controladamente hasta el suelo"
    ],
    tips: [
      "Mantén el equilibrio durante todo el movimiento",
      "Busca el rango completo de movimiento",
      "No rebotes al subir"
    ]
  },

  // HOMBROS
  {
    id: 19,
    name: "Press Militar",
    category: "hombros",
    difficulty: "Intermedio",
    equipment: "Barra",
    primaryMuscles: ["Deltoides"],
    secondaryMuscles: ["Tríceps", "Core"],
    description: "Ejercicio fundamental para fuerza y masa en hombros.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 120,
    instructions: [
      "Párate con los pies al ancho de hombros",
      "Agarra la barra al ancho de hombros",
      "Empuja la barra desde los hombros hasta arriba",
      "Baja controladamente hasta la posición inicial"
    ],
    tips: [
      "Mantén el core activo para proteger la espalda",
      "No arquees excesivamente la espalda",
      "Empuja la cabeza ligeramente hacia adelante al subir"
    ]
  },
  {
    id: 20,
    name: "Elevaciones Laterales",
    category: "hombros",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Deltoides medios"],
    secondaryMuscles: [],
    description: "Aislamiento para el deltoides medio y anchura de hombros.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Párate con mancuernas a los lados",
      "Eleva los brazos hacia los lados hasta la altura de hombros",
      "Mantén una ligera flexión en los codos",
      "Baja controladamente a la posición inicial"
    ],
    tips: [
      "No uses impulso para levantar el peso",
      "Mantén los hombros hacia abajo",
      "Detente a la altura de los hombros"
    ]
  },
  {
    id: 21,
    name: "Elevaciones Frontales",
    category: "hombros",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Deltoides anteriores"],
    secondaryMuscles: [],
    description: "Aislamiento para la parte frontal del hombro.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Párate con mancuernas frente a los muslos",
      "Eleva una mancuerna hacia adelante hasta la altura del hombro",
      "Mantén el brazo ligeramente flexionado",
      "Baja controladamente y alterna brazos"
    ],
    tips: [
      "No balancees el cuerpo para ayudar",
      "Controla el movimiento en ambas direcciones",
      "Mantén el core activo"
    ]
  },
  {
    id: 22,
    name: "Pájaros (Deltoides Posterior)",
    category: "hombros",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Deltoides posteriores"],
    secondaryMuscles: ["Romboides"],
    description: "Fortalece la parte posterior del hombro y mejora la postura.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Inclínate hacia adelante con mancuernas en las manos",
      "Abre los brazos hacia los lados como un pájaro",
      "Aprieta los omóplatos al abrir",
      "Baja controladamente hasta la posición inicial"
    ],
    tips: [
      "Mantén una ligera flexión en los codos",
      "No uses peso excesivo",
      "Enfócate en la parte posterior del hombro"
    ]
  },
  {
    id: 23,
    name: "Press con Mancuernas Sentado",
    category: "hombros",
    difficulty: "Intermedio",
    equipment: "Mancuernas",
    primaryMuscles: ["Deltoides"],
    secondaryMuscles: ["Tríceps"],
    description: "Desarrollo completo de hombros con mayor estabilidad.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 90,
    instructions: [
      "Siéntate en banco con respaldo vertical",
      "Sostén mancuernas a la altura de los hombros",
      "Empuja hacia arriba hasta extender los brazos",
      "Baja controladamente hasta la posición inicial"
    ],
    tips: [
      "Mantén la espalda pegada al respaldo",
      "No choques las mancuernas arriba",
      "Controla la bajada para máximo beneficio"
    ]
  },
  {
    id: 24,
    name: "Encogimientos de Hombros",
    category: "hombros",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Trapecios superiores"],
    secondaryMuscles: [],
    description: "Fortalece los trapecios superiores.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Párate con mancuernas a los lados",
      "Eleva los hombros hacia las orejas",
      "Mantén la posición por un segundo",
      "Baja los hombros lentamente"
    ],
    tips: [
      "No rotar los hombros, solo subir y bajar",
      "Mantén los brazos rectos",
      "Controla el movimiento"
    ]
  },

  // BRAZOS
  {
    id: 25,
    name: "Curl de Bíceps con Barra",
    category: "brazos",
    difficulty: "Principiante",
    equipment: "Barra",
    primaryMuscles: ["Bíceps"],
    secondaryMuscles: ["Antebrazos"],
    description: "Ejercicio básico para desarrollar masa en los bíceps.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 75,
    instructions: [
      "Párate con la barra en las manos, brazos extendidos",
      "Flexiona los codos llevando la barra hacia el pecho",
      "Mantén los codos pegados al cuerpo",
      "Baja controladamente hasta la extensión completa"
    ],
    tips: [
      "No balancees el cuerpo para ayudar",
      "Mantén los codos fijos en su posición",
      "Controla la fase excéntrica"
    ]
  },
  {
    id: 26,
    name: "Curl de Bíceps con Mancuernas",
    category: "brazos",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Bíceps"],
    secondaryMuscles: ["Antebrazos"],
    description: "Permite trabajo unilateral y mayor rango de movimiento.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Párate con mancuernas a los lados",
      "Flexiona un brazo llevando la mancuerna al hombro",
      "Rota ligeramente la muñeca al subir",
      "Baja controladamente y alterna brazos"
    ],
    tips: [
      "Mantén el codo fijo durante el movimiento",
      "No usar impulso del cuerpo",
      "Siente la contracción en la parte alta"
    ]
  },
  {
    id: 27,
    name: "Press Francés",
    category: "brazos",
    difficulty: "Intermedio",
    equipment: "Barra",
    primaryMuscles: ["Tríceps"],
    secondaryMuscles: [],
    description: "Ejercicio de aislamiento para los tríceps.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 75,
    instructions: [
      "Acuéstate en el banco con la barra sobre el pecho",
      "Baja la barra flexionando solo los codos",
      "Lleva la barra hacia la frente",
      "Extiende los brazos de vuelta a la posición inicial"
    ],
    tips: [
      "Mantén los codos fijos y apuntando hacia arriba",
      "No muevas los hombros durante el ejercicio",
      "Controla el peso, especialmente al bajar"
    ]
  },
  {
    id: 28,
    name: "Extensiones de Tríceps con Mancuerna",
    category: "brazos",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Tríceps"],
    secondaryMuscles: [],
    description: "Ejercicio unilateral para desarrollo de tríceps.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Siéntate o párate con una mancuerna sobre la cabeza",
      "Baja la mancuerna detrás de la cabeza flexionando el codo",
      "Mantén el brazo superior vertical",
      "Extiende el brazo de vuelta arriba"
    ],
    tips: [
      "Mantén el codo apuntando hacia adelante",
      "No arquees excesivamente la espalda",
      "Controla el peso en todo momento"
    ]
  },
  {
    id: 29,
    name: "Curl Martillo",
    category: "brazos",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    primaryMuscles: ["Bíceps", "Braquial"],
    secondaryMuscles: ["Antebrazos"],
    description: "Variación del curl que enfatiza el braquial y antebrazos.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Párate con mancuernas en posición de martillo",
      "Flexiona los brazos manteniendo las palmas neutras",
      "Sube las mancuernas hacia los hombros",
      "Baja controladamente a la posición inicial"
    ],
    tips: [
      "Mantén las muñecas rectas durante todo el ejercicio",
      "No balancees el cuerpo",
      "Puedes alternar brazos o hacer ambos juntos"
    ]
  },
  {
    id: 30,
    name: "Fondos en Banco",
    category: "brazos",
    difficulty: "Principiante",
    equipment: "Banco",
    primaryMuscles: ["Tríceps"],
    secondaryMuscles: ["Deltoides anterior"],
    description: "Ejercicio con peso corporal para tríceps.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Siéntate en el borde del banco con las manos a los lados",
      "Deslízate hacia adelante y sostente con los brazos",
      "Baja flexionando los codos",
      "Empuja hacia arriba hasta la extensión completa"
    ],
    tips: [
      "Mantén los codos cerca del cuerpo",
      "No bajes demasiado para evitar lesiones",
      "Puedes flexionar las rodillas para facilitar"
    ]
  },

  // ABDOMINALES
  {
    id: 31,
    name: "Crunches Abdominales",
    category: "abdominales",
    difficulty: "Principiante",
    equipment: "Peso corporal",
    primaryMuscles: ["Recto abdominal"],
    secondaryMuscles: [],
    description: "Ejercicio básico para el desarrollo abdominal.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 45,
    instructions: [
      "Acuéstate boca arriba con rodillas flexionadas",
      "Coloca las manos detrás de la cabeza",
      "Contrae el abdomen llevando el pecho hacia las rodillas",
      "Baja controladamente sin tocar completamente el suelo"
    ],
    tips: [
      "No tires del cuello con las manos",
      "Exhala al contraer, inhala al bajar",
      "Mantén la tensión en el abdomen"
    ]
  },
  {
    id: 32,
    name: "Plancha",
    category: "abdominales",
    difficulty: "Principiante",
    equipment: "Peso corporal",
    primaryMuscles: ["Core completo"],
    secondaryMuscles: ["Hombros", "Glúteos"],
    description: "Ejercicio isométrico para fortalecer todo el core.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Colócate en posición de flexión pero apoyado en antebrazos",
      "Mantén el cuerpo recto desde cabeza hasta talones",
      "Contrae el abdomen y glúteos",
      "Mantén la posición el tiempo indicado"
    ],
    tips: [
      "No dejes caer las caderas",
      "No arquees la espalda",
      "Respira normalmente durante el ejercicio"
    ]
  },
  {
    id: 33,
    name: "Elevación de Piernas",
    category: "abdominales",
    difficulty: "Intermedio",
    equipment: "Peso corporal",
    primaryMuscles: ["Abdomen inferior"],
    secondaryMuscles: ["Hip flexores"],
    description: "Enfocado en la parte inferior del abdomen.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Acuéstate boca arriba con piernas extendidas",
      "Coloca las manos bajo la zona lumbar para apoyo",
      "Eleva las piernas hasta formar 90° con el torso",
      "Baja controladamente sin tocar el suelo"
    ],
    tips: [
      "Mantén la espalda baja pegada al suelo",
      "Puedes flexionar ligeramente las rodillas",
      "Controla el movimiento, no uses impulso"
    ]
  },
  {
    id: 34,
    name: "Bicicleta",
    category: "abdominales",
    difficulty: "Intermedio",
    equipment: "Peso corporal",
    primaryMuscles: ["Oblicuos", "Recto abdominal"],
    secondaryMuscles: [],
    description: "Ejercicio dinámico que trabaja oblicuos y abdomen.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 45,
    instructions: [
      "Acuéstate con manos detrás de la cabeza",
      "Eleva las piernas con rodillas flexionadas",
      "Lleva el codo derecho hacia la rodilla izquierda",
      "Alterna los lados en movimiento de pedaleo"
    ],
    tips: [
      "No tires del cuello",
      "Mantén el torso elevado durante todo el ejercicio",
      "Controla el ritmo del movimiento"
    ]
  },
  {
    id: 35,
    name: "Plancha Lateral",
    category: "abdominales",
    difficulty: "Intermedio",
    equipment: "Peso corporal",
    primaryMuscles: ["Oblicuos"],
    secondaryMuscles: ["Core", "Hombros"],
    description: "Fortalece los oblicuos y mejora la estabilidad lateral.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 60,
    instructions: [
      "Acuéstate de lado apoyado en el antebrazo",
      "Eleva las caderas formando una línea recta",
      "Mantén la posición contrayendo los oblicuos",
      "Repite del otro lado"
    ],
    tips: [
      "No dejes caer las caderas",
      "Mantén la cabeza alineada con la columna",
      "Respira normalmente durante el ejercicio"
    ]
  },
  {
    id: 36,
    name: "Russian Twists",
    category: "abdominales",
    difficulty: "Intermedio",
    equipment: "Peso corporal",
    primaryMuscles: ["Oblicuos"],
    secondaryMuscles: ["Recto abdominal"],
    description: "Ejercicio rotacional para oblicuos y core.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    restTime: 45,
    instructions: [
      "Siéntate con rodillas flexionadas y pies ligeramente elevados",
      "Inclina el torso hacia atrás manteniendo la espalda recta",
      "Gira el torso de lado a lado tocando el suelo",
      "Mantén los pies elevados durante todo el ejercicio"
    ],
    tips: [
      "Mantén el pecho erguido",
      "No uses impulso para girar",
      "Puedes usar una mancuerna para mayor dificultad"
    ]
  }
];

export const useExercises = () => {
  const [exercises, setExercises, isLoading] = useLocalStorage<Exercise[]>('exercises', defaultExercises);

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise = {
      ...exercise,
      id: Math.max(...exercises.map(e => e.id), 0) + 1
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const updateExercise = (id: number, exercise: Partial<Exercise>) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, ...exercise } : e));
  };

  const deleteExercise = (id: number) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  return {
    exercises,
    addExercise,
    updateExercise,
    deleteExercise,
    isLoading
  };
};
