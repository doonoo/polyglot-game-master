/* ===================== Bigger pools: Spanish for English speakers, A1–A2 ===================== */
function moreItems(list, extra){ extra.forEach((items, i) => { if(items && list[i]) list[i].it.push(...items); }); }

moreItems(ES_A1, [
[ // Greetings
 ["See you tomorrow!","¡Hasta mañana!|¡Nos vemos mañana!","mañana","¡Hasta mañano!"],
 ["Goodbye!|Bye!","¡Adiós!|¡Chao!|¡Chau!","adiós","¡Adiosa!"],
 ["Nice to meet you.|Pleased to meet you.","Mucho gusto.|Encantad[o|a].|Un placer.","gusto","Mucha gusto."],
 ["Thank you very much!|Thanks a lot!","¡Muchas gracias!|¡Mil gracias!","muchas","¡Muchos gracias!"],
 ["You are welcome.","De nada.|No hay de qué.|Con gusto.","nada","De nado."],
 ["Good evening, how are you?","Buenas noches, ¿cómo estás?|Buenas noches, ¿cómo está (usted)?|Buenas noches, ¿qué tal?","noches","Buenos noches, ¿cómo estás?"]
],
[ // Ser
 ["I am from Tennessee.","(Yo) soy de Tennessee.","soy","Yo estoy de Tennessee."],
 ["He is very tall.","{Él} es muy alto.","es","Él son muy alto."],
 ["We are from Mexico.","([Nosotros|Nosotras]) somos de México.","somos","Nosotros es de México."],
 ["Are you a teacher?","¿(Tú) eres [profesor|profesora|maestro|maestra]?|¿Eres tú [profesor|profesora|maestro|maestra]?|¿(Usted) es [profesor|profesora|maestro|maestra]?|¿Es usted [profesor|profesora|maestro|maestra]?","eres","¿Tú es profesor?"],
 ["The house is big.","La casa es grande.","es","La casa son grande."],
 ["They are students.","{[Ellos|Ellas]} son estudiantes.","son","Ellos es estudiantes."]
],
[ // Gender and articles
 ["It is a car.","Es un [carro|coche|auto].","un","Es una carro."],
 ["The door is red.","La puerta es roja.","la","El puerta es roja."],
 ["It is a city.","Es una ciudad.","una","Es un ciudad."],
 ["The day is long.","El día es largo.","el","La día es largo."],
 ["I have a cat.","(Yo) tengo un gato.","un","Tengo una gato."],
 ["The bed is new.","La cama es nueva.","la","El cama es nueva."]
],
[ // Plurals
 ["The cars are red.","Los [carros|coches|autos] son rojos.","los","El carros son rojos."],
 ["The tables are small.","Las mesas son [pequeñas|chicas].","mesas","Las mesa son pequeñas."],
 ["The cats are black.","Los gatos son negros.","gatos","Los gato son negros."],
 ["The walls are white.","Las paredes son blancas.","paredes","Las pareds son blancas."],
 ["The cities are pretty.|The cities are beautiful.","Las ciudades son [bonitas|lindas|hermosas].","ciudades","Las ciudad son bonitas."]
],
[ // Estar
 ["Where are you?","¿Dónde estás (tú)?|¿Dónde está (usted)?|¿Dónde están (ustedes)?","estás","¿Dónde eres?"],
 ["I am tired.","(Yo) estoy cansad[o|a].","estoy","Yo soy cansado."],
 ["The bank is near here.|The bank is nearby.","El banco está cerca (de aquí).","está","El banco es cerca de aquí."],
 ["They are at the park.|They are in the park.","{[Ellos|Ellas]} están en el parque.","están","Ellos son en el parque."],
 ["We are happy today.","([Nosotros|Nosotras]) estamos [contentos|contentas|felices] hoy.|Hoy estamos [contentos|contentas|felices].","estamos","Nosotros está contentos hoy."]
],
[ // Tener
 ["I have two brothers.","(Yo) tengo dos hermanos.","tengo","Yo tiene dos hermanos."],
 ["She is thirsty.","{Ella} tiene sed.","tiene","Ella está sed."],
 ["They have a car.","{[Ellos|Ellas]} tienen un [carro|coche|auto].","tienen","Ellos tiene un carro."],
 ["How old are you?","¿Cuántos años tienes?|¿Cuántos años tiene (usted)?|¿Cuántos años tienen?","años","¿Cuántos años eres?"],
 ["We are hungry.","([Nosotros|Nosotras]) tenemos hambre.","tenemos","Nosotros estamos hambre."],
 ["I am cold.","(Yo) tengo frío.","frío","Yo soy frío."]
],
[ // -ar verbs
 ["I work every day.","(Yo) trabajo todos los días.|Todos los días trabajo.|(Yo) trabajo cada día.","trabajo","Yo trabaja todos los días."],
 ["We buy bread.|We are buying bread.","([Nosotros|Nosotras]) compramos pan.","compramos","Nosotros compran pan."],
 ["She speaks English.","{Ella} habla inglés.","habla","Ella hablas inglés."],
 ["You study a lot.","(Tú) estudias mucho.|(Usted) estudia mucho.|(Ustedes) estudian mucho.","estudias","Tú estudio mucho."],
 ["They walk in the park.","{[Ellos|Ellas]} caminan [en|por] el parque.","caminan","Ellos caminamos en el parque."]
],
[ // -er / -ir verbs
 ["I drink coffee.","(Yo) [bebo|tomo] café.","bebo","Yo bebe café."],
 ["She writes a letter.|She is writing a letter.","{Ella} escribe una carta.","escribe","Ella escribo una carta."],
 ["We read books.","([Nosotros|Nosotras]) leemos libros.","leemos","Nosotros leen libros."],
 ["They live in Texas.","{[Ellos|Ellas]} viven en Texas.","viven","Ellos vive en Texas."],
 ["Do you eat meat?","¿(Tú) comes carne?|¿Comes carne tú?|¿(Usted) come carne?|¿Come (usted) carne?|¿(Ustedes) comen carne?","comes"]
],
[ // No and yes/no questions
 ["I do not have time.","(Yo) no tengo tiempo.","no","Yo tengo no tiempo."],
 ["They do not live here.","{[Ellos|Ellas]} no viven aquí.","no","Ellos viven no aquí."],
 ["Is she tired?","¿{Ella} está cansada?|¿Está cansada {ella}?|¿Está {ella} cansada?","está","¿Es ella cansada?"],
 ["Do you also speak English?|Do you speak English too?","¿(Tú) también hablas inglés?|¿Hablas inglés también?|¿También hablas inglés?|¿(Usted) también habla inglés?|¿Habla (usted) inglés también?","también"],
 ["No, I do not work today.","No, (yo) no trabajo hoy.|No, hoy no trabajo.","trabajo","No, yo trabajo no hoy."]
],
[ // Question words
 ["What is this?","¿Qué es esto?","qué","¿Cuál es esto?"],
 ["How are you?","¿Cómo estás?|¿Cómo está (usted)?|¿Qué tal?|¿Cómo están?","cómo","¿Qué estás?"],
 ["Where is the bank?","¿Dónde está el banco?|¿Dónde queda el banco?","dónde","¿Dónde es el banco?"],
 ["How much does it cost?|How much is it?","¿Cuánto cuesta?|¿Cuánto es?|¿Cuánto vale?","cuánto"],
 ["Who are you?","¿Quién eres (tú)?|¿Quién es (usted)?|¿Quiénes son (ustedes)?","quién","¿Qué eres tú?"]
],
[ // Adjectives
 ["I have a black cat.","(Yo) tengo un gato negro.","negro","Tengo un negro gato."],
 ["The car is new.","El [carro|coche|auto] es nuevo.","nuevo","El carro es nueva."],
 ["The tables are white.","Las mesas son blancas.","blancas","Las mesas son blancos."],
 ["She has a red dress.","{Ella} tiene un vestido rojo.","rojo","Ella tiene un vestido roja."],
 ["They are big houses.","Son casas grandes.","grandes","Son casas grande."]
],
[ // Gustar
 ["I like music.","(A mí) me gusta la música.","gusta","Yo gusto la música."],
 ["We like tacos.","(A [nosotros|nosotras]) nos gustan los tacos.","gustan","Nos gusta los tacos."],
 ["Do you like dogs?","¿(A ti) te gustan los perros?|¿Le gustan los perros (a usted)?|¿Les gustan los perros?","gustan","¿Te gusta los perros?"],
 ["He does not like coffee.","{A él} no le gusta el café.","le","Él no gusta el café."],
 ["I like to dance.|I like dancing.","(A mí) me gusta bailar.","bailar","Me gusto bailar."]
],
[ // Ir
 ["I am going home.","(Yo) voy a casa.|Me voy a casa.","voy","Yo va a casa."],
 ["They are going to the store.","{[Ellos|Ellas]} van a la tienda.","van","Ellos vamos a la tienda."],
 ["We are going to the beach.","([Nosotros|Nosotras]) vamos a la playa.","vamos","Nosotros vamos al la playa."],
 ["Are you going to work tomorrow?","¿Vas a trabajar mañana?|¿Va (usted) a trabajar mañana?|¿Van a trabajar mañana?|¿Mañana vas a trabajar?","vas","¿Vas trabajar mañana?"],
 ["She is going to the bank.","{Ella} va al banco.","al","Ella va a el banco."]
],
[ // Family and possessives
 ["My brother is tall.","Mi hermano es alto.","mi","Mis hermano es alto."],
 ["Her sister lives here.|His sister lives here.","Su hermana vive aquí.","su","Sus hermana vive aquí."],
 ["Our parents are here.","Nuestros [padres|papás] están aquí.","nuestros","Nuestro padres están aquí."],
 ["Your friends are nice.","Tus amigos son [simpáticos|amables|agradables].|Sus amigos son [simpáticos|amables|agradables].","tus","Tu amigos son simpáticos."],
 ["It is my father's house.|It is my dad's house.","Es la casa de mi [padre|papá].","de","Es mi padre's casa."]
],
[ // Hay
 ["There is a dog in the house.","Hay un perro en la casa.|En la casa hay un perro.","hay","Es un perro en la casa."],
 ["There are three books.","Hay tres libros.","hay","Están tres libros."],
 ["Is there a bathroom here?","¿Hay (un) baño aquí?|¿Hay baño?|¿Aquí hay (un) baño?","hay","¿Está un baño aquí?"],
 ["There are no tickets.","No hay [boletos|billetes|entradas].","hay","No son boletos."],
 ["There is a lot of food.","Hay mucha comida.","mucha","Hay mucho comida."]
]
]);

