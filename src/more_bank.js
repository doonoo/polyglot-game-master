/* ===================== Bigger pools: vocab and islands ===================== */
Object.assign(CATS, {
  produce:{en:"Fruits and vegetables",es:"Frutas y verduras"}, days:{en:"Days of the week",es:"Días de la semana"}, people:{en:"People",es:"Personas"},
  school:{en:"School",es:"Escuela"}, verbs2:{en:"More everyday verbs",es:"Más verbos cotidianos"}, meals:{en:"Meals and drinks",es:"Comidas y bebidas"},
  sports:{en:"Sports",es:"Deportes"}, store:{en:"At the store",es:"En la tienda"}, chores:{en:"Chores",es:"Tareas de la casa"},
  body2:{en:"More body parts",es:"Más partes del cuerpo"}, places:{en:"Places in town",es:"Lugares de la ciudad"}, jobs:{en:"Jobs",es:"Oficios"},
  housing:{en:"Housing",es:"Vivienda"}, emotions:{en:"Emotions in action",es:"Emociones en acción"}, devices:{en:"Devices and apps",es:"Dispositivos y apps"},
  trips:{en:"Trips",es:"Viajes y trayectos"}, cooking:{en:"Cooking",es:"En la cocina"},
  workplace:{en:"Workplace",es:"Lugar de trabajo"}, values:{en:"Values",es:"Valores"}, disasters:{en:"Nature and disasters",es:"Naturaleza y desastres"},
  describe2:{en:"Precise adjectives",es:"Adjetivos precisos"}, verbs3:{en:"Advanced verbs",es:"Verbos avanzados"}
});
Object.assign(VOCAB.A1, {
  produce:[["la naranja","orange"],["el plátano|la banana","banana"],["la fresa|la frutilla","strawberry"],["la uva","grape"],["la papa|la patata","potato"],["el tomate","tomato"],["la cebolla","onion"],["la zanahoria","carrot"]],
  days:[["el lunes","Monday"],["el martes","Tuesday"],["el miércoles","Wednesday"],["el jueves","Thursday"],["el viernes","Friday"],["el sábado","Saturday"],["el domingo","Sunday"],["el mes","month"]],
  people:[["el hombre","man"],["la mujer","woman"],["el niño","boy|child|kid"],["la niña","girl"],["el amigo|la amiga","friend"],["el bebé","baby"],["la gente","people"]],
  school:[["el lápiz","pencil"],["el cuaderno","notebook"],["la mochila","backpack"],["el maestro|la maestra|el profesor|la profesora","teacher"],["el estudiante|la estudiante|el alumno|la alumna","student"],["la pregunta","question"],["la respuesta","answer"],["la clase","class"]],
  verbs2:[["ir","to go"],["venir","to come"],["ver","to see"],["abrir","to open"],["cerrar","to close|to shut"],["correr","to run"],["cantar","to sing"],["bailar","to dance"],["jugar","to play"]],
  meals:[["el desayuno","breakfast"],["el almuerzo","lunch"],["la cena","dinner|supper"],["el café","coffee"],["el té","tea"],["el jugo|el zumo","juice"],["la sopa","soup"],["el azúcar","sugar"]]
});
Object.assign(VOCAB.A2, {
  sports:[["el equipo","team"],["el partido","game|match"],["el jugador|la jugadora","player"],["la pelota|el balón","ball"],["nadar","to swim"],["el entrenador|la entrenadora","coach|trainer"],["el campeón|la campeona","champion"],["el estadio","stadium"]],
  store:[["el supermercado","supermarket"],["la caja","checkout|cash register|box"],["el recibo","receipt"],["la oferta","sale|offer|deal"],["el descuento","discount"],["la talla","size"],["pagar","to pay"],["el carrito","cart|shopping cart|trolley"]],
  chores:[["barrer","to sweep"],["lavar","to wash"],["planchar","to iron"],["la escoba","broom"],["la lavadora","washing machine|washer"],["el polvo","dust"],["ordenar","to tidy|to tidy up|to organize"],["la ropa sucia","dirty laundry|laundry"]],
  body2:[["la espalda","back"],["el cuello","neck"],["la rodilla","knee"],["el dedo","finger|toe"],["el estómago","stomach"],["el diente","tooth"],["la nariz","nose"],["la oreja","ear"]],
  places:[["el hospital","hospital"],["la iglesia","church"],["el museo","museum"],["la biblioteca","library"],["la farmacia","pharmacy|drugstore"],["el mercado","market"],["la estación","station"],["el puente","bridge"]],
  jobs:[["el bombero|la bombera","firefighter"],["el cocinero|la cocinera","cook|chef"],["el enfermero|la enfermera","nurse"],["el mecánico|la mecánica","mechanic"],["el policía|la policía","police officer|policeman|policewoman"],["el ingeniero|la ingeniera","engineer"],["el mesero|la mesera|el camarero|la camarera","waiter|waitress|server"],["el granjero|la granjera|el agricultor|la agricultora","farmer"]]
});
Object.assign(VOCAB.B1, {
  housing:[["el inquilino|la inquilina","tenant"],["el dueño|la dueña","owner|landlord|landlady"],["el barrio|el vecindario","neighborhood|neighbourhood"],["mudarse","to move"],["el ascensor|el elevador","elevator|lift"],["la llave","key"],["el garaje|la cochera","garage"],["el jardín","garden|yard"]],
  emotions:[["sentir","to feel"],["llorar","to cry"],["reír|reírse","to laugh"],["sonreír","to smile"],["preocuparse","to worry"],["enojarse|enfadarse","to get angry|to get mad"],["calmarse|tranquilizarse","to calm down"],["sorprender","to surprise"]],
  devices:[["la aplicación|la app","app|application"],["la batería|la pila","battery"],["el mensaje","message"],["la impresora","printer"],["guardar","to save|to keep"],["borrar|eliminar","to delete|to erase"],["la actualización","update"],["el servidor","server"]],
  trips:[["el pasajero|la pasajera","passenger"],["la reserva|la reservación","reservation|booking"],["el destino","destination"],["el viaje","trip|journey"],["la frontera","border"],["el turista|la turista","tourist"],["la salida","exit|departure"],["la llegada","arrival"]],
  cooking:[["la carne","meat"],["las verduras|los vegetales","vegetables"],["el ajo","garlic"],["la sal","salt"],["la pimienta","pepper"],["el aceite","oil"],["la mantequilla","butter"],["el postre","dessert"]]
});
Object.assign(VOCAB.B2, {
  workplace:[["el plazo|la fecha límite","deadline"],["la renuncia","resignation"],["el sindicato","union|labor union|trade union"],["el jubilado|la jubilada","retiree|retired person"],["el turno","shift|turn"],["las horas extra","overtime"],["el aumento","raise|increase"],["la queja","complaint"]],
  values:[["la libertad","freedom|liberty"],["la paz","peace"],["la justicia","justice"],["la verdad","truth"],["la mentira","lie"],["la confianza","trust|confidence"],["el respeto","respect"],["la sabiduría","wisdom"]],
  disasters:[["el terremoto","earthquake"],["el huracán","hurricane"],["el volcán","volcano"],["la cosecha","harvest|crop"],["la selva","jungle|rainforest"],["el desierto","desert"],["la ola","wave"],["la costa","coast|shore"]],
  describe2:[["agotado|agotada","exhausted|sold out"],["imprescindible","essential|indispensable"],["sospechoso|sospechosa","suspicious|suspect"],["agradecido|agradecida","grateful|thankful"],["exigente","demanding"],["dispuesto|dispuesta","willing|ready"],["inesperado|inesperada","unexpected"],["peligroso|peligrosa","dangerous"]],
  verbs3:[["aprovechar","to take advantage of|to make the most of"],["desarrollar","to develop"],["fomentar","to encourage|to promote"],["destacar","to stand out|to highlight"],["enfrentar|afrontar","to face|to confront"],["superar","to overcome|to exceed"],["cumplir","to fulfill|to meet|to keep"],["merecer","to deserve"]]
});

