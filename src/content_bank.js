/* ===================== Pre-built content: vocab bank, islands, number syllabus ===================== */
// Vocab entries: [Spanish, English]; the first alternative is the one shown.
const CATS = {
  animals:{en:"Animals",es:"Animales"}, food:{en:"Food",es:"Comida"}, family:{en:"Family",es:"Familia"}, home:{en:"Home",es:"Casa"},
  colors:{en:"Colors",es:"Colores"}, body:{en:"Body",es:"Cuerpo"}, time:{en:"Time",es:"Tiempo"}, verbs:{en:"Everyday verbs",es:"Verbos cotidianos"},
  city:{en:"Around town",es:"En la ciudad"}, clothes:{en:"Clothes",es:"Ropa"}, adjectives:{en:"Describing things",es:"Describir cosas"},
  travel:{en:"Travel",es:"Viajes"}, work:{en:"Work",es:"Trabajo"}, weather:{en:"Weather",es:"Clima"}, health:{en:"Health",es:"Salud"},
  feelings:{en:"Feelings",es:"Emociones"}, kitchen:{en:"Kitchen",es:"Cocina"}, actions:{en:"Action verbs",es:"Verbos de acción"},
  tech:{en:"Tech",es:"Tecnología"}, nature:{en:"Nature",es:"Naturaleza"}, money:{en:"Money",es:"Dinero"}
};
const VOCAB = {
A1:{
  animals:[["el perro","dog"],["el gato","cat"],["el pájaro","bird"],["el caballo","horse"],["el pez|el pescado","fish"],["la vaca","cow"]],
  food:[["el pan","bread"],["la leche","milk"],["el huevo","egg"],["el queso","cheese"],["la manzana","apple"],["el arroz","rice"],["el pollo","chicken"],["el agua","water"]],
  family:[["la madre|la mamá","mother|mom"],["el padre|el papá","father|dad"],["el hermano","brother"],["la hermana","sister"],["el hijo","son"],["la hija","daughter"],["el abuelo","grandfather|grandpa"],["la abuela","grandmother|grandma"]],
  home:[["la casa","house|home"],["la puerta","door"],["la ventana","window"],["la mesa","table"],["la silla","chair"],["la cama","bed"],["la cocina","kitchen"],["el baño","bathroom|restroom"]],
  colors:[["rojo|roja","red"],["azul","blue"],["verde","green"],["amarillo|amarilla","yellow"],["negro|negra","black"],["blanco|blanca","white"]],
  body:[["la cabeza","head"],["la mano","hand"],["el ojo","eye"],["la boca","mouth"],["el pie","foot"],["el brazo","arm"]],
  time:[["hoy","today"],["mañana","tomorrow|morning"],["ayer","yesterday"],["la semana","week"],["el día","day"],["la noche","night"],["el año","year"],["la hora","hour|time"]],
  verbs:[["comer","to eat"],["beber|tomar","to drink"],["dormir","to sleep"],["hablar","to speak|to talk"],["caminar","to walk"],["leer","to read"],["escribir","to write"],["comprar","to buy"]],
  city:[["la calle","street"],["la tienda","store|shop"],["la escuela","school"],["el banco","bank"],["el parque","park"],["el trabajo","work|job"]],
  clothes:[["la camisa","shirt"],["los zapatos","shoes"],["los pantalones|el pantalón","pants|trousers"],["el vestido","dress"],["el sombrero","hat"],["la chaqueta","jacket"]],
  adjectives:[["grande","big|large"],["pequeño|pequeña|chico|chica","small|little"],["bueno|buena|buen","good"],["malo|mala|mal","bad"],["nuevo|nueva","new"],["viejo|vieja","old"],["feliz|contento|contenta","happy"],["cansado|cansada","tired"]]
},
A2:{
  travel:[["el aeropuerto","airport"],["el boleto|el billete|el pasaje","ticket"],["la maleta","suitcase"],["el pasaporte","passport"],["el vuelo","flight"],["la playa","beach"],["el mapa","map"]],
  work:[["el jefe|la jefa","boss"],["la reunión|la junta","meeting"],["el sueldo|el salario","salary|pay|wage"],["la oficina","office"],["el cliente|la clienta","customer|client"],["el horario","schedule|timetable"]],
  weather:[["la lluvia","rain"],["el sol","sun"],["la nieve","snow"],["el viento","wind"],["la nube","cloud"],["el calor","heat"],["el frío","cold"],["la tormenta","storm"]],
  health:[["el dolor","pain"],["la fiebre","fever"],["la medicina|el medicamento","medicine|medication"],["el médico|la médica|el doctor|la doctora","doctor"],["la gripe","flu"],["la cita","appointment|date"]],
  feelings:[["triste","sad"],["enojado|enojada|enfadado|enfadada","angry|mad"],["nervioso|nerviosa","nervous"],["preocupado|preocupada","worried"],["orgulloso|orgullosa","proud"],["aburrido|aburrida","bored|boring"],["asustado|asustada","scared|afraid|frightened"],["tranquilo|tranquila","calm|quiet"]],
  kitchen:[["el cuchillo","knife"],["el tenedor","fork"],["la cuchara","spoon"],["el plato","plate|dish"],["el vaso","glass"],["la sartén|el sartén","frying pan|pan|skillet"],["la olla","pot"],["el horno","oven"]],
  actions:[["viajar","to travel"],["cocinar","to cook"],["limpiar","to clean"],["ayudar","to help"],["aprender","to learn"],["olvidar","to forget"],["recordar|acordarse","to remember"],["ganar","to win|to earn"],["perder","to lose"],["esperar","to wait|to hope|to expect"]],
  tech:[["la computadora|el ordenador|el computador","computer"],["la pantalla","screen"],["el teclado","keyboard"],["la contraseña","password"],["el correo electrónico|el correo|el email","email|e-mail"],["el cargador","charger"],["el archivo","file"],["la red","network|net"]],
  nature:[["el río","river"],["la montaña","mountain"],["el árbol","tree"],["la flor","flower"],["el mar","sea"],["el bosque","forest|woods"],["el cielo","sky"],["la estrella","star"]],
  money:[["el dinero","money"],["el precio","price"],["barato|barata","cheap|inexpensive"],["caro|cara","expensive"],["la cuenta","bill|check|account"],["el efectivo","cash"],["la tarjeta","card"],["el cambio","change"]]
}
};