moreItems(ES_A2, [
[ // Ser vs estar
 ["My brother is a doctor.","Mi hermano es [médico|doctor].","es","Mi hermano está médico."],
 ["The coffee is hot.","El café está caliente.","está","~El café es caliente."],
 ["Where is the station?","¿Dónde está la estación?","está","¿Dónde es la estación?"],
 ["She is very intelligent.|She is very smart.","{Ella} es muy inteligente.","es","Ella están muy inteligente."],
 ["We are sick.","([Nosotros|Nosotras]) estamos enferm[os|as].","estamos","Somos enfermos."]
],
[ // Stem-changing verbs
 ["I cannot sleep.","(Yo) no puedo dormir.","puedo","Yo no podo dormir."],
 ["What do you want?","¿Qué quieres?|¿Qué quiere (usted)?|¿Qué quieren?","quieres","¿Qué queres?"],
 ["We are coming back tomorrow.|We return tomorrow.","([Nosotros|Nosotras]) volvemos mañana.|Mañana volvemos.|([Nosotros|Nosotras]) regresamos mañana.","volvemos","Nosotros vuelvemos mañana."],
 ["I think it is a good idea.","(Yo) pienso que es una buena idea.|Creo que es una buena idea.","pienso","Penso que es una buena idea."],
 ["The class starts at nine.|The class begins at nine.","La clase empieza a las nueve.|La clase comienza a las nueve.","empieza","La clase empeza a las nueve."]
],
[ // Reflexive verbs
 ["I shower in the morning.","(Yo) me ducho [por|en] la mañana.|(Yo) me baño [por|en] la mañana.","ducho","Yo ducho por la mañana."],
 ["He goes to bed early.","{Él} se acuesta temprano.","acuesta","Él acuesta temprano."],
 ["We get up at seven.","([Nosotros|Nosotras]) nos levantamos a las siete.","levantamos","Nos levantan a las siete."],
 ["She gets dressed quickly.","{Ella} se viste [rápido|rápidamente].","viste","Ella se vista rápido."],
 ["Do you wake up early?","¿Te despiertas temprano?|¿Se despierta (usted) temprano?|¿Se despiertan temprano?","despiertas","¿Despiertas temprano?"],
 ["I brush my teeth.","(Yo) me lavo los dientes.|(Yo) me cepillo los dientes.","lavo","Lavo mis dientes."]
],
[ // Present progressive
 ["I am working now.","(Yo) estoy trabajando ahora.|Ahora estoy trabajando.","trabajando","Estoy trabajo ahora."],
 ["She is talking on the phone.","{Ella} está hablando por teléfono.","hablando","Ella está hablo por teléfono."],
 ["They are playing soccer.","{[Ellos|Ellas]} están jugando (al) fútbol.","jugando","Ellos están jugar fútbol."],
 ["We are watching a movie.","([Nosotros|Nosotras]) estamos [viendo|mirando] una película.","viendo","Estamos veyendo una película."],
 ["Are you listening?","¿Estás escuchando?|¿Me estás escuchando?|¿Está (usted) escuchando?|¿Están escuchando?","escuchando","¿Estás escuchar?"]
],
[ // Direct object pronouns
 ["The car? I see it.","¿El [carro|coche|auto]? (Yo) lo veo.","lo","¿El carro? Veo lo."],
 ["The keys? I have them.","¿Las llaves? (Yo) las tengo.","las","¿Las llaves? Los tengo."],
 ["I call her every day.","(Yo) la llamo [todos los días|cada día].","la","Yo llamo la todos los días."],
 ["Do you know him?","¿(Tú) lo conoces?|¿Lo conoce (usted)?|¿Lo conocen?|¿Le conoces?","lo","¿Conoces lo?"],
 ["We help them.","([Nosotros|Nosotras]) [los|las|les] ayudamos.","los","Ayudamos los."]
],
[ // Preterite -ar
 ["I called my mother.|I called my mom.","(Yo) llamé a mi [madre|mamá].","llamé","Yo llamo a mi madre."],
 ["She arrived late.","{Ella} llegó tarde.","llegó","Ella llegé tarde."],
 ["We danced all night.","([Nosotros|Nosotras]) bailamos toda la noche.","bailamos","Nosotros bailaron toda la noche."],
 ["They traveled to Spain.","{[Ellos|Ellas]} viajaron a España.","viajaron","Ellos viajamos a España."],
 ["I looked for my keys.","(Yo) busqué [mis|las] llaves.","busqué","Yo buscé mis llaves."]
],
[ // Preterite -er / -ir
 ["I wrote an email.","(Yo) escribí un [correo|correo electrónico|email].","escribí","Yo escribé un correo."],
 ["She understood everything.","{Ella} entendió todo.|{Ella} lo entendió todo.|{Ella} comprendió todo.","entendió","Ella entendí todo."],
 ["We left at eight.","([Nosotros|Nosotras]) salimos a las ocho.","salimos","Nosotros salieron a las ocho."],
 ["Did they open the door?","¿Abrieron la puerta?|¿{[Ellos|Ellas]} abrieron la puerta?","abrieron","¿Abrimos la puerta?"],
 ["He ran in the park.","{Él} corrió [en|por] el parque.","corrió","Él corré en el parque."]
],
[ // Preterite irregulars
 ["I did my homework.","(Yo) hice [la|mi] tarea.|(Yo) hice los deberes.","hice","Yo hací la tarea."],
 ["She had a baby.","{Ella} tuvo un bebé.","tuvo","Ella tenió un bebé."],
 ["They went to the beach.","{[Ellos|Ellas]} fueron a la playa.","fueron","Ellos fuimos a la playa."],
 ["It was a good day.","Fue un buen día.","fue","Fui un buen día."],
 ["What did he do?","¿Qué hizo (él)?","hizo","¿Qué hació?"]
],
[ // Imperfect
 ["We lived in a small house.","([Nosotros|Nosotras]) vivíamos en una casa [pequeña|chica].","vivíamos","Vivíanos en una casa pequeña."],
 ["She was always happy.","{Ella} siempre estaba [contenta|feliz].|{Ella} estaba siempre [contenta|feliz].|{Ella} siempre era feliz.","estaba","Ella siempre estuba contenta."],
 ["I used to read a lot.","(Yo) leía mucho.|Antes (yo) leía mucho.","leía","Yo leaba mucho."],
 ["They used to play in the street.","{[Ellos|Ellas]} jugaban en la calle.","jugaban","Ellos juegaban en la calle."],
 ["It was cold.","Hacía frío.","hacía","Hacó frío."]
],
[ // Por vs para
 ["I am leaving for Mexico.","(Yo) salgo para México.|Me voy para México.|Me voy a México.","para","Salgo por México."],
 ["I paid ten dollars for the book.","(Yo) pagué diez dólares por el libro.","por","Pagué diez dólares para el libro."],
 ["This is for my mother.|This is for my mom.","Esto es para mi [madre|mamá].","para","~Esto es por mi madre."],
 ["We talked on the phone.","([Nosotros|Nosotras]) hablamos por teléfono.","por","Hablamos para teléfono."],
 ["She studies to be a doctor.","{Ella} estudia para ser [médica|doctora].","para","Ella estudia por ser médica."]
],
[ // Comparisons
 ["My car is older than yours.","Mi [carro|coche|auto] es más viejo que el [tuyo|suyo].","más","Mi carro es más viejo de el tuyo."],
 ["She is younger than me.|She is younger than I am.","{Ella} es menor que yo.|{Ella} es más joven que yo.","menor","Ella es más menor que yo."],
 ["This is worse.","Esto es peor.","peor","Esto es más peor."],
 ["He is as smart as his brother.","{Él} es tan inteligente como su hermano.","tan","Él es tanto inteligente como su hermano."],
 ["I have more books than you.","(Yo) tengo más libros que [tú|usted|ustedes].","que","Tengo más libros de tú."]
],
[ // Tener que / hay que
 ["I have to study tonight.","(Yo) tengo que estudiar esta noche.|Esta noche tengo que estudiar.","tengo","Tengo estudiar esta noche."],
 ["We have to clean the house.","([Nosotros|Nosotras]) tenemos que limpiar la casa.","limpiar","Tenemos que limpiamos la casa."],
 ["One has to wait.|You have to wait.","Hay que esperar.|Tienes que esperar.|Tiene que esperar.","hay"],
 ["They have to work on Saturday.","{[Ellos|Ellas]} tienen que trabajar el sábado.","tienen","Ellos tienen trabajar el sábado."],
 ["You should drink more water.","(Tú) [debes|deberías] [beber|tomar] más agua.|(Usted) [debe|debería] [beber|tomar] más agua.","debes","Debes bebes más agua."]
],
[ // Verbs like gustar
 ["I love dogs.","(A mí) me encantan los perros.","encantan","Me encanta los perros."],
 ["Her back hurts.","{A ella} le duele la espalda.","duele","Ella duele la espalda."],
 ["We are interested in history.","(A [nosotros|nosotras]) nos interesa la historia.","interesa","Nos interesan la historia."],
 ["Do you like movies?","¿Te gustan las películas?|¿Le gustan las películas?|¿Les gustan las películas?","gustan","¿Te gusta las películas?"],
 ["They love to dance.|They love dancing.","{A [ellos|ellas]} les encanta bailar.","les","A ellos le encanta bailar."]
],
[ // Tú commands
 ["Close the door.","Cierra la puerta.","cierra","Cierras la puerta."],
 ["Put it here.","Ponlo [aquí|acá].|Ponla [aquí|acá].","ponlo","Pone lo aquí."],
 ["Go to bed!","¡Ve a la cama!|¡Vete a la cama!|¡Acuéstate!","ve","¡Va a la cama!"],
 ["Be careful!","¡Ten cuidado!","ten","¡Tienes cuidado!"],
 ["Call me later.","Llámame [más tarde|luego|después].","llámame","Me llama más tarde."]
],
[ // Saber vs conocer
 ["I know how to cook.","(Yo) sé cocinar.","sé","Conozco cocinar."],
 ["Do you know my sister?","¿Conoces a mi hermana?|¿Conoce (usted) a mi hermana?|¿Conocen a mi hermana?","conoces","¿Sabes a mi hermana?"],
 ["We know the city well.","([Nosotros|Nosotras]) conocemos bien la ciudad.|([Nosotros|Nosotras]) conocemos la ciudad bien.","conocemos","Sabemos bien la ciudad."],
 ["She knows where I live.","{Ella} sabe dónde vivo.","sabe","Ella conoce dónde vivo."],
 ["They do not know the answer.","{[Ellos|Ellas]} no saben la respuesta.","saben","Ellos no conocen la respuesta."]
]
]);
