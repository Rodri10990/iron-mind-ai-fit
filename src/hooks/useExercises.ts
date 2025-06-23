
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
    id: 3,
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
    id: 4,
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
