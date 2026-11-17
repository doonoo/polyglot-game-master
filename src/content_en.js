/* ===================== Pre-built content: English for Spanish speakers ===================== */
const EN_A1 = [
{t:"Saludos y despedidas",
 b:"**Hello** y **hi** sirven a cualquier hora. **Good morning** se usa por la mañana, **good afternoon** por la tarde y **good evening** al llegar de noche. **Good night** solo se dice para despedirse o irse a dormir.",
 w:[["hello / hi","hola"],["good morning","buenos días"],["good afternoon","buenas tardes"],["see you later","hasta luego"],["how are you?","¿cómo estás?"],["thank you","gracias"]],
 it:[
 ["¡Buenos días!","Good morning!","morning","Good mornings!"],
 ["¡Buenas tardes!","Good afternoon!","afternoon","Good afternoons!"],
 ["¡Hasta luego!|¡Nos vemos luego!|¡Nos vemos!","See you later!","later","See you after!"],
 ["Hola, ¿cómo estás?|Hola, ¿cómo está (usted)?|Hola, ¿qué tal?|Hola, ¿cómo están?","[Hello|Hi], how are you?","how","Hello, how you are?"],
 ["Muchas gracias.","Thank you very much.|Thanks a lot.|Thank you so much.|Many thanks.|Thanks very much.","thank","Very thanks."]
 ]},
{t:"El verbo to be: am, is, are",
 b:"**To be** significa *ser* y *estar*. **I am**, **you are**, **he / she / it is**, **we are**, **they are**. En inglés el sujeto es obligatorio: no digas *Is tall*, di **He is tall**. Al hablar se contrae: **I'm**, **you're**, **she's**.",
 w:[["I am","yo soy / estoy"],["you are","tú eres / estás"],["he is","él es / está"],["she is","ella es / está"],["we are","somos / estamos"],["they are","son / están"]],
 sp:{tense:"to be (presente)",endings:"I am · you are · he / she / it is · we are · they are",irregular:"Contracciones: I'm, you're, he's, she's, it's, we're, they're"},
 it:[
 ["(Yo) soy estudiante.|(Yo) soy [un|una] estudiante.","I am a student.","am","I is a student."],
 ["{Ella} es doctora.|{Ella} es médica.","She is a doctor.","is","She are a doctor."],
 ["([Nosotros|Nosotras]) estamos en casa.","We are at home.|We are home.","are","We is at home."],
 ["{[Ellos|Ellas]} son de México.","They are from Mexico.","are","They is from Mexico."],
 ["{Él} está cansado.","He is tired.","is","Is tired."]
 ]},
{t:"Artículos: a, an, the",
 b:"**A** va antes de sonido de consonante (**a book**) y **an** antes de sonido de vocal (**an apple**). **The** sirve para todo: el, la, los, las. Las profesiones llevan artículo: **She is a teacher**.",
 w:[["a book","un libro"],["an apple","una manzana"],["the house","la casa"],["the dogs","los perros"],["a teacher","un maestro / una maestra"],["big","grande"]],
 it:[
 ["Es un libro.","It is a book.","a","It is an book."],
 ["Es una manzana.","It is an apple.","an","It is a apple."],
 ["La casa es grande.","The house is [big|large].","the","House is big."],
 ["Mi [padre|papá] es [maestro|profesor].","My [father|dad] is a teacher.","a","My father is teacher."],
 ["Los perros están aquí.","The dogs are here.","the","The dogs is here."]
 ]},
{t:"Plurales",
 b:"Casi todos los plurales añaden **-s**: books, dogs. Si la palabra termina en -s, -sh, -ch o -x se añade **-es**: buses, boxes. Algunos son irregulares: **man → men**, **woman → women**, **child → children**. Los adjetivos nunca van en plural.",
 w:[["books","libros"],["boxes","cajas"],["men","hombres"],["women","mujeres"],["children","niños"],["new","nuevo"]],
 it:[
 ["Los libros son nuevos.","The books are new.","books","The books are news."],
 ["Los niños están en casa.","The [children|kids] are at home.|The [children|kids] are home.","children","The childs are at home."],
 ["Las cajas son grandes.","The boxes are [big|large].","boxes","The boxs are big."],
 ["Las mujeres son doctoras.|Las mujeres son médicas.","The women are doctors.","women","The womans are doctors."],
 ["Los hombres están cansados.","The men are tired.","men","The mans are tired."]
 ]},
{t:"This, that, these, those",
 b:"**This** (este / esta) y **these** (estos / estas) son para lo que está cerca. **That** (ese / esa / aquel) y **those** (esos / esas) son para lo que está lejos. No cambian por género, solo por número.",
 w:[["this","este / esta / esto"],["that","ese / esa / eso"],["these","estos / estas"],["those","esos / esas"],["small","pequeño"],["friends","amigos"]],
 it:[
 ["Este libro es nuevo.","This book is new.","this","These book is new."],
 ["Esa casa es grande.|Aquella casa es grande.","That house is [big|large].","that","Those house is big."],
 ["Estos perros son pequeños.|Estos perros son chicos.","These dogs are [small|little].","these","This dogs are small."],
 ["Esos niños son mis amigos.|Aquellos niños son mis amigos.","Those [children|kids] are my friends.","those","That children are my friends."],
 ["¿Qué es esto?","What is this?","this","What is these?"]
 ]},
{t:"Have y has",
 b:"**Have** significa tener. Con **he, she, it** cambia a **has**: I have, you have, **she has**, we have, they have. La edad, el hambre y la sed no usan have: se dice **I am twenty**, **I am hungry**, **I am thirsty**.",
 w:[["I have","yo tengo"],["she has","ella tiene"],["we have","tenemos"],["I am hungry","tengo hambre"],["I am thirsty","tengo sed"],["a car","un carro"]],
 it:[
 ["(Yo) tengo un perro.","I have a dog.|I have got a dog.","have","I has a dog."],
 ["{Ella} tiene un [carro|coche|auto] nuevo.","She has a new car.|She has got a new car.","has","She have a new car."],
 ["(Yo) tengo hambre.","I am hungry.","am","I have hungry."],
 ["([Nosotros|Nosotras]) tenemos dos hijos.","We have two [children|kids|sons].","have","We has two children."],
 ["{Él} tiene veinte años.","He is twenty years old.|He is twenty.","is","He has twenty years."]
 ]},
{t:"Presente simple: la -s de he / she / it",
 b:"El presente simple usa el verbo base: I work, you work, we work, they work. Con **he, she, it** se añade **-s**: **she works**. Si termina en -o, -ch, -sh, -ss se añade **-es** (goes, watches) y consonante + y cambia a **-ies** (studies).",
 w:[["work","trabajar"],["live","vivir"],["study","estudiar"],["go","ir"],["speak","hablar"],["every day","todos los días"]],
 sp:{tense:"present simple",endings:"I / you / we / they work · he / she / it works",irregular:"goes, does, has, watches, studies"},
 it:[
 ["(Yo) trabajo aquí.","I work here.","work","I works here."],
 ["{Ella} vive en México.","She lives in Mexico.","lives","She live in Mexico."],
 ["Mi hermano estudia inglés.","My brother studies English.","studies","My brother studys English."],
 ["{Él} va al parque todos los días.|{Él} va al parque cada día.","He goes to the park every day.","goes","He go to the park every day."],
 ["([Nosotros|Nosotras]) hablamos español.","We speak Spanish.","speak","We speaks Spanish."]
 ]},
{t:"Negaciones: don't y doesn't",
 b:"Para negar en presente se usa **do not (don't)** + verbo base. Con **he, she, it** se usa **does not (doesn't)** y el verbo pierde la -s: **She doesn't work**. Con to be solo se añade **not**: **I am not tired**.",
 w:[["don't","no (I, you, we, they)"],["doesn't","no (he, she, it)"],["am not","no soy / no estoy"],["understand","entender"],["tired","cansado"],["here","aquí"]],
 it:[
 ["(Yo) no hablo inglés.","I do not speak English.","do","I no speak English."],
 ["{Ella} no trabaja aquí.","She does not work here.","does","She doesn't works here."],
 ["([Nosotros|Nosotras]) no vivimos aquí.","We do not live here.","do","We not live here."],
 ["{Él} no entiende.|{Él} no comprende.","He does not understand.","does","He don't understand."],
 ["(Yo) no estoy cansad[o|a].","I am not tired.","not","I don't am tired."]
 ]},
{t:"Preguntas con do y does",
 b:"Las preguntas de sí o no empiezan con **Do** o **Does** + sujeto + verbo base: **Do you work?** **Does she work?** Se responde corto: **Yes, I do** / **No, she doesn't**. Con to be se invierte: **Are you tired?**",
 w:[["Do you…?","¿tú…?"],["Does she…?","¿ella…?"],["Are you…?","¿eres / estás…?"],["like","gustar"],["hungry","con hambre"],["tomorrow","mañana"]],
 it:[
 ["¿(Tú) hablas inglés?|¿Habla (usted) inglés?|¿Hablan (ustedes) inglés?","Do you speak English?","do","Speak you English?"],
 ["¿{Ella} vive aquí?|¿Vive {ella} aquí?","Does she live here?","does","Does she lives here?"],
 ["¿(Tú) tienes hambre?|¿Tiene (usted) hambre?|¿Tienen hambre?","Are you hungry?","are","Do you are hungry?"],
 ["¿{Ellos} trabajan mañana?|¿Trabajan {ellos} mañana?|¿{Ellas} trabajan mañana?|¿Mañana trabajan?","Do they work tomorrow?","do","Does they work tomorrow?"],
 ["¿Te gusta el café?|¿Le gusta el café?|¿Les gusta el café?","Do you like coffee?","like","Do you likes coffee?"]
 ]},
{t:"Palabras para preguntar",
 b:"**What** (qué), **where** (dónde), **when** (cuándo), **who** (quién), **why** (por qué), **how** (cómo). Van al principio y después sigue el orden de pregunta: **Where do you live?** **Where is the bank?**",
 w:[["what","qué"],["where","dónde"],["when","cuándo"],["who","quién"],["why","por qué"],["how","cómo"]],
 it:[
 ["¿Dónde vives?|¿Dónde vive (usted)?|¿Dónde viven (ustedes)?","Where do you live?","where","Where you live?"],
 ["¿Cómo te llamas?|¿Cuál es tu nombre?|¿Cómo se llama (usted)?|¿Cuál es su nombre?","What is your name?","what","How is your name?"],
 ["¿Quién es ella?","Who is she?","who","Who she is?"],
 ["¿Cuándo trabajas?|¿Cuándo trabaja (usted)?|¿Cuándo trabajan (ustedes)?","When do you work?","when","When you work?"],
 ["¿Por qué estudias inglés?|¿Por qué estudia (usted) inglés?|¿Por qué estudian inglés?","Why do you study English?|Why are you studying English?","why","Why you study English?"]
 ]},
{t:"El adjetivo va antes del sustantivo",
 b:"En inglés el adjetivo va **antes** del sustantivo y nunca cambia: **a red car**, **two red cars**. No tiene género ni plural. Después de to be va solo: **The car is red**.",
 w:[["red","rojo"],["white","blanco"],["small","pequeño"],["beautiful","bonito / hermoso"],["new","nuevo"],["old","viejo"]],
 it:[
 ["(Yo) tengo un [carro|coche|auto] rojo.","I have a red car.","red","I have a car red."],
 ["{Ella} tiene una casa [bonita|hermosa|linda].","She has a [beautiful|pretty|nice|lovely] house.","beautiful","She has a house beautiful."],
 ["Son perros pequeños.|Son perros chicos.","They are [small|little] dogs.","small","They are smalls dogs."],
 ["Es un libro viejo.","It is an old book.","old","It is a book old."],
 ["Las casas blancas son nuevas.","The white houses are new.","white","The whites houses are new."]
 ]},
{t:"Like: decir lo que te gusta",
 b:"En inglés la persona es el sujeto: **I like coffee** (me gusta el café). Con he / she lleva -s: **She likes music**. Para actividades se usa **like + -ing**: **I like reading**. Al hablar en general no se pone *the*: **I like dogs**.",
 w:[["I like","me gusta(n)"],["she likes","le gusta(n)"],["I don't like","no me gusta(n)"],["music","la música"],["reading","leer"],["tea","té"]],
 it:[
 ["Me gusta el café.","I like coffee.","like","Me like coffee."],
 ["Me gustan los perros.","I like dogs.","like","I likes dogs."],
 ["{A ella} le gusta la música.","She likes music.","likes","She like music."],
 ["Me gusta leer.","I like reading.|I like to read.","reading","I like read."],
 ["No me gusta el té.","I do not like tea.","like","I no like tea."]
 ]},
{t:"Posesivos: my, your, his, her",
 b:"**My** (mi), **your** (tu / su), **his** (de él), **her** (de ella), **our** (nuestro), **their** (de ellos). No cambian con plural: **my friends**. Para decir de quién es algo se usa **'s**: **Ana's car**.",
 w:[["my","mi / mis"],["your","tu / tus / su"],["his","su (de él)"],["her","su (de ella)"],["our","nuestro / nuestra"],["their","su (de ellos)"]],
 it:[
 ["Mi [madre|mamá] es doctora.","My [mother|mom] is a doctor.","my","Me mother is a doctor."],
 ["El hermano de ella vive aquí.|Su hermano vive aquí.","Her brother lives here.","her","She brother lives here."],
 ["Nuestros amigos son de México.","Our friends are from Mexico.","our","Ours friends are from Mexico."],
 ["Es el [carro|coche|auto] de Ana.","It is Ana's car.","Ana's","It is the car of Ana."],
 ["El perro de él es grande.|Su perro es grande.","His dog is [big|large].","his","He dog is big."]
 ]},
{t:"There is y there are",
 b:"**Hay** se dice **there is** para una cosa y **there are** para varias: **There is a bank** / **There are two banks**. Pregunta: **Is there…?** / **Are there…?** Negación: **There isn't** / **There aren't**.",
 w:[["there is","hay (singular)"],["there are","hay (plural)"],["Is there…?","¿hay…?"],["a bank","un banco"],["a store","una tienda"],["near here","cerca de aquí"]],
 it:[
 ["Hay un banco aquí.|Aquí hay un banco.","There is a bank here.","is","There are a bank here."],
 ["Hay dos tiendas.","There are two [stores|shops].","are","There is two stores."],
 ["¿Hay un restaurante cerca de aquí?|¿Hay algún restaurante cerca de aquí?|¿Hay un restaurante cerca?","Is there a restaurant near here?|Is there a restaurant nearby?|Is there a restaurant close to here?|Is there a restaurant around here?","is","Have a restaurant near here?"],
 ["No hay agua.","There is no water.|There is not any water.","is","It has no water."],
 ["Hay muchos libros en la casa.|En la casa hay muchos libros.","There are many books in the house.|There are a lot of books in the house.|There are lots of books in the house.","are","There is many books in the house."]
 ]},
{t:"Can y can't",
 b:"**Can** expresa poder o saber hacer algo y va seguido del verbo base, sin *to*: **I can swim**. No cambia con he / she: **She can cook**. Negación: **can't** (cannot). Pregunta: **Can you help me?**",
 w:[["can","poder / saber"],["can't","no poder"],["swim","nadar"],["cook","cocinar"],["help","ayudar"],["drive","manejar / conducir"]],
 it:[
 ["(Yo) sé nadar.|(Yo) puedo nadar.","I can swim.|I know how to swim.","can","I can to swim."],
 ["{Ella} sabe cocinar.|{Ella} puede cocinar.","She can cook.|She knows how to cook.","can","She cans cook."],
 ["¿Puedes ayudarme?|¿Me puedes ayudar?|¿Puede ayudarme?|¿Me puede ayudar?|¿Me ayudas?","Can you help me?","help","Can you to help me?"],
 ["(Yo) no puedo [manejar|conducir].|(Yo) no sé [manejar|conducir].","I cannot drive.","drive","I don't can drive."],
 ["([Nosotros|Nosotras]) podemos ir mañana.","We can go tomorrow.","can","We can going tomorrow."]
 ]}
];