/* ---------- Five more phrases for every island ---------- */
const ISLAND_MORE = {
job:[
 ["I have a meeting at ten.","(Yo) tengo una [reunión|junta] a las diez.","reunión","meeting"],
 ["I am looking for a new job.","(Yo) [busco|estoy buscando] un [trabajo nuevo|nuevo trabajo].|(Yo) estoy buscando otro trabajo.","busco","looking"],
 ["I work the night shift.","(Yo) trabajo en el turno de noche.|(Yo) trabajo el turno de noche.|(Yo) trabajo en el turno nocturno.","turno","shift"],
 ["I repair computers.|I fix computers.","(Yo) [reparo|arreglo] [computadoras|ordenadores].","reparo","repair"],
 ["I would like a raise.","(A mí) me gustaría un aumento (de sueldo).|Quisiera un aumento (de sueldo).","aumento","raise"]
],
weekend:[
 ["On Saturday I cleaned the house.|I cleaned the house on Saturday.","El sábado limpié la casa.|(Yo) limpié la casa el sábado.","limpié","cleaned"],
 ["We had a barbecue.","([Nosotros|Nosotras]) hicimos una [parrillada|carne asada|barbacoa].|Hicimos un asado.","hicimos","barbecue"],
 ["I went shopping with my sister.","(Yo) fui de compras con mi hermana.","compras","shopping"],
 ["I stayed home and rested.","(Yo) me quedé en casa y descansé.","quedé","stayed"],
 ["The weekend went by fast.|The weekend went by quickly.","El fin de semana (se) pasó [rápido|volando].","pasó","went"]
],
family:[
 ["My father works in construction.|My dad works in construction.","Mi [padre|papá] trabaja en (la) construcción.","construcción","construction"],
 ["My sister has two kids.|My sister has two children.","Mi hermana tiene dos hijos.","hijos","kids"],
 ["My cousins live in Mexico.","Mis [primos|primas] viven en México.","primos","cousins"],
 ["We get together for the holidays.","Nos [reunimos|juntamos] para las fiestas.|Nos reunimos en las fiestas.","reunimos","together"],
 ["My grandparents tell a lot of stories.|My grandparents tell many stories.","Mis abuelos cuentan muchas historias.|Mis abuelos cuentan muchos cuentos.","abuelos","grandparents"]
],
food:[
 ["I am a vegetarian.|I am vegetarian.","(Yo) soy vegetarian[o|a].","vegetariano","vegetarian"],
 ["Breakfast is my favorite meal.","El desayuno es mi comida [favorita|preferida].","desayuno","breakfast"],
 ["Can I see the menu?|May I see the menu?","¿Puedo ver el menú?|¿Puedo ver la carta?|¿Me trae el menú?|¿Me da el menú?","menú","menu"],
 ["I would like the chicken, please.","Quisiera el pollo, por favor.|Me gustaría el pollo, por favor.|Quiero el pollo, por favor.","pollo","chicken"],
 ["This is too salty.","Esto está [demasiado|muy] salado.","salado","salty"]
],
hometown:[
 ["My town has one main street.","Mi pueblo tiene una calle principal.","principal","main"],
 ["There is a lot of traffic in the morning.","Hay mucho tráfico [por|en] la mañana.","tráfico","traffic"],
 ["Everybody knows everybody.|Everyone knows everyone.","Todos se conocen.|Todo el mundo se conoce.|Todos nos conocemos.","conocen","knows"],
 ["It is quiet at night.","Es tranquilo por la noche.|Está tranquilo por la noche.|Es tranquilo de noche.","tranquilo","quiet"],
 ["There are good restaurants downtown.","Hay buenos restaurantes en el centro.|En el centro hay buenos restaurantes.","restaurantes","restaurants"]
],
routine:[
 ["I make my bed every morning.","(Yo) [tiendo|hago] la cama [todas las mañanas|cada mañana].","cama","bed"],
 ["I pick up my kids at three.|I pick my kids up at three.","(Yo) recojo a mis hijos a las tres.|Paso por mis hijos a las tres.","recojo","pick"],
 ["I check my email at work.","(Yo) reviso [mi|el] correo en el trabajo.","reviso","check"],
 ["Before bed I read a little.","Antes de [dormir|acostarme] leo un poco.","poco","little"],
 ["I am always in a hurry.","Siempre tengo prisa.|Siempre estoy apurad[o|a].|Siempre ando con prisa.","siempre","always"]
],
hobbies:[
 ["I like to take photos.|I like taking photos.|I like taking pictures.","(A mí) me gusta [tomar|sacar] fotos.","fotos","photos"],
 ["I go fishing with my brother.","(Yo) voy a pescar con mi hermano.|(Yo) voy de pesca con mi hermano.","pescar","fishing"],
 ["I collect coins.","(Yo) colecciono monedas.","monedas","coins"],
 ["I paint on weekends.","(Yo) pinto los fines de semana.","pinto","paint"],
 ["Do you want to play with me?","¿Quieres jugar conmigo?|¿Quiere jugar conmigo?","conmigo","play"]
],
travel:[
 ["Where is the exit?","¿Dónde está la salida?","salida","exit"],
 ["I lost my suitcase.","(Yo) perdí [mi|la] maleta.|Se me perdió la maleta.","maleta","suitcase"],
 ["What time does the flight leave?","¿A qué hora sale el vuelo?","sale","leave"],
 ["I need a taxi.","(Yo) necesito un taxi.","taxi","taxi"],
 ["Is breakfast included?","¿El desayuno está incluido?|¿Está incluido el desayuno?|¿Incluye el desayuno?","incluido","included"]
],
health:[
 ["I hurt my back.","Me lastimé la espalda.|Me hice daño en la espalda.|Me lesioné la espalda.","espalda","back"],
 ["I need to rest.","(Yo) necesito descansar.","descansar","rest"],
 ["Where is the pharmacy?","¿Dónde está la farmacia?","farmacia","pharmacy"],
 ["I have an appointment at four.","(Yo) tengo una cita a las cuatro.","cita","appointment"],
 ["I drink a lot of water.","(Yo) [bebo|tomo] mucha agua.","mucha","lot"]
],
shopping:[
 ["Where are the fitting rooms?","¿Dónde están los probadores?","probadores","fitting"],
 ["It is too small for me.","Me queda (muy) pequeño.|Me queda chico.|Me queda pequeña.|Es demasiado pequeño para mí.","queda","small"],
 ["Do you have a bag?","¿Tiene una bolsa?|¿Tienes una bolsa?|¿Me da una bolsa?","bolsa","bag"],
 ["I want to return this.","(Yo) quiero devolver esto.|Quisiera devolver esto.","devolver","return"],
 ["Where is the checkout?","¿Dónde está la caja?|¿Dónde se paga?","caja","checkout"]
],
idioms:[
 ["To have your head in the clouds.|To be in the clouds.","Estar en las nubes.","nubes","clouds"],
 ["When pigs fly.","Cuando las ranas críen pelo.|Cuando los cerdos vuelen.","ranas","pigs"],
 ["Every cloud has a silver lining.","No hay mal que por bien no venga.","mal","cloud"],
 ["Actions speak louder than words.","Obras son amores, que no buenas razones.|Los hechos valen más que las palabras.|Hechos, no palabras.","obras","actions"],
 ["The early bird catches the worm.","Al que madruga, Dios lo ayuda.|A quien madruga, Dios le ayuda.","madruga","early"]
]
};
for(const isl of ISLANDS) if(ISLAND_MORE[isl.id]) isl.it.push(...ISLAND_MORE[isl.id]);