// Island phrases: [English, Spanish, cloze word (Spanish), cloze word (English)]
const ISLANDS = [
{id:"job", en:"My job", es:"Mi trabajo", nav:[8,9], it:[
 ["I work in an office.","(Yo) trabajo en una oficina.","oficina","office"],
 ["I started this job last year.","(Yo) [empecé|comencé] este trabajo el año pasado.|El año pasado [empecé|comencé] este trabajo.","empecé","started"],
 ["My boss is very [nice|kind|friendly].","Mi [jefe|jefa] es muy [amable|simpático|simpática|agradable].","jefe","boss"],
 ["I start at eight in the morning.","(Yo) [empiezo|comienzo|entro] a las ocho de la mañana.","ocho","eight"],
 ["I like my [job|work].","(A mí) me gusta mi trabajo.","gusta","like"],
 ["Sometimes I work on [weekends|the weekend|the weekends].|I sometimes work on [weekends|the weekend].|I work on weekends sometimes.","A veces trabajo los fines de semana.|(Yo) a veces trabajo los fines de semana.|(Yo) trabajo a veces los fines de semana.|(Yo) trabajo los fines de semana a veces.","veces","sometimes"],
 ["What do you do for work?|What do you do for a living?|What do you do?|What is your job?","¿En qué trabajas?|¿A qué te dedicas?|¿En qué trabaja (usted)?|¿A qué se dedica (usted)?|¿Cuál es tu trabajo?","trabajas","do"],
 ["My [coworkers|colleagues|co-workers] are [friendly|nice|kind].","Mis compañeros (de trabajo) son [amables|simpáticos|amigables|agradables].|Mis colegas son [amables|simpáticos|amigables|agradables].","compañeros","coworkers"],
 ["Speaking of work, I have a new project.","Hablando de trabajo, tengo un [proyecto nuevo|nuevo proyecto].|Hablando del trabajo, tengo un [proyecto nuevo|nuevo proyecto].","hablando","speaking"],
 ["And you, do you like your [job|work]?|What about you, do you like your [job|work]?|How about you, do you like your [job|work]?","Y tú, ¿te gusta tu trabajo?|Y a ti, ¿te gusta tu trabajo?|Y usted, ¿le gusta su trabajo?|Y a usted, ¿le gusta su trabajo?","gusta","like"]
]},
{id:"weekend", en:"My weekend", es:"Mi fin de semana", nav:[8,9], it:[
 ["On Saturdays I sleep [late|in].|I sleep [late|in] on Saturdays.|On Saturdays I get up late.","Los sábados duermo hasta tarde.|Los sábados (yo) duermo tarde.|Los sábados me levanto tarde.","sábados","Saturdays"],
 ["I went to the [movies|cinema|movie theater] with my friends.","(Yo) fui al cine con mis amig[os|as].","cine","movies"],
 ["We ate at a Mexican restaurant.|We had dinner at a Mexican restaurant.","([Nosotros|Nosotras]) comimos en un restaurante mexicano.|Cenamos en un restaurante mexicano.","comimos","ate"],
 ["On Sunday I rested at home.|I rested at home on Sunday.|On Sunday I relaxed at home.","El domingo descansé en casa.|(Yo) descansé en casa el domingo.","descansé","rested"],
 ["I [watched|saw] a very good [show|series].","(Yo) vi una serie muy buena.|(Yo) vi un programa muy bueno.","vi","watched"],
 ["What did you do this weekend?|What did you do on the weekend?|What did you do over the weekend?","¿Qué hiciste este fin de semana?|¿Qué hizo (usted) este fin de semana?|¿Qué hiciste el fin de semana?|¿Qué hicieron este fin de semana?","hiciste","did"],
 ["Next weekend I am going to travel.|I am going to travel next weekend.","El próximo fin de semana voy a viajar.|El fin de semana que viene voy a viajar.|(Yo) voy a viajar el próximo fin de semana.","viajar","travel"],
 ["I had a great time.|I had a lot of fun.|I had so much fun.|I had a really good time.","(Yo) me divertí mucho.|(Yo) [la|lo] pasé [muy bien|genial|increíble].","divertí","great"],
 ["That reminds me, I saw your brother on Saturday.|That reminds me that I saw your brother on Saturday.","Eso me recuerda que vi a tu hermano el sábado.|Eso me recuerda, vi a tu hermano el sábado.|Eso me hace recordar que vi a tu hermano el sábado.","recuerda","reminds"],
 ["By the way, do you have plans for Sunday?|By the way, do you have any plans for Sunday?|By the way, do you have plans on Sunday?","Por cierto, ¿tienes planes para el domingo?|A propósito, ¿tienes planes para el domingo?|Por cierto, ¿tiene (usted) planes para el domingo?","cierto","way"]
]},
{id:"family", en:"My family", es:"Mi familia", nav:[8,9], it:[
 ["I have two brothers and [one|a] sister.","(Yo) tengo dos hermanos y una hermana.","hermanos","brothers"],
 ["My parents live in [another|a different] city.","Mis [padres|papás] viven en otra ciudad.","otra","another"],
 ["My [mother|mom] cooks very well.|My [mother|mom] is a very good cook.","Mi [madre|mamá] cocina muy bien.","cocina","cooks"],
 ["I am the [oldest|eldest].","(Yo) soy [el|la] mayor.","mayor","oldest"],
 ["We see each other every Sunday.|We see each other on Sundays.","Nos vemos [todos los domingos|cada domingo].","vemos","see"],
 ["My [grandmother|grandma] is ninety years old.|My [grandmother|grandma] is ninety.","Mi abuela tiene noventa años.","tiene","is"],
 ["I am married and {I} have a son.","(Yo) estoy casad[o|a] y tengo un hijo.|(Yo) soy casad[o|a] y tengo un hijo.","casado","married"],
 ["Do you have a [big|large] family?|Is your family [big|large]?","¿(Tú) tienes una familia grande?|¿Tu familia es grande?|¿Tiene (usted) una familia grande?|¿Tienes familia grande?","familia","family"],
 ["Speaking of family, how is your [mother|mom]?","Hablando de (la) familia, ¿cómo está tu [madre|mamá]?|Hablando de (la) familia, ¿cómo está su [madre|mamá]?","hablando","speaking"],
 ["My family is very important [to|for] me.","Mi familia es muy importante para mí.","para","to"]
]},
{id:"food", en:"Food I love", es:"Comida que me encanta", nav:[8,9], it:[
 ["My favorite food is pizza.|Pizza is my favorite food.|My favourite food is pizza.","Mi comida favorita es la pizza.|Mi comida preferida es la pizza.|La pizza es mi comida favorita.","favorita","favorite"],
 ["I love spicy food.|I really like spicy food.","(A mí) me encanta la comida picante.|Amo la comida picante.","picante","spicy"],
 ["I do not eat meat.","(Yo) no como carne.","carne","meat"],
 ["I cook almost every day.|I cook nearly every day.","(Yo) cocino casi todos los días.|(Yo) cocino casi cada día.|Casi todos los días cocino.","casi","almost"],
 ["Do you want to try it?|Would you like to try it?|Want to try it?","¿Quieres probarlo?|¿Lo quieres probar?|¿Quiere probarlo?|¿Quieres probarla?|¿La quieres probar?","probarlo","try"],
 ["It is delicious.|It is very tasty.|It is really good.","Está delicios[o|a].|Es delicios[o|a].|Está [riquísimo|riquísima|muy rico|muy rica].","delicioso","delicious"],
 ["I am allergic to nuts.","(Yo) soy alérgic[o|a] a [las nueces|los frutos secos].","nueces","nuts"],
 ["What do you recommend?|What would you recommend?","¿Qué me recomiendas?|¿Qué recomiendas?|¿Qué me recomienda (usted)?|¿Qué recomienda (usted)?","recomiendas","recommend"],
 ["Speaking of food, I know a [great|really good|very good|excellent] restaurant.","Hablando de comida, conozco un restaurante [excelente|buenísimo|genial|muy bueno].|Hablando de comida, conozco un [gran|excelente|buen] restaurante.","conozco","know"],
 ["The [bill|check], please.|Can I have the [bill|check], please?|Check, please.","La cuenta, por favor.","cuenta","bill"]
]},
{id:"hometown", en:"My hometown", es:"Mi ciudad", nav:[8,9], it:[
 ["I am from a small town.|I come from a small town.","(Yo) soy de un pueblo pequeño.|(Yo) soy de una ciudad pequeña.|(Yo) soy de un pueblito.|(Yo) vengo de un pueblo pequeño.","pueblo","town"],
 ["I have lived here all my life.|I have lived here my whole life.","(Yo) he vivido aquí toda mi vida.|(Yo) he vivido aquí toda la vida.|Toda mi vida he vivido aquí.|(Yo) viví aquí toda mi vida.","vida","life"],
 ["There is a [beautiful|pretty|lovely|nice] park downtown.|There is a [beautiful|pretty|lovely] park in the [center|city center].","Hay un parque [hermoso|bonito|lindo|precioso] en el centro.|En el centro hay un parque [hermoso|bonito|lindo|precioso].|Hay un [hermoso|bonito|lindo] parque en el centro.","centro","downtown"],
 ["It is very hot in {the} summer.|In {the} summer it is very hot.|It gets very hot in {the} summer.","Hace mucho calor en (el) verano.|En (el) verano hace mucho calor.","calor","hot"],
 ["{The} people are very [friendly|nice|kind].","La gente es muy [amable|amigable|simpática].|Las personas son muy [amables|amigables|simpáticas].","gente","people"],
 ["I miss my [city|town|hometown].","(Yo) extraño mi ciudad.|(Yo) echo de menos mi ciudad.|(Yo) extraño mi pueblo.","extraño","miss"],
 ["Where are you from?|Where do you come from?","¿De dónde eres?|¿De dónde es (usted)?|¿De dónde son (ustedes)?","dónde","where"],
 ["You have to visit it.|You must visit it.|You have got to visit it.|You should visit it.","Tienes que visitarl[a|o].|[La|Lo] tienes que visitar.|Tiene que visitarl[a|o].|Tienen que visitarl[a|o].","visitarla","visit"],
 ["That reminds me of my [town|hometown|city].","Eso me recuerda a mi pueblo.|Eso me recuerda mi pueblo.|Eso me hace recordar mi pueblo.|Eso me recuerda a mi ciudad.","recuerda","reminds"],
 ["By the way, have you been to Mexico?|By the way, have you ever been to Mexico?","Por cierto, ¿has estado en México?|A propósito, ¿has estado en México?|Por cierto, ¿has ido a México?|Por cierto, ¿ha estado (usted) en México?|Por cierto, ¿conoces México?","estado","been"]
]}
];