const EN_A2 = [
{t:"Presente continuo: am / is / are + -ing",
 b:"Para lo que pasa ahora mismo: **to be + verbo-ing**. **I am working**, **she is eating**, **they are sleeping**. Ojo con la ortografía: **make → making**, **run → running**. No se usa con verbos como know, like o want.",
 w:[["working","trabajando"],["eating","comiendo"],["reading","leyendo"],["sleeping","durmiendo"],["doing","haciendo"],["right now","ahora mismo"]],
 sp:{tense:"present continuous",endings:"am / is / are + verb-ing",irregular:"making, writing, running, sitting, swimming"},
 it:[
 ["(Yo) estoy comiendo ahora.|Ahora estoy comiendo.","I am eating now.|I am eating right now.","eating","I am eat now."],
 ["{Ella} está trabajando.","She is working.","working","She working."],
 ["([Nosotros|Nosotras]) estamos leyendo un libro.","We are reading a book.","reading","We are read a book."],
 ["Los niños están durmiendo.","The [children|kids] are sleeping.","sleeping","The children is sleeping."],
 ["¿Qué estás haciendo?|¿Qué haces?|¿Qué está haciendo (usted)?|¿Qué están haciendo?","What are you doing?","doing","What you are doing?"]
 ]},
{t:"Pasado simple: verbos regulares (-ed)",
 b:"El pasado regular añade **-ed** y es igual para todas las personas: I worked, she worked, they worked. Si termina en -e solo lleva **-d** (lived) y consonante + y cambia a **-ied** (studied).",
 w:[["worked","trabajé / trabajó"],["lived","viví / vivió"],["studied","estudié / estudió"],["talked","hablé / habló"],["yesterday","ayer"],["last night","anoche"]],
 sp:{tense:"past simple (regular)",endings:"verbo + -ed (todas las personas)",irregular:"lived, studied, stopped, played"},
 it:[
 ["(Yo) trabajé ayer.|Ayer trabajé.","I worked yesterday.|Yesterday I worked.","worked","I work yesterday."],
 ["{Ella} vivió en España.","She lived in Spain.","lived","She liveed in Spain."],
 ["([Nosotros|Nosotras]) hablamos anoche.|Anoche hablamos.","We talked last night.|We spoke last night.|Last night we talked.","talked","We talk last night."],
 ["{Ellos} estudiaron mucho.|{Ellas} estudiaron mucho.","They studied a lot.|They studied hard.|They studied very much.","studied","They studyed a lot."],
 ["Mi [madre|mamá] cocinó ayer.|Ayer cocinó mi [madre|mamá].|Ayer mi [madre|mamá] cocinó.","My [mother|mom] cooked yesterday.|Yesterday my [mother|mom] cooked.","cooked","My mother cookd yesterday."]
 ]},
{t:"Pasado simple: verbos irregulares",
 b:"Los verbos más comunes tienen pasado irregular y hay que memorizarlos: **go → went**, **have → had**, **eat → ate**, **see → saw**, **buy → bought**, **do → did**. La forma es igual para todas las personas.",
 w:[["went","fui / fue"],["had","tuve / tuvo"],["ate","comí / comió"],["saw","vi / vio"],["bought","compré / compró"],["did","hice / hizo"]],
 sp:{tense:"past simple (irregular)",endings:"una sola forma para todas las personas",irregular:"went · had · ate · saw · bought · did · made · came · took · said"},
 it:[
 ["(Yo) fui al parque.","I went to the park.","went","I goed to the park."],
 ["{Ella} compró un [carro|coche|auto].","She bought a car.","bought","She buyed a car."],
 ["([Nosotros|Nosotras]) comimos tacos ayer.|Ayer comimos tacos.","We ate tacos yesterday.|Yesterday we ate tacos.","ate","We eated tacos yesterday."],
 ["(Yo) vi una película anoche.|Anoche vi una película.","I saw a [movie|film] last night.|I watched a [movie|film] last night.|Last night I saw a [movie|film].","saw","I seed a movie last night."],
 ["{Él} tuvo un problema.","He had a problem.","had","He haved a problem."]
 ]},
{t:"Pasado: didn't y preguntas con did",
 b:"Para negar o preguntar en pasado se usa **did** y el verbo vuelve a su forma base: **I didn't go**, **Did you go?** Nunca *didn't went*. Con to be no se usa did: **I wasn't**, **Were you…?**",
 w:[["didn't","no (pasado)"],["Did you…?","¿tú… (pasado)?"],["go","ir"],["see","ver"],["call","llamar"],["do","hacer"]],
 it:[
 ["(Yo) no fui.","I did not go.","go","I didn't went."],
 ["¿Trabajaste ayer?|¿Trabajó (usted) ayer?|¿Trabajaron ayer?","Did you work yesterday?","did","Did you worked yesterday?"],
 ["{Ella} no me llamó.","She did not call me.","call","She no called me."],
 ["¿Qué hiciste ayer?|¿Qué hizo (usted) ayer?|¿Qué hicieron ayer?","What did you do yesterday?","did","What you did yesterday?"],
 ["([Nosotros|Nosotras]) no vimos la película.","We did not [see|watch] the [movie|film].","see","We didn't saw the movie."]
 ]},
{t:"Going to: planes",
 b:"Para planes e intenciones: **to be + going to + verbo base**. **I am going to study**, **she is going to travel**. Pregunta: **Are you going to come?** Al hablar suena *gonna*, pero no se escribe así en textos formales.",
 w:[["I am going to","voy a"],["she is going to","ella va a"],["we are going to","vamos a"],["travel","viajar"],["come","venir"],["next week","la próxima semana"]],
 it:[
 ["(Yo) voy a estudiar mañana.|Mañana voy a estudiar.","I am going to study tomorrow.|Tomorrow I am going to study.","going","I going to study tomorrow."],
 ["{Ella} va a viajar la próxima semana.|{Ella} va a viajar la semana que viene.|La próxima semana {ella} va a viajar.","She is going to travel next week.|Next week she is going to travel.","is","She going to travel next week."],
 ["([Nosotros|Nosotras]) vamos a comer.","We are going to eat.","to","We are going eat."],
 ["¿Vas a venir?|¿Va a venir (usted)?|¿Van a venir?","Are you going to come?","are","Do you going to come?"],
 ["{Ellos} van a comprar una casa.|{Ellas} van a comprar una casa.","They are going to buy a house.","buy","They are going to buying a house."]
 ]},
{t:"Will: futuro y decisiones",
 b:"**Will + verbo base** sirve para predicciones, promesas y decisiones del momento: **I will help you**, **It will rain**. Se contrae a **'ll** y la negación es **won't**. No cambia con he / she.",
 w:[["will","(futuro)"],["won't","no (futuro)"],["help","ayudar"],["rain","llover"],["call","llamar"],["soon","pronto"]],
 it:[
 ["(Yo) te ayudaré.|(Yo) te voy a ayudar.|(Yo) le ayudaré.|(Yo) los ayudaré.|(Yo) voy a ayudarte.","I will help you.","will","I will to help you."],
 ["Lloverá mañana.|Mañana lloverá.|Va a llover mañana.|Mañana va a llover.","It will rain tomorrow.|Tomorrow it will rain.|It is going to rain tomorrow.","will","It wills rain tomorrow."],
 ["{Ella} no vendrá.|{Ella} no va a venir.","She will not come.","not","She won't comes."],
 ["(Yo) te llamaré pronto.|(Yo) te llamo pronto.|(Yo) te voy a llamar pronto.","I will call you soon.","call","I will calling you soon."],
 ["¿Vendrás mañana?|¿Vas a venir mañana?|¿Vendrá (usted) mañana?|¿Vendrán mañana?","Will you come tomorrow?","will","Will you to come tomorrow?"]
 ]},
{t:"Comparativos",
 b:"Adjetivos cortos añaden **-er + than**: **taller than**, **bigger than**. Los largos usan **more … than**: **more expensive than**. Irregulares: **good → better**, **bad → worse**. Para igualdad: **as … as**.",
 w:[["taller than","más alto que"],["bigger than","más grande que"],["more interesting than","más interesante que"],["better","mejor"],["worse","peor"],["as … as","tan … como"]],
 it:[
 ["Mi hermano es más alto que yo.","My brother is taller than me.|My brother is taller than I am.|My brother is taller than I.","taller","My brother is more tall than me."],
 ["Este [carro|coche|auto] es mejor.","This car is better.","better","This car is more good."],
 ["Tu casa es más grande que la mía.|Su casa es más grande que la mía.","Your house is bigger than mine.|Your house is larger than mine.","bigger","Your house is biger than mine."],
 ["Este libro es más interesante que la película.","This book is more interesting than the [movie|film].","more","This book is interestinger than the movie."],
 ["{Ella} es tan alta como su [madre|mamá].","She is as tall as her [mother|mom].","as","She is so tall as her mother."]
 ]},
{t:"Superlativos",
 b:"Adjetivos cortos: **the + -est** (**the tallest**). Largos: **the most …** (**the most beautiful**). Irregulares: **the best**, **the worst**. Después va **in** para lugares o grupos: **the best in the world**.",
 w:[["the tallest","el más alto"],["the oldest","el mayor"],["the most beautiful","el más bonito"],["the best","el mejor"],["the worst","el peor"],["in the world","del mundo"]],
 it:[
 ["{Ella} es la más alta de la clase.","She is the tallest in the class.|She is the tallest in class.|She is the tallest one in the class.|She is the tallest in her class.","tallest","She is the most tall in the class."],
 ["Es el mejor restaurante de la ciudad.","It is the best restaurant in the city.|It is the best restaurant in town.","best","It is the most good restaurant in the city."],
 ["Es la ciudad más [bonita|hermosa|bella] del mundo.","It is the most beautiful city in the world.","most","It is the beautifulest city in the world."],
 ["Hoy es el peor día de la semana.","Today is the worst day of the week.","worst","Today is the baddest day of the week."],
 ["Mi hermano es el mayor.","My brother is the oldest.|My brother is the eldest.","oldest","My brother is the most old."]
 ]},
{t:"Some, any, much, many",
 b:"**Some** va en frases afirmativas y **any** en negativas y preguntas: **I have some money**, **I don't have any money**. **Many** es para cosas contables (many books) y **much** para incontables (much water). **A lot of** sirve para las dos.",
 w:[["some","algo de / unos"],["any","nada de / algún"],["much","mucho (incontable)"],["many","muchos (contable)"],["a lot of","mucho(s)"],["money","dinero"]],
 it:[
 ["(Yo) tengo algo de dinero.|(Yo) tengo un poco de dinero.","I have some money.|I have a little money.","some","I have any money."],
 ["(Yo) no tengo dinero.|(Yo) no tengo nada de dinero.","I do not have any money.|I have no money.|I do not have money.","any","I don't have some money."],
 ["¿Cuántos libros tienes?|¿Cuántos libros tiene (usted)?|¿Cuántos libros tienen?","How many books do you have?","many","How much books do you have?"],
 ["¿Cuánta agua hay?","How much water is there?","much","How many water is there?"],
 ["Hay muchas personas aquí.|Hay mucha gente aquí.|Aquí hay mucha gente.|Aquí hay muchas personas.","There are many people here.|There are a lot of people here.|There are lots of people here.","many","There are much people here."]
 ]},
{t:"Preposiciones de tiempo: in, on, at",
 b:"**At** para horas (at five o'clock, at night). **On** para días y fechas (on Monday, on May 5). **In** para meses, años y partes del día (in June, in 2020, in the morning).",
 w:[["at five o'clock","a las cinco"],["on Monday","el lunes"],["in June","en junio"],["in the morning","por la mañana"],["at night","por la noche"],["birthday","cumpleaños"]],
 it:[
 ["(Yo) trabajo el lunes.|El lunes trabajo.","I work on Monday.|On Monday I work.","on","I work in Monday."],
 ["La clase es a las cinco.","The class is at five.|The class is at five o'clock.|Class is at five.","at","The class is on five."],
 ["Mi cumpleaños es en junio.","My birthday is in June.","in","My birthday is on June."],
 ["(Yo) estudio por la mañana.|(Yo) estudio en la mañana.|Por la mañana estudio.|(Yo) estudio en las mañanas.","I study in the morning.|In the morning I study.|I study in the mornings.","in","I study at the morning."],
 ["{Ella} trabaja por la noche.|{Ella} trabaja de noche.|{Ella} trabaja en la noche.","She works at night.","at","She works in night."]
 ]},
{t:"Pronombres de objeto: me, him, her, them",
 b:"Después del verbo o de una preposición se usan **me, you, him, her, it, us, them**: **She knows me**, **I see him**, **Come with us**. A diferencia del español, siempre van **después** del verbo.",
 w:[["me","me / a mí"],["him","lo / a él"],["her","la / a ella"],["us","nos / a nosotros"],["them","los / las / a ellos"],["with","con"]],
 it:[
 ["{Ella} me conoce.","She knows me.","me","She me knows."],
 ["(Yo) lo veo todos los días.|(Yo) lo veo cada día.|(Yo) le veo todos los días.","I see him every day.","him","I see he every day."],
 ["(Yo) la llamé ayer.|Ayer la llamé.","I called her yesterday.|Yesterday I called her.","her","I called she yesterday."],
 ["Ven con [nosotros|nosotras].|Venga con nosotros.|Vengan con nosotros.","Come with us.","us","Come with we."],
 ["(Yo) [los|las] quiero mucho.|(Yo) [los|las] amo mucho.","I love them very much.|I love them a lot.|I love them so much.","them","I love they very much."]
 ]},
{t:"Have to, must y should",
 b:"**Have to** y **must** expresan obligación: **I have to work**, **You must stop**. **Should** da un consejo: **You should rest**. Después de must y should va el verbo base sin *to*. **Don't have to** significa que no es necesario.",
 w:[["have to","tener que"],["has to","tiene que"],["must","deber (obligación)"],["should","debería"],["rest","descansar"],["stop","parar"]],
 it:[
 ["(Yo) tengo que trabajar mañana.|Mañana tengo que trabajar.","I have to work tomorrow.|Tomorrow I have to work.|I must work tomorrow.","have","I have work tomorrow."],
 ["{Ella} tiene que estudiar más.","She has to study more.|She must study more.","has","She have to study more."],
 ["(Tú) deberías descansar.|(Usted) debería descansar.|Deberían descansar.","You should rest.","should","You should to rest."],
 ["No tienes que venir.|No tiene que venir.|No tienen que venir.","You do not have to come.","have","You don't must come."],
 ["Debes parar.|(Usted) debe parar.|Tienes que parar.|Debes detenerte.","You must stop.|You have to stop.","must","You must to stop."]
 ]},
{t:"Adverbios de frecuencia",
 b:"**Always**, **usually**, **often**, **sometimes**, **never** van **antes** del verbo principal (**I always eat**) pero **después** de to be (**She is always late**). Con never el verbo va en afirmativo: **I never drink coffee**.",
 w:[["always","siempre"],["usually","normalmente"],["often","a menudo"],["sometimes","a veces"],["never","nunca"],["late","tarde"]],
 it:[
 ["(Yo) siempre desayuno.","I always [eat|have] breakfast.","always","I eat always breakfast."],
 ["{Ella} siempre llega tarde.|{Ella} llega siempre tarde.","She is always late.|She always arrives late.|She always comes late.","always","She always is late."],
 ["(Yo) nunca tomo café.|(Yo) nunca bebo café.|No tomo café nunca.|No bebo café nunca.","I never drink coffee.","never","I don't never drink coffee."],
 ["A veces vamos al parque.|([Nosotros|Nosotras]) vamos al parque a veces.|([Nosotros|Nosotras]) a veces vamos al parque.","We sometimes go to the park.|Sometimes we go to the park.|We go to the park sometimes.","sometimes","We go sometimes to the park."],
 ["{Él} normalmente trabaja los lunes.|Normalmente {él} trabaja los lunes.|{Él} suele trabajar los lunes.|{Él} trabaja normalmente los lunes.","He usually works on Mondays.|Usually he works on Mondays.|He normally works on Mondays.","usually","He works usually on Mondays."]
 ]},
{t:"Was y were",
 b:"El pasado de to be: **I / he / she / it was**, **you / we / they were**. Sirve para *era*, *estaba*, *fui* y *estuve*. Negación: **wasn't / weren't**. Para nacer se dice **I was born**.",
 w:[["was","era / estaba / fue"],["were","eran / estaban / fueron"],["wasn't","no era / no estaba"],["I was born","nací"],["boring","aburrido"],["at home","en casa"]],
 sp:{tense:"to be (pasado)",endings:"I / he / she / it was · you / we / they were",irregular:"was born, wasn't, weren't"},
 it:[
 ["(Yo) estaba en casa.|(Yo) estuve en casa.","I was at home.|I was home.","was","I were at home."],
 ["([Nosotros|Nosotras]) estábamos cansad[os|as].|([Nosotros|Nosotras]) estuvimos cansad[os|as].","We were tired.","were","We was tired."],
 ["(Yo) nací en México.","I was born in Mexico.","was","I born in Mexico."],
 ["La película era aburrida.|La película fue aburrida.|La película estuvo aburrida.","The [movie|film] was boring.","was","The movie were boring."],
 ["¿Dónde estabas?|¿Dónde estaba (usted)?|¿Dónde estuviste?|¿Dónde estaban?","Where were you?","were","Where was you?"]
 ]},
{t:"Falsos amigos",
 b:"Algunas palabras se parecen al español pero significan otra cosa. **Actually** = en realidad (no *actualmente*, que es **currently**). **Embarrassed** = avergonzado (embarazada es **pregnant**). **Library** = biblioteca (librería es **bookstore**).",
 w:[["actually","en realidad"],["currently","actualmente"],["embarrassed","avergonzado"],["pregnant","embarazada"],["library","biblioteca"],["bookstore","librería"]],
 it:[
 ["{Ella} está embarazada.","She is pregnant.","pregnant","~She is embarrassed."],
 ["(Yo) estoy avergonzad[o|a].|Me da vergüenza.|(Yo) tengo vergüenza.|Me da pena.","I am embarrassed.|I am ashamed.","embarrassed","~I am pregnant."],
 ["En realidad, no lo sé.|En realidad no sé.|La verdad, no lo sé.|De hecho, no lo sé.","Actually, I do not know.","actually","~Currently, I do not know."],
 ["(Yo) voy a la biblioteca.","I am going to the library.|I go to the library.","library","~I am going to the bookstore."],
 ["Actualmente vivo en México.|(Yo) actualmente vivo en México.|Vivo actualmente en México.","I currently live in Mexico.|Currently, I live in Mexico.|I live in Mexico currently.|I am currently living in Mexico.","currently","~Actually, I live in Mexico."]
 ]}
];

const COURSE = {es:{A1:ES_A1, A2:ES_A2}, en:{A1:EN_A1, A2:EN_A2}};
