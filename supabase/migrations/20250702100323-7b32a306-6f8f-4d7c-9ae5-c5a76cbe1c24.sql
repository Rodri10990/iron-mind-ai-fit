
-- Populate the exercise_media table with real exercise images and videos
INSERT INTO exercise_media (exercise_name, media_type, url, description) VALUES
-- Pecho exercises
('Press de Banca', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Demostración del press de banca con barra'),
('Press de Banca', 'video', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Video tutorial del press de banca'),
('Press Inclinado con Mancuernas', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Press inclinado con mancuernas'),
('Flexiones de Pecho', 'image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'Flexiones tradicionales de pecho'),
('Fondos en Paralelas', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Fondos en barras paralelas'),
('Aperturas con Mancuernas', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Aperturas planas con mancuernas'),

-- Espalda exercises
('Dominadas', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Dominadas en barra fija'),
('Remo con Barra', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Remo inclinado con barra'),
('Jalones al Pecho', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Jalones en polea alta'),
('Remo con Mancuerna', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Remo unilateral con mancuerna'),
('Peso Muerto', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Peso muerto convencional'),

-- Piernas exercises
('Sentadillas', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Sentadillas con barra'),
('Prensa de Piernas', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Prensa de piernas en máquina'),
('Zancadas', 'image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'Zancadas con mancuernas'),
('Curl de Piernas', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Curl de piernas acostado'),
('Extensión de Cuádriceps', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Extensión de cuádriceps en máquina'),

-- Hombros exercises
('Press Militar', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Press militar con barra'),
('Elevaciones Laterales', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Elevaciones laterales con mancuernas'),
('Press con Mancuernas', 'image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'Press de hombros con mancuernas'),
('Elevaciones Frontales', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Elevaciones frontales con mancuernas'),
('Remo al Mentón', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Remo al mentón con barra'),

-- Brazos exercises
('Curl de Bíceps', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Curl de bíceps con barra'),
('Extensiones de Tríceps', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Extensiones de tríceps en polea'),
('Curl Martillo', 'image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'Curl martillo con mancuernas'),
('Press Francés', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Press francés con mancuerna'),
('Curl en Predicador', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Curl en banco predicador'),

-- Abdominales exercises
('Crunches', 'image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'Crunches abdominales'),
('Plancha', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Plancha abdominal'),
('Elevación de Piernas', 'image', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop', 'Elevación de piernas colgando'),
('Russian Twists', 'image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'Russian twists con peso'),
('Mountain Climbers', 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Mountain climbers dinámicos');