// Number Cruncher: every challenge is generated, so each level has endless content.
const NUMSYL = {
A1:[
 {ty:"int",a:0,b:10,en:"Numbers 0 to 10",es:"Números del 0 al 10"},
 {ty:"int",a:11,b:20,en:"Numbers 11 to 20",es:"Números del 11 al 20"},
 {ty:"time",m:"hour",en:"Time: on the hour",es:"La hora en punto"},
 {ty:"math",ops:"+-",b:20,en:"Adding and subtracting to 20",es:"Sumar y restar hasta 20"},
 {ty:"int",a:10,b:100,step:10,en:"Tens: 10 to 100",es:"Decenas: del 10 al 100"},
 {ty:"price",a:1,b:20,en:"Prices in whole dollars",es:"Precios en dólares exactos"},
 {ty:"int",a:21,b:59,en:"Numbers 21 to 59",es:"Números del 21 al 59"},
 {ty:"time",m:"half",en:"Quarter and half hours",es:"Y cuarto, y media, menos cuarto"},
 {ty:"int",a:60,b:99,en:"Numbers 60 to 99",es:"Números del 60 al 99"},
 {ty:"shop",b:10,en:"Shopping totals",es:"Totales de compras"},
 {ty:"math",ops:"+-",b:100,en:"Math up to 100",es:"Cuentas hasta 100"},
 {ty:"ord",a:1,b:5,en:"Ordinals: first to fifth",es:"Ordinales: del primero al quinto"},
 {ty:"int",a:100,b:199,en:"Numbers 100 to 199",es:"Números del 100 al 199"},
 {ty:"time",m:"min",en:"Minutes on the clock",es:"Minutos en el reloj"},
 {ty:"price",a:1,b:20,cents:1,en:"Prices with cents",es:"Precios con centavos"}
],
A2:[
 {ty:"int",a:200,b:999,en:"Numbers 200 to 999",es:"Números del 200 al 999"},
 {ty:"time",m:"min",en:"Any time on the clock",es:"Cualquier hora del reloj"},
 {ty:"price",a:20,b:100,cents:1,en:"Prices up to $100",es:"Precios hasta $100"},
 {ty:"math",ops:"x",b:12,en:"Multiplication",es:"Multiplicación"},
 {ty:"int",a:1000,b:9999,en:"Thousands",es:"Miles"},
 {ty:"ord",a:6,b:10,en:"Ordinals: sixth to tenth",es:"Ordinales: del sexto al décimo"},
 {ty:"year",a:1900,b:1999,en:"Years: the 1900s",es:"Años: el siglo XX"},
 {ty:"shop",b:15,change:1,en:"Getting change",es:"El cambio"},
 {ty:"int",a:10000,b:99999,en:"Tens of thousands",es:"Decenas de mil"},
 {ty:"pct",a:1,b:100,en:"Percentages",es:"Porcentajes"},
 {ty:"year",a:2000,b:2030,en:"Years: 2000 and after",es:"Años: del 2000 en adelante"},
 {ty:"math",ops:"+-x",b:200,en:"Mixed math",es:"Cuentas mixtas"},
 {ty:"time",m:"24",en:"24-hour time",es:"Formato de 24 horas"},
 {ty:"price",a:100,b:999,en:"Prices in the hundreds",es:"Precios de cientos"},
 {ty:"int",a:100000,b:999999,en:"Hundreds of thousands",es:"Cientos de miles"}
],
B1:[
 {ty:"int",a:1000000,b:20000000,step:1000000,en:"Round millions",es:"Millones exactos"},
 {ty:"dec",b:20,en:"Decimals",es:"Decimales"},
 {ty:"frac",en:"Fractions",es:"Fracciones"},
 {ty:"math",ops:"/",b:12,en:"Division",es:"División"},
 {ty:"int",a:1000000,b:9999000,step:1000,en:"Millions and thousands",es:"Millones y miles"},
 {ty:"pct",a:1,b:99,dec:1,en:"Percentages with decimals",es:"Porcentajes con decimales"},
 {ty:"ord",a:11,b:31,en:"Ordinals for dates",es:"Ordinales: repaso"},
 {ty:"price",a:1000,b:99999,en:"Big prices",es:"Precios grandes"},
 {ty:"time",m:"24",en:"Schedules in 24-hour time",es:"Horarios en 24 horas"},
 {ty:"shop",b:40,change:1,n:3,en:"Three-item receipts",es:"Recibos de tres artículos"},
 {ty:"year",a:1500,b:1899,en:"Historic years",es:"Años históricos"},
 {ty:"int",a:1,b:999999,en:"Any number up to a million",es:"Cualquier número hasta un millón"},
 {ty:"math",ops:"+-x/",b:500,en:"All four operations",es:"Las cuatro operaciones"},
 {ty:"pct",a:101,b:900,en:"Percentages over 100",es:"Porcentajes mayores de 100"},
 {ty:"int",a:10000000,b:999000000,step:1000000,en:"Hundreds of millions",es:"Cientos de millones"}
]
};
