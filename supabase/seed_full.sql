-- Seed full 50 aquarium species for AquaPedia
-- Columns: common_name, scientific_name, family, description, image_url, temp_min, temp_max, ph_min, ph_max, hardness_min, hardness_max, size_adult_cm, lifespan, diet, temperament, tank_level_min, difficulty_level, rarity, compatible_with, incompatible_with, care_notes, tags

-- We'll insert 50 common freshwater aquarium species.
BEGIN;

INSERT INTO public.fish (common_name, scientific_name, family, description, image_url, temp_min, temp_max, ph_min, ph_max, hardness_min, hardness_max, size_adult_cm, lifespan, diet, temperament, tank_level_min, difficulty_level, rarity, compatible_with, incompatible_with, care_notes, tags)
VALUES
('Guppy', 'Poecilia reticulata', 'Poeciliidae', 'Pez vivíparo muy popular y fácil de mantener.', '/images/guppy.webp', 22.0, 28.0, 7.0, 8.0, 5, 15, 4.0, '2-3 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Requiere agua limpia y alimentación variada.', ARRAY['vivo','planta-friendly']),
('Neón Tetra', 'Paracheirodon innesi', 'Characidae', 'Pequeño tetra de colores brillantes, ideal en cardúmenes.', '/images/neon_tetra.webp', 23.0, 26.0, 5.5, 7.0, 1, 8, 3.0, '5-8 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Mantener en grupo de al menos 6 individuos.', ARRAY['cardumen','plantado']),
('Molly', 'Poecilia sphenops', 'Poeciliidae', 'Pez vivíparo resistente y activo.', '/images/molly.webp', 22.0, 28.0, 7.0, 8.5, 5, 20, 6.0, '2-4 años', 'omnivoro', 'pacifico', 30, 1, 'comun', '{}', '{}', 'Tolera amplios rangos de salinidad ligera.', ARRAY['vivo','planta-friendly']),
('Platy', 'Xiphophorus maculatus', 'Poeciliidae', 'Pez colorido y social, fácil reproducción.', '/images/platy.webp', 20.0, 27.0, 7.0, 8.0, 5, 15, 5.0, '2-3 años', 'omnivoro', 'pacifico', 25, 1, 'comun', '{}', '{}', 'Buena opción para principiantes.', ARRAY['vivo','planta-friendly']),
('Corydora', 'Corydoras paleatus', 'Callichthyidae', 'Pequeño bagre de fondo, buen limpiador.', '/images/corydora.webp', 22.0, 26.0, 6.5, 7.5, 2, 12, 6.0, '5-10 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Mantener sobre sustrato suave para proteger sus barbillones.', ARRAY['fondista','cardumen']),
('Bristlenose Pleco', 'Ancistrus cirrhosus', 'Loricariidae', 'Limpia algas y es de pequeño tamaño comparado con otros plecos.', '/images/bristlenose.webp', 22.0, 27.0, 6.5, 7.5, 4, 20, 12.0, '5-8 años', 'omnivoro', 'pacifico', 60, 2, 'comun', '{}', '{}', 'Proveer cuevas y madera para raspado.', ARRAY['fondista','alga-eater']),
('Swordtail', 'Xiphophorus hellerii', 'Poeciliidae', 'Pez activo con cola en forma de espada en machos.', '/images/swordtail.webp', 22.0, 28.0, 7.0, 8.0, 5, 18, 8.0, '3-5 años', 'omnivoro', 'semiagressivo', 40, 2, 'comun', '{}', '{}', 'Pueden mostrar agresión entre machos.', ARRAY['vivo','activo']),
('Angelfish', 'Pterophyllum scalare', 'Cichlidae', 'Pez alto y elegante, requiere tanque espacioso.', '/images/angelfish.webp', 24.0, 30.0, 6.5, 7.5, 4, 12, 15.0, '8-10 años', 'omnivoro', 'semiagressivo', 80, 3, 'poco_comun', '{}', '{}', 'Necesita espacio vertical y aguas estables.', ARRAY['plantado','medio']),
('Gourami Dwarf', 'Trichogaster lalius', 'Osphronemidae', 'Gourami pequeño y colorido, tranquilo.', '/images/gourami_dwarf.webp', 24.0, 28.0, 6.0, 7.5, 5, 12, 6.0, '4-6 años', 'omnivoro', 'pacifico', 30, 2, 'comun', '{}', '{}', 'Prefiere aguas con plantas flotantes.', ARRAY['plantado','calmo']),
('Zebra Danio', 'Danio rerio', 'Cyprinidae', 'Pez activo y resistente ideal para principiantes.', '/images/zebra_danio.webp', 20.0, 26.0, 6.5, 7.5, 3, 15, 5.0, '2-3 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Muy activo, necesita espacio para nadar.', ARRAY['cardumen','activo']),
('Rasbora Arlequín', 'Trigonostigma heteromorpha', 'Cyprinidae', 'Pequeño rasbora pacífico, excelente en cardúmenes.', '/images/harlequin_rasbora.webp', 23.0, 28.0, 6.0, 7.5, 2, 10, 4.0, '4-6 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Mejor en acuarios plantados con refugios.', ARRAY['cardumen','plantado']),
('Otocinclus', 'Otocinclus affinis', 'Loricariidae', 'Pequeño come-algas pacífico, ideal con otros pequeños.', '/images/otocinclus.webp', 22.0, 26.0, 6.5, 7.5, 1, 10, 4.0, '3-5 años', 'herbivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Necesita algas o suplementación vegetal.', ARRAY['alga-eater','fondista']),
('Black Molly', 'Poecilia sphenops var. black', 'Poeciliidae', 'Variedad negra de Molly, resistente.', '/images/black_molly.webp', 22.0, 28.0, 7.0, 8.5, 5, 20, 6.0, '2-4 años', 'omnivoro', 'pacifico', 30, 1, 'comun', '{}', '{}', 'Buena para acuarios comunitarios.', ARRAY['vivo','plantado']),
('Kuhli Loach', 'Pangio kuhlii', 'Cobitidae', 'Leporiforme nocturno que se esconde durante el día.', '/images/kuhli_loach.webp', 24.0, 30.0, 6.0, 7.5, 2, 12, 10.0, '8-10 años', 'omnivoro', 'pacifico', 60, 2, 'poco_comun', '{}', '{}', 'Proveer escondites y sustrato suave.', ARRAY['fondista','nocturno']),
('Cherry Barb', 'Puntius titteya', 'Cyprinidae', 'Barbo color rojo en machos, bueno en grupo.', '/images/cherry_barb.webp', 23.0, 28.0, 6.0, 7.5, 4, 12, 5.0, '3-5 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Mantener en pequeños cardúmenes para reducir estrés.', ARRAY['cardumen','plantado']),
('Bolivian Ram', 'Mikrogeophagus altispinosus', 'Cichlidae', 'Cíclido enano, tranquilo y territorial pequeño.', '/images/bolivian_ram.webp', 24.0, 28.0, 6.5, 7.5, 3, 12, 8.0, '4-6 años', 'omnivoro', 'semiagressivo', 60, 3, 'poco_comun', '{}', '{}', 'Gusta de sustratos blandos y cuevas pequeñas.', ARRAY['plantado','medio']),
('Pleco Clown', 'Panaque nigrolineatus', 'Loricariidae', 'Pleco de aspecto llamativo; puede crecer grande.', '/images/clown_pleco.webp', 24.0, 28.0, 6.5, 7.5, 6, 20, 30.0, '10+ años', 'herbivoro', 'pacifico', 200, 4, 'raro', '{}', '{}', 'Necesita mucho espacio y madera para dieta.'),
('Tiger Barb', 'Puntigrus tetrazona', 'Cyprinidae', 'Barbo activo y con patrón llamativo; puede picotear.', '/images/tiger_barb.webp', 24.0, 27.0, 6.0, 7.5, 6, 15, 7.0, '3-4 años', 'omnivoro', 'semiagressivo', 60, 2, 'comun', '{}', '{}', 'Mantener en grupos para reducir agresión.'),
('Honey Gourami', 'Trichogaster chuna', 'Osphronemidae', 'Gourami pequeño y pacífico con coloración suave.', '/images/honey_gourami.webp', 24.0, 28.0, 6.5, 7.5, 4, 12, 6.0, '4-6 años', 'omnivoro', 'pacifico', 30, 2, 'comun', '{}', '{}', 'Prefiere plantas flotantes y aguas tranquilas.'),
('Bala Shark', 'Balantiocheilos melanopterus', 'Cyprinidae', 'Pez grande y activo que requiere tanque espacioso.', '/images/bala_shark.webp', 24.0, 28.0, 6.5, 7.5, 6, 15, 35.0, '8-12 años', 'omnivoro', 'pacifico', 300, 3, 'poco_comun', '{}', '{}', 'Necesita cardúmenes y acuarios muy grandes.'),
('Glass Catfish', 'Kryptopterus vitreolus', 'Siluridae', 'Pez translúcido y pacífico, sensitivo a calidad de agua.', '/images/glass_catfish.webp', 24.0, 28.0, 6.5, 7.5, 2, 10, 10.0, '5-7 años', 'omnivoro', 'pacifico', 120, 3, 'poco_comun', '{}', '{}', 'Mantener en grupos y aguas estables.'),
('Silver Dollar', 'Metynnis argenteus', 'Serrasalmidae', 'Pez herbívoro y pacífico, necesita tanque grande.', '/images/silver_dollar.webp', 24.0, 28.0, 6.5, 7.5, 4, 20, 25.0, '8-10 años', 'herbivoro', 'pacifico', 200, 3, 'poco_comun', '{}', '{}', 'Alimentación rica en vegetales.'),
('Pleco Rubbernose', 'Chaetostoma formosae', 'Loricariidae', 'Pleco de tamaño medio, buen comedor de algas.', '/images/rubbernose_pleco.webp', 22.0, 26.0, 6.5, 7.5, 4, 18, 18.0, '8-12 años', 'omnivoro', 'pacifico', 120, 3, 'poco_comun', '{}', '{}', 'Proveer lugares para esconderse.'),
('Betta', 'Betta splendens', 'Osphronemidae', 'Pez territorial de colores intensos; mejor en solitario o en compartimentos.', '/images/betta.webp', 24.0, 30.0, 6.5, 7.5, 3, 12, 6.0, '3-5 años', 'carnivoro', 'agresivo', 20, 2, 'comun', '{}', '{}', 'No mantener con machos de la misma especie en el mismo tanque.'),
('Clown Loach', 'Chromobotia macracanthus', 'Botiidae', 'Locha colorida que necesita grupo y espacio.', '/images/clown_loach.webp', 24.0, 30.0, 6.0, 7.5, 4, 12, 25.0, '10+ años', 'omnivoro', 'pacifico', 300, 4, 'raro', '{}', '{}', 'Crece mucho — requiere acuarios grandes.'),
('Dwarf Shrimp', 'Caridina multidentata', 'Atyidae', 'Camarón de acuario usado para control de algas y gambario.', '/images/dwarf_shrimp.webp', 22.0, 26.0, 6.5, 7.5, 1, 6, 2.5, '1-2 años', 'omnivoro', 'pacifico', 10, 1, 'comun', '{}', '{}', 'Requiere agua estable y buena alimentación.'),
('Green Terror', 'Andinoacara rivulatus', 'Cichlidae', 'Cíclido agresivo y territorial — no para comunitarios pequeños.', '/images/green_terror.webp', 24.0, 28.0, 7.0, 8.0, 8, 20, 25.0, '8-12 años', 'carnivoro', 'agresivo', 200, 4, 'raro', '{}', '{}', 'Solo en sistemas grandes y con especies compatibles.'),
('Peacock Gudgeon', 'Tateurndina ocellicauda', 'Eleotridae', 'Pez pacífico y colorido, buen carácter de acuario comunitario.', '/images/peacock_gudgeon.webp', 24.0, 28.0, 6.5, 7.5, 3, 12, 6.0, '3-5 años', 'omnivoro', 'pacifico', 40, 2, 'poco_comun', '{}', '{}', 'Prefiere acuarios con buena estructura y plantas.'),
('Molly Sailfin', 'Poecilia latipinna', 'Poeciliidae', 'Variante con aleta dorsal grande en machos.', '/images/sailfin_molly.webp', 22.0, 28.0, 7.0, 8.5, 5, 20, 8.0, '2-4 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Aprecia zonas abiertas y vegetación.'),
('Swordtail Red', 'Xiphophorus hellerii var. red', 'Poeciliidae', 'Variedad roja de swordtail, activo y vistoso.', '/images/red_swordtail.webp', 22.0, 28.0, 7.0, 8.0, 5, 18, 8.0, '3-5 años', 'omnivoro', 'semiagressivo', 40, 2, 'comun', '{}', '{}', 'Requiere espacio y puede mostrar territorialidad.'),
('Pencilfish', 'Nannostomus eques', 'Lebiasinidae', 'Pequeño pez elegante, bueno en acuarios plantados.', '/images/pencilfish.webp', 22.0, 28.0, 6.0, 7.5, 1, 8, 4.0, '3-5 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Activo en niveles medios del acuario.'),
('Ruby Tetra', 'Axelrodia riesei', 'Characidae', 'Tetra de color rojo intenso, ideal en grupos.', '/images/ruby_tetra.webp', 23.0, 27.0, 6.5, 7.5, 2, 10, 4.0, '3-5 años', 'omnivoro', 'pacifico', 30, 2, 'poco_comun', '{}', '{}', 'Mejor en acuarios plantados con buena filtración.'),
('Siamese Algae Eater', 'Crossocheilus oblongus', 'Cyprinidae', 'Come algas efectivamente; mantener en grupos jóvenes.', '/images/sae.webp', 24.0, 28.0, 6.5, 7.5, 4, 18, 12.0, '7-10 años', 'herbivoro', 'pacifico', 120, 3, 'comun', '{}', '{}', 'Excelente limpiador de algas, atento a compatibilidad.'),
('Flowerhorn (juvenile)', 'Hybrid Flowerhorn', 'Cichlidae', 'Híbrido ornamental popular; cuidado avanzado.', '/images/flowerhorn.webp', 26.0, 30.0, 7.0, 8.5, 8, 20, 30.0, '10+ años', 'omnivoro', 'agresivo', 400, 5, 'epico', '{}', '{}', 'Requiere manejo experto y acuarios grandes.'),
('Blue Ram', 'Mikrogeophagus ramirezi', 'Cichlidae', 'Cíclido enano sensible y colorido.', '/images/blue_ram.webp', 26.0, 30.0, 5.5, 7.0, 2, 8, 5.0, '2-3 años', 'omnivoro', 'semiagressivo', 60, 4, 'raro', '{}', '{}', 'Necesita aguas muy estables y temperatura alta.'),
('Painter's Golden Puffer', 'Carinotetraodon travancoricus', 'Tetraodontidae', 'Pequeño puffer de agua dulce, requiere dieta específica.', '/images/dwarf_puffer.webp', 24.0, 28.0, 7.0, 8.0, 5, 15, 4.0, '5-8 años', 'carnivoro', 'agresivo', 40, 4, 'raro', '{}', '{}', 'No es comunitario; puede picotear otras especies.'),
('Giant Danio', 'Devario aequipinnatus', 'Cyprinidae', 'Pez activo y grande para acuarios amplios.', '/images/giant_danio.webp', 22.0, 28.0, 6.5, 7.5, 4, 20, 15.0, '5-7 años', 'omnivoro', 'pacifico', 200, 3, 'poco_comun', '{}', '{}', 'Necesita mucho espacio para nadar.'),
('Firemouth Cichlid', 'Thorichthys meeki', 'Cichlidae', 'Cíclido con colores rojos en garganta, territorial.', '/images/firemouth.webp', 24.0, 28.0, 7.0, 8.0, 6, 18, 15.0, '6-8 años', 'omnivoro', 'semiagressivo', 120, 3, 'poco_comun', '{}', '{}', 'Puede mostrar comportamiento territorial durante cría.'),
('Pictus Catfish', 'Pimelodus pictus', 'Pimelodidae', 'Bagre de aletas largas, activo y de noche.', '/images/pictus_catfish.webp', 23.0, 28.0, 6.5, 7.5, 4, 15, 20.0, '10+ años', 'omnivoro', 'pacifico', 200, 3, 'poco_comun', '{}', '{}', 'Requiere tanque grande y compañía adecuada.'),
('Asian Stone Cat', 'Hara jerdoni', 'Erethistidae', 'Pequeño bagre de piedra, secreto y reposado.', '/images/stone_cat.webp', 22.0, 26.0, 6.5, 7.5, 2, 10, 6.0, '3-5 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Buen pez para acuarios de fondo plantados.'),
('Green Neon Tetra', 'Paracheirodon simulans', 'Characidae', 'Similar al neon pero más pequeño y tenue.', '/images/green_neon.webp', 23.0, 26.0, 5.5, 7.0, 1, 8, 3.0, '3-5 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Mantener en cardúmenes para mejor coloración.'),
('Rummy Nose Tetra', 'Hemigrammus rhodostomus', 'Characidae', 'Tetra con nariz roja distintiva, buen indicador de calidad de agua.', '/images/rummy_nose.webp', 24.0, 28.0, 6.0, 7.0, 1, 8, 4.0, '5-6 años', 'omnivoro', 'pacifico', 30, 2, 'poco_comun', '{}', '{}', 'Muy sensible a la calidad del agua.'),
('Pearl Gourami', 'Trichopodus leerii', 'Osphronemidae', 'Gourami con patrón perlado y temperamento tranquilo.', '/images/pearl_gourami.webp', 24.0, 30.0, 6.5, 7.5, 4, 12, 12.0, '6-8 años', 'omnivoro', 'pacifico', 120, 3, 'poco_comun', '{}', '{}', 'Gusta de plantas y aguas calmadas.'),
('Flower Shrimp', 'Neocaridina davidi', 'Atyidae', 'Camarón de colores variados, útil en gambarios.', '/images/flower_shrimp.webp', 20.0, 26.0, 6.5, 8.0, 1, 10, 2.5, '1-2 años', 'omnivoro', 'pacifico', 10, 1, 'comun', '{}', '{}', 'Fácil de criar, buen limpiador de detritos.'),
('Red Tail Shark', 'Epalzeorhynchus bicolor', 'Cyprinidae', 'Pez territorial de fondo con aleta roja.', '/images/red_tail_shark.webp', 24.0, 28.0, 6.5, 7.5, 5, 15, 15.0, '8-10 años', 'omnivoro', 'semiagressivo', 120, 3, 'poco_comun', '{}', '{}', 'Territorial con individuos de su propia especie.'),
('Emerald Cory', 'Corydoras splendens', 'Callichthyidae', 'Bagre de fondo robusto y sociable.', '/images/emerald_cory.webp', 23.0, 27.0, 6.5, 7.5, 2, 12, 6.0, '5-8 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Mantener en grupo para reducir estrés.'),
('Blue Neon Goby', 'Stiphodon atropurpureus', 'Gobiidae', 'Gobio pequeño para acuarios rocosos con corriente ligera.', '/images/blue_neon_goby.webp', 24.0, 28.0, 6.5, 7.5, 2, 10, 4.0, '3-5 años', 'omnivoro', 'pacifico', 60, 2, 'poco_comun', '{}', '{}', 'Necesita buena circulación y superficie rocosa.'),
('White Cloud Mountain Minnow', 'Tanichthys albonubes', 'Cyprinidae', 'Resistente pez de agua fría, colorido y pacífico.', '/images/white_cloud.webp', 18.0, 22.0, 6.0, 7.5, 1, 10, 3.5, '3-5 años', 'omnivoro', 'pacifico', 30, 1, 'comun', '{}', '{}', 'Ideal para acuarios de agua fría.'),
('Marbled Hatchetfish', 'Gasteropelecus sternicla', 'Gasteropelecidae', 'Pez de superficie con forma distintiva.', '/images/hatchetfish.webp', 24.0, 28.0, 6.0, 7.5, 1, 10, 5.0, '3-5 años', 'omnivoro', 'pacifico', 80, 2, 'poco_comun', '{}', '{}', 'Necesita tapa en el acuario; buen nadador de superficie.'),
('Koi (small)', 'Cyprinus carpio', 'Cyprinidae', 'Variedad ornamental de carpín; requiere estanque o muy grande acuario.', '/images/koi.webp', 10.0, 28.0, 6.5, 8.0, 4, 20, 60.0, '20+ años', 'omnivoro', 'pacifico', 1000, 5, 'epico', '{}', '{}', 'No adecuado para acuarios pequeños.'),
('Cardinal Tetra', 'Paracheirodon axelrodi', 'Characidae', 'Tetra brillante similar al neon pero más intenso.', '/images/cardinal_tetra.webp', 23.0, 27.0, 4.8, 7.0, 1, 8, 4.0, '4-6 años', 'omnivoro', 'pacifico', 30, 2, 'poco_comun', '{}', '{}', 'Necesita aguas ácidas y blandas en lo posible.'),
('Tiger Oscar', 'Astronotus ocellatus', 'Cichlidae', 'Cíclido grande y territorial, popular entre aficionados avanzados.', '/images/oscar.webp', 24.0, 28.0, 6.5, 7.5, 8, 20, 40.0, '10+ años', 'omnivoro', 'agresivo', 400, 4, 'raro', '{}', '{}', 'Requiere un tanque grande y dieta variada.'),
('End of batch', 'end.batch', 'N/A', 'Marker to end seed', NULL, 0,0,0,0,0,0,0,'','omnivoro','pacifico',0,1,'comun','{}','{}','', ARRAY[]);

COMMIT;
-- seed_full.sql - 50 common aquarium species

-- Note: assumes table public.fish as per migrations

INSERT INTO public.fish (id, common_name, scientific_name, family, description, image_url, temp_min, temp_max, ph_min, ph_max, hardness_min, hardness_max, size_adult_cm, lifespan, diet, temperament, tank_level_min, difficulty_level, rarity, compatible_with, incompatible_with, care_notes, tags, created_at, updated_at)
VALUES
-- 1
(uuid_generate_v4(), 'Guppy', 'Poecilia reticulata', 'Poeciliidae', 'Pequeño y colorido, ideal para principiantes.', '/images/guppy.webp', 22.0, 28.0, 7.0, 8.0, 5, 15, 4.0, '2-3 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Requiere agua estable y buena filtración.', '{"vivos","plantado"}', now(), now()),
-- 2
(uuid_generate_v4(), 'Molly', 'Poecilia sphenops', 'Poeciliidae', 'Resistente y sociable.', '/images/molly.webp', 22.0, 28.0, 7.0, 8.5, 8, 20, 6.0, '3-5 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Prefiere agua ligeramente salobre en algunas variedades.', '{"vivos","plantado"}', now(), now()),
-- 3
(uuid_generate_v4(), 'Platy', 'Xiphophorus maculatus', 'Poeciliidae', 'Pez pacífico y de fácil reproducción.', '/images/platty.webp', 20.0, 27.0, 6.8, 8.0, 5, 15, 5.0, '2-3 años', 'omnivoro', 'pacifico', 30, 1, 'comun', '{}', '{}', 'Omnívoro, acepta alimento seco y vivo.', '{"vivos","comunidad"}', now(), now()),
-- 4
(uuid_generate_v4(), 'Neon Tetra', 'Paracheirodon innesi', 'Characidae', 'Pequeño cardumen, colores brillantes.', '/images/neon_tetra.webp', 22.0, 26.0, 6.0, 7.5, 1, 10, 3.0, '3-5 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Mantener en grupos de al menos 6 individuos.', '{"cardumen","plantado"}', now(), now()),
-- 5
(uuid_generate_v4(), 'Cardinal Tetra', 'Paracheirodon axelrodi', 'Characidae', 'Similar al neon, con rojo más extenso.', '/images/cardinal_tetra.webp', 23.0, 27.0, 5.5, 7.0, 1, 10, 4.0, '4-6 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Necesita agua blanda y ácida para mejores colores.', '{"cardumen","plantado"}', now(), now()),
-- 6
(uuid_generate_v4(), 'Zebra Danio', 'Danio rerio', 'Cyprinidae', 'Activo y resistente, buen pez de comunidad.', '/images/zebra_danio.webp', 18.0, 26.0, 6.5, 7.5, 2, 15, 5.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Muy activo: necesita espacio para nadar.', '{"activo","cardumen"}', now(), now()),
-- 7
(uuid_generate_v4(), 'Corydoras', 'Corydoras paleatus', 'Callichthyidae', 'Limpiafondo pacífico, excelente en grupo.', '/images/corydoras.webp', 22.0, 26.0, 6.5, 7.8, 2, 12, 6.0, '4-8 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Necesita sustrato suave y grupos de 4+ peces.', '{"benthico","plantado"}', now(), now()),
-- 8
(uuid_generate_v4(), 'Otocinclus', 'Otocinclus affinis', 'Loricariidae', 'Pequeño limpiador de algas, muy pacífico.', '/images/otocinclus.webp', 22.0, 28.0, 6.5, 7.5, 1, 8, 4.0, '3-4 años', 'herbivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Alimentación con algas y tabletas de vegetales.', '{"algas","plantado"}', now(), now()),
-- 9
(uuid_generate_v4(), 'Swordtail', 'Xiphophorus hellerii', 'Poeciliidae', 'Largo y elegante, fácil de criar.', '/images/swordtail.webp', 22.0, 26.0, 7.0, 8.0, 8, 18, 8.0, '3-5 años', 'omnivoro', 'semiagressivo', 60, 1, 'comun', '{}', '{}', 'Puede ser territorial entre machos.', '{"vivos","comunidad"}', now(), now()),
-- 10
(uuid_generate_v4(), 'Betta', 'Betta splendens', 'Osphronemidae', 'Colorido y territorial, mejor solo.', '/images/betta.webp', 24.0, 30.0, 6.0, 8.0, 5, 15, 6.5, '2-4 años', 'carnivoro', 'agresivo', 20, 2, 'comun', '{}', '{}', 'Machos pelean entre ellos; mantener por separado.', '{"solo","plantado"}', now(), now()),
-- 11
(uuid_generate_v4(), 'Angelfish', 'Pterophyllum scalare', 'Cichlidae', 'Gracioso nadador vertical, elegante.', '/images/angelfish.webp', 24.0, 30.0, 6.5, 7.5, 5, 15, 15.0, '8-10 años', 'omnivoro', 'semiagressivo', 100, 3, 'poco_comun', '{}', '{}', 'Requiere tanque alto y buena calidad de agua.', '{"plantado","comunidad"}', now(), now()),
-- 12
(uuid_generate_v4(), 'Gourami Dwarf', 'Trichogaster lalius', 'Osphronemidae', 'Colorido y tranquilo, buen pez de comunidad small.', '/images/gourami_dwarf.webp', 24.0, 28.0, 6.0, 7.5, 5, 15, 8.0, '3-5 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Prefiere aguas con vegetación densa.', '{"superficie","plantado"}', now(), now()),
-- 13
(uuid_generate_v4(), 'Rasbora Harlequin', 'Trigonostigma heteromorpha', 'Cyprinidae', 'Pez de cardumen pacífico y colorido.', '/images/rasbora.webp', 22.0, 28.0, 6.0, 7.5, 1, 10, 4.0, '3-5 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Ideal en acuarios plantados y cardúmenes.', '{"cardumen","plantado"}', now(), now()),
-- 14
(uuid_generate_v4(), 'Cherry Barb', 'Puntius titteya', 'Cyprinidae', 'Pequeño barb color rojo brillante en machos.', '/images/cherry_barb.webp', 23.0, 27.0, 6.0, 7.5, 2, 12, 5.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Mejor en grupos y agua ligeramente ácida.', '{"cardumen","plantado"}', now(), now()),
-- 15
(uuid_generate_v4(), 'Kuhli Loach', 'Pangio kuhlii', 'Cobitidae', 'Anguila pequeña y nocturna, tímida.', '/images/kuhli_loach.webp', 24.0, 28.0, 6.0, 7.5, 1, 10, 8.0, '8-10 años', 'omnivoro', 'pacifico', 60, 2, 'comun', '{}', '{}', 'Necesita escondites y sustrato suave.', '{"nocturno","benthico"}', now(), now()),
-- 16
(uuid_generate_v4(), 'Pearl Danio', 'Danio albolineatus', 'Cyprinidae', 'Brillante y activo, buen pez de grupo.', '/images/pearl_danio.webp', 20.0, 26.0, 6.5, 7.5, 2, 15, 5.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Aprecia corriente moderada y espacio para nadar.', '{"activo","comunidad"}', now(), now()),
-- 17
(uuid_generate_v4(), 'Glowlight Tetra', 'Hemigrammus erythrozonus', 'Characidae', 'Pequeño tetra de colores suaves.', '/images/glowlight_tetra.webp', 22.0, 26.0, 5.5, 7.0, 1, 10, 3.5, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Mantener en cardúmenes y aguas limpias.', '{"cardumen","plantado"}', now(), now()),
-- 18
(uuid_generate_v4(), 'Black Neon', 'Hyphessobrycon herbertaxelrodi', 'Characidae', 'Contraste negro y banda blanca, pacífico.', '/images/black_neon.webp', 22.0, 26.0, 5.5, 7.0, 1, 10, 3.5, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Buen pez de cardumen para acuarios plantados.', '{"cardumen","plantado"}', now(), now()),
-- 19
(uuid_generate_v4(), 'Bolivian Ram', 'Mikrogeophagus altispinosus', 'Cichlidae', 'Cíclido enano, colores suaves.', '/images/bolivian_ram.webp', 24.0, 28.0, 6.5, 7.5, 5, 12, 7.5, '4-6 años', 'omnivoro', 'pacifico', 80, 3, 'poco_comun', '{}', '{}', 'Requiere agua de calidad y buena filtración.', '{"plantado","pareja"}', now(), now()),
-- 20
(uuid_generate_v4(), 'Flame Tetra', 'Hyphessobrycon flammeus', 'Characidae', 'Tetra de color rojizo, pacífico.', '/images/flame_tetra.webp', 22.0, 26.0, 6.0, 7.0, 1, 10, 4.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Buen pez de comunidad en acuarios plantados.', '{"cardumen","plantado"}', now(), now()),
-- 21
(uuid_generate_v4(), 'Honey Gourami', 'Trichogaster chuna', 'Osphronemidae', 'Tranquilo y de colores cálidos.', '/images/honey_gourami.webp', 24.0, 28.0, 6.0, 7.5, 5, 15, 6.0, '4-6 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Ideal en acuarios bien plantados.', '{"surface","plantado"}', now(), now()),
-- 22
(uuid_generate_v4(), 'Blue Danio', 'Devario kakhienensis', 'Cyprinidae', 'Activo y resistente, similar al danio.', '/images/blue_danio.webp', 20.0, 26.0, 6.5, 7.5, 2, 15, 6.0, '3-4 años', 'omnivoro', 'pacifico', 60, 1, 'comun', '{}', '{}', 'Necesita espacio para correr y corriente suave.', '{"activo","cardumen"}', now(), now()),
-- 23
(uuid_generate_v4(), 'Bristlenose Pleco', 'Ancistrus cirrhosus', 'Loricariidae', 'Pequeño pleco que ayuda con las algas.', '/images/bristlenose_pleco.webp', 22.0, 28.0, 6.5, 7.5, 3, 20, 12.0, '5-8 años', 'herbivoro', 'pacifico', 80, 2, 'comun', '{}', '{}', 'Ofrece cuevas y madera para raspar.', '{"algas","benthico"}', now(), now()),
-- 24
(uuid_generate_v4(), 'Panda Cory', 'Corydoras panda', 'Callichthyidae', 'Corydora pequeño con marcas contrastantes.', '/images/panda_cory.webp', 22.0, 26.0, 6.0, 7.5, 1, 12, 5.0, '4-6 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Necesita sustrato suave y alimentos de fondo.', '{"benthico","plantado"}', now(), now()),
-- 25
(uuid_generate_v4(), 'Clown Loach', 'Chromobotia macracanthus', 'Botiidae', 'Sociable y activo, crece mucho.', '/images/clown_loach.webp', 24.0, 30.0, 6.0, 7.5, 3, 18, 30.0, '10+ años', 'omnivoro', 'semiagressivo', 300, 3, 'poco_comun', '{}', '{}', 'Requiere acuarios muy grandes y grupo.', '{"grupo","benthico"}', now(), now()),
-- 26
(uuid_generate_v4(), 'Rainbowfish', 'Melanotaenia spp.', 'Melanotaeniidae', 'Colorido y activo, se ve mejor en cardúmenes.', '/images/rainbowfish.webp', 23.0, 28.0, 6.5, 8.0, 3, 15, 10.0, '4-6 años', 'omnivoro', 'pacifico', 120, 2, 'poco_comun', '{}', '{}', 'Aprecia espacio y agua limpia.', '{"cardumen","plantado"}', now(), now()),
-- 27
(uuid_generate_v4(), 'Black Molly', 'Poecilia sphenops var. black', 'Poeciliidae', 'Variedad oscura de molly.', '/images/black_molly.webp', 22.0, 28.0, 7.0, 8.5, 8, 20, 6.0, '3-5 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Versátil y resistente.', '{"plantado","comunidad"}', now(), now()),
-- 28
(uuid_generate_v4(), 'White Cloud Mountain Minnow', 'Tanichthys albonubes', 'Cyprinidae', 'Resistente, bueno para agua fría.', '/images/white_cloud.webp', 16.0, 22.0, 6.0, 7.5, 2, 12, 4.0, '3-5 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Tolera temperaturas más bajas que la mayoría.', '{"frio","cardumen"}', now(), now()),
-- 29
(uuid_generate_v4(), 'Siamese Algae Eater', 'Crossocheilus oblongus', 'Cyprinidae', 'Buen comedo de algas para acuarios.', '/images/sae.webp', 24.0, 28.0, 6.5, 7.5, 3, 20, 12.0, '6-8 años', 'herbivoro', 'pacifico', 120, 2, 'comun', '{}', '{}', 'Muy útil para controlar algas, necesita espacio.', '{"algas","activo"}', now(), now()),
-- 30
(uuid_generate_v4(), 'Molly Balloon', 'Poecilia sp. (balloon)', 'Poeciliidae', 'Variedad de molly de cuerpo redondeado.', '/images/molly_balloon.webp', 22.0, 28.0, 7.0, 8.5, 8, 20, 6.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Cuidado con la cría selectiva y deformidades.', '{"vivos","plantado"}', now(), now()),
-- 31
(uuid_generate_v4(), 'Goldfish (Comet)', 'Carassius auratus', 'Cyprinidae', 'Variedad grande de goldfish, requiere frío y tanque amplio.', '/images/goldfish_comet.webp', 6.0, 22.0, 7.0, 8.0, 5, 20, 30.0, '10+ años', 'omnivoro', 'pacifico', 200, 2, 'comun', '{}', '{}', 'Mejor en acuarios/fríos espaciosos con buena filtración.', '{"frio","decorativo"}', now(), now()),
-- 32
(uuid_generate_v4(), 'Goldfish (Ryukin)', 'Carassius auratus', 'Cyprinidae', 'Goldfish de cuerpo alto y colores vistosos.', '/images/goldfish_ryukin.webp', 6.0, 22.0, 7.0, 8.0, 5, 20, 18.0, '8-12 años', 'omnivoro', 'pacifico', 150, 2, 'comun', '{}', '{}', 'No mezclar con especies tropicales de temperatura alta.', '{"frio","decorativo"}', now(), now()),
-- 33
(uuid_generate_v4(), 'Dwarf Shrimp (Neocaridina)', 'Neocaridina davidi', 'Atyidae', 'Camarón ornamental, útil para limpieza y color.', '/images/neocaridina.webp', 20.0, 26.0, 6.5, 7.8, 1, 10, 2.5, '1-2 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Requiere parámetros estables y buena alimentación vegetal.', '{"invertebrado","plantado"}', now(), now()),
-- 34
(uuid_generate_v4(), 'Amano Shrimp', 'Caridina multidentata', 'Atyidae', 'Excelente comedor de algas, reservado y trabajador.', '/images/amano_shrimp.webp', 20.0, 26.0, 6.5, 7.8, 1, 10, 3.5, '2-3 años', 'omnivoro', 'pacifico', 20, 1, 'comun', '{}', '{}', 'Ideal para acuarios plantados con algas.', '{"algas","invertebrado"}', now(), now()),
-- 35
(uuid_generate_v4(), 'Balloon Mollie', 'Poecilia sp.', 'Poeciliidae', 'Variante de molly con cuerpo abombado.', '/images/balloon_molly.webp', 22.0, 28.0, 7.0, 8.5, 8, 20, 6.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Cuidado en la cría selectiva.', '{"vivos","plantado"}', now(), now()),
-- 36
(uuid_generate_v4(), 'Redtail Shark (Danio)', 'Epalzeorhynchos bicolor', 'Cyprinidae', 'Pez territorial; no mezclar con especies similares.', '/images/redtail_shark.webp', 24.0, 28.0, 6.5, 7.5, 3, 15, 12.0, '6-8 años', 'omnivoro', 'semiagressivo', 120, 3, 'poco_comun', '{}', '{}', 'Territorial; requiere espacio y escondites.', '{"territorial","benthico"}', now(), now()),
-- 37
(uuid_generate_v4(), 'Peacock Gudgeon', 'Tateurndina ocellicauda', 'Eleotridae', 'Pequeño y colorido, buena opción para nano tanques.', '/images/peacock_gudgeon.webp', 24.0, 28.0, 6.5, 7.5, 2, 12, 4.0, '3-5 años', 'omnivoro', 'pacifico', 30, 2, 'comun', '{}', '{}', 'Prefiere presencia de cuevas y plantas.', '{"nano","plantado"}', now(), now()),
-- 38
(uuid_generate_v4(), 'Pictus Catfish', 'Pimelodus pictus', 'Pimelodidae', 'Rayado y activo, buen limpiador de fondo.', '/images/pictus_catfish.webp', 24.0, 28.0, 6.5, 7.5, 3, 18, 20.0, '8-10 años', 'omnivoro', 'semiagressivo', 150, 3, 'poco_comun', '{}', '{}', 'Necesita espacio y compañeros robustos.', '{"nocturno","benthico"}', now(), now()),
-- 39
(uuid_generate_v4(), 'Peppered Cory', 'Corydoras paleatus var.', 'Callichthyidae', 'Corydora robusto con motas oscuras.', '/images/peppered_cory.webp', 22.0, 26.0, 6.5, 7.8, 1, 12, 6.0, '4-8 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Grupar en 4+ y sustrato suave.', '{"benthico","plantado"}', now(), now()),
-- 40
(uuid_generate_v4(), 'Koi (Juvenile)', 'Cyprinus carpio', 'Cyprinidae', 'Carpa ornamental, crece mucho; requiere estanque.', '/images/koi.webp', 6.0, 22.0, 7.0, 8.0, 5, 20, 40.0, '15+ años', 'omnivoro', 'pacifico', 1000, 3, 'comun', '{}', '{}', 'Mejor en estanques grandes; no apto para nano acuario.', '{"exterior","grande"}', now(), now()),
-- 41
(uuid_generate_v4(), 'Wagtail Platy', 'Xiphophorus variatus', 'Poeciliidae', 'Platy activo con aletas vistosas.', '/images/wagtail_platy.webp', 20.0, 26.0, 6.8, 8.0, 5, 15, 6.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Fácil de mantener en acuarios comunitarios.', '{"vivos","comunidad"}', now(), now()),
-- 42
(uuid_generate_v4(), 'Marble Hatchetfish', 'Carnegiella strigata', 'Gasteropelecidae', 'Pez de superficie, nadador lateralmente plano.', '/images/hatchetfish.webp', 24.0, 28.0, 6.0, 7.5, 1, 10, 3.5, '3-4 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Evitar corrientes fuertes y cubiertas abiertas.', '{"superficie","plantado"}', now(), now()),
-- 43
(uuid_generate_v4(), 'Emerald Cory', 'Corydoras splendens', 'Callichthyidae', 'Corydora grande y activo en grupo.', '/images/emerald_cory.webp', 22.0, 26.0, 6.5, 7.8, 1, 12, 7.0, '4-8 años', 'omnivoro', 'pacifico', 60, 1, 'comun', '{}', '{}', 'Buen limpiador en acuarios comunitarios.', '{"benthico","plantado"}', now(), now()),
-- 44
(uuid_generate_v4(), 'Leopard Bushfish', 'Ctenopoma acutirostre', 'Anabantidae', 'Pez solitario y de hábitos tímidos.', '/images/leopard_bushfish.webp', 24.0, 28.0, 6.0, 7.5, 3, 15, 12.0, '5-8 años', 'carnivoro', 'semiagressivo', 80, 3, 'poco_comun', '{}', '{}', 'Prefiere acuarios con escondites y vegetación.', '{"solitario","plantado"}', now(), now()),
-- 45
(uuid_generate_v4(), 'Clown Pleco', 'Panaqolus maccus', 'Loricariidae', 'Pequeño pleco con patrones, útil para algas.', '/images/clown_pleco.webp', 24.0, 28.0, 6.5, 7.8, 3, 20, 10.0, '8-12 años', 'herbivoro', 'pacifico', 80, 2, 'poco_comun', '{}', '{}', 'Proporcionar madera y cuevas.', '{"algas","benthico"}', now(), now()),
-- 46
(uuid_generate_v4(), 'Honey Gourami', 'Trichopodus trichopterus', 'Osphronemidae', 'Versátil y colorido gourami grande.', '/images/honey_gourami_large.webp', 24.0, 28.0, 6.0, 7.5, 5, 15, 8.0, '4-6 años', 'omnivoro', 'pacifico', 60, 2, 'comun', '{}', '{}', 'Apreciado en acuarios plantados y comunitarios.', '{"surface","plantado"}', now(), now()),
-- 47
(uuid_generate_v4(), 'Sunburst Platy', 'Xiphophorus maculatus var.', 'Poeciliidae', 'Platy de colores intensos.', '/images/sunburst_platy.webp', 20.0, 26.0, 6.8, 8.0, 5, 15, 6.0, '3-4 años', 'omnivoro', 'pacifico', 40, 1, 'comun', '{}', '{}', 'Fácil mantenimiento y reproducción.', '{"colorido","vivos"}', now(), now()),
-- 48
(uuid_generate_v4(), 'Rummy Nose Tetra', 'Hemigrammus rhodostomus', 'Characidae', 'Tetra con punta roja en el hocico, cardumen ', '/images/rummy_nose.webp', 24.0, 28.0, 5.5, 7.0, 1, 10, 4.0, '3-5 años', 'omnivoro', 'pacifico', 40, 2, 'comun', '{}', '{}', 'Excelente en cardúmenes y acuarios plantados.', '{"cardumen","plantado"}', now(), now()),
-- 49
(uuid_generate_v4(), 'Bala Shark (Juvenile)', 'Balantiocheilos melanopterus', 'Cyprinidae', 'Atractivo pez grande en crecimiento; necesita espacio.', '/images/bala_shark.webp', 24.0, 28.0, 6.5, 7.5, 3, 15, 35.0, '10+ años', 'omnivoro', 'semiagressivo', 400, 3, 'poco_comun', '{}', '{}', 'Requiere acuario grande y agua limpia.', '{"grupo","activo"}', now(), now()),
-- 50
(uuid_generate_v4(), 'Paradise Fish', 'Macropodus opercularis', 'Osphronemidae', 'Aparece en acuarios, puede ser territorial.', '/images/paradise_fish.webp', 20.0, 26.0, 6.0, 7.5, 3, 15, 6.0, '3-5 años', 'carnivoro', 'semiagressivo', 40, 2, 'comun', '{}', '{}', 'Tener cuidado con combinaciones de machos.', '{"solo","plantado"}', now(), now());

-- End of seed
