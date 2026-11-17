/* ===================== Tricky Pairs (mode 8) ===================== */
MODES.push({id:8, name:"Tricky Pairs", ico:"⚖️", color:"#C9B8FF", desc:"Words that look or sound alike: este/esto, si/sí, por qué/porque."});
// Items: [native, target, cloze word, wrong version (or null), options (optional; else the concept's o)]
const TRICKY = {es:{
A1:[
{t:"Este, esta, esto",o:["este","esta","estos","estas","esto"],
 b:"**este** + masculine noun, **esta** + feminine noun, **estos / estas** for plurals. **esto** never has a noun after it: it is for ideas, situations, or things you cannot name. Never *esto libro*.",
 w:[["este libro","this book"],["esta casa","this house"],["estos zapatos","these shoes"],["estas llaves","these keys"],["esto","this (thing / situation)"]],
 it:[
 ["This book is mine.","Este libro es mío.","este","Esto libro es mío."],
 ["This house is big.","Esta casa es grande.","esta","Este casa es grande."],
 ["What is this?","¿Qué es esto?","esto","¿Qué es este?"],
 ["These shoes are new.","Estos zapatos son nuevos.","estos","Estas zapatos son nuevos."],
 ["These keys are yours.","Estas llaves son tuyas.","estas","Estos llaves son tuyas."],
 ["This (situation) is very hard.","Esto es muy difícil.","esto",null],
 ["I like this song.","Me gusta esta canción.","esta","Me gusta este canción."],
 ["This week I work a lot.","Esta semana trabajo mucho.","esta","Este semana trabajo mucho."]
]},
{t:"Ese, esa, eso",o:["ese","esa","esos","esas","eso"],
 b:"Same pattern for things near **you** or a little away: **ese** (masculine), **esa** (feminine), **esos / esas** (plural), and **eso** with no noun: that idea, that thing.",
 w:[["ese carro","that car (near you)"],["esa mesa","that table"],["esos libros","those books"],["esas sillas","those chairs"],["eso","that (thing / idea)"]],
 it:[
 ["That car is yours.","Ese [carro|coche|auto] es tuyo.","ese","Esa carro es tuyo."],
 ["That is not true.","Eso no es [verdad|cierto].","eso","Ese no es verdad."],
 ["Is that chair free?","¿Esa silla está libre?|¿Está libre esa silla?","esa","¿Ese silla está libre?"],
 ["Those books are interesting.","Esos libros son interesantes.","esos","Esas libros son interesantes."],
 ["What is that?","¿Qué es eso?","eso","¿Qué es ese?"],
 ["I do not want those apples.","No quiero esas manzanas.","esas","No quiero esos manzanas."],
 ["That is why I am here.","Por eso estoy aquí.","eso","Por ese estoy aquí."]
]},
{t:"Aquel, aquella, aquello",o:["aquel","aquella","aquellos","aquellas","aquello"],
 b:"For things **far from both of us**: **aquel** (masculine), **aquella** (feminine), **aquellos / aquellas**, and **aquello** with no noun. It pairs with **allí / allá**.",
 w:[["aquel edificio","that building over there"],["aquella montaña","that mountain over there"],["aquellos árboles","those trees over there"],["aquello","that (far away / long ago)"]],
 it:[
 ["That building over there is a hospital.","Aquel edificio es un hospital.","aquel","Aquella edificio es un hospital."],
 ["Do you see that mountain over there?","¿Ves aquella montaña?","aquella","¿Ves aquel montaña?"],
 ["Those trees over there are very old.","Aquellos árboles son muy viejos.","aquellos","Aquellas árboles son muy viejos."],
 ["Those houses over there are expensive.","Aquellas casas son caras.","aquellas","Aquellos casas son caras."],
 ["What was that?","¿Qué fue aquello?","aquello","¿Qué fue aquel?"],
 ["In those days we lived in Texas.","En aquellos días vivíamos en Texas.|En aquella época vivíamos en Texas.","aquellos","En aquellas días vivíamos en Texas."]
]},
{t:"Aquí, ahí, allí",o:["aquí","ahí","allí"],
 b:"Place words answer *where*: **aquí** (here, near me), **ahí** (there, near you), **allí / allá** (over there, far away). They never go before a noun, so *aquí libro* is always wrong.",
 w:[["aquí","here (near me)"],["ahí","there (near you)"],["allí / allá","over there"]],
 it:[
 ["Come here.","Ven [aquí|acá].","aquí","Ven aquel."],
 ["Your phone is there, next to you.","Tu [teléfono|celular] está ahí, a tu lado.","ahí","Tu teléfono está ese, a tu lado."],
 ["My parents live over there.","Mis padres viven [allí|allá].","allí","Mis padres viven aquel."],
 ["Is there a bank around here?","¿Hay un banco por aquí?","aquí","¿Hay un banco por este?"],
 ["Put it there, please.","Ponlo ahí, por favor.","ahí","Ponlo ese, por favor."],
 ["I have been waiting here for an hour.","Llevo una hora esperando aquí.","aquí","Llevo una hora esperando esto."]
]},
{t:"Esta or está",o:["esta","está"],
 b:"**esta** (no accent) means *this* and goes before a feminine noun. **está** (accent) is the verb *estar*: he / she / it is. Say it aloud: está stresses the last syllable.",
 it:[
 ["This soup is cold.","Esta sopa está fría.","está","Esta sopa esta fría."],
 ["She is at home.","{Ella} está en casa.","está","Ella esta en casa."],
 ["This is my sister.","Esta es mi hermana.","esta","Está es mi hermana."],
 ["Where is this street?","¿Dónde está esta calle?","esta","¿Dónde está está calle?"],
 ["The door is open.","La puerta está abierta.","está","La puerta esta abierta."],
 ["This morning I am tired.","Esta mañana estoy cansad[o|a].","esta","Está mañana estoy cansado."]
]},
{t:"Muy or mucho",o:["muy","mucho","mucha","muchos","muchas"],
 b:"**muy** goes before adjectives and adverbs: muy grande, muy bien. **mucho** goes with nouns and verbs, and agrees with the noun: mucho dinero, mucha gente, trabajo mucho. Never *muy mucho*.",
 it:[
 ["The house is very big.","La casa es muy grande.","muy","La casa es mucho grande."],
 ["I work a lot.","(Yo) trabajo mucho.","mucho","Trabajo muy."],
 ["There are a lot of people.","Hay mucha gente.","mucha","Hay muy gente."],
 ["I am very well, thanks.","Estoy muy bien, gracias.","muy","Estoy mucho bien, gracias."],
 ["She has many friends.","{Ella} tiene muchos amigos.","muchos","Ella tiene muy amigos."],
 ["Thank you very much.","Muchas gracias.","muchas","Muy gracias."]
]},
{t:"Bueno, buen, bien",o:["bueno","buen","buena","bien","malo","mal","mala"],
 b:"**bien** is an adverb (well): canta bien, estoy bien. **bueno / buena** is an adjective (good). Before a masculine singular noun **bueno** shortens to **buen**: un buen día. Same with **malo → mal**.",
 it:[
 ["It is a good day.","Es un buen día.","buen","Es un bueno día."],
 ["She sings well.","{Ella} canta bien.","bien","Ella canta bueno."],
 ["The food is good.","La comida es buena.|La comida está buena.","buena","La comida es bien."],
 ["I feel bad.","Me siento mal.","mal","Me siento malo."],
 ["He is a good friend.","{Él} es un buen amigo.","buen","Él es un bien amigo."],
 ["The movie is very good.","La película es muy buena.","buena","La película es muy bien."],
 ["It is a bad idea.","Es una mala idea.","mala","Es una mal idea."]
]},
{t:"Hay or está",o:["hay","está","están"],
 b:"**hay** says something exists (there is / there are), usually with *un, una, unos* or no article. **está / están** says where a specific thing is, with *el, la, mi*: *Hay un banco aquí* vs *El banco está aquí*.",
 it:[
 ["There is a bank on this street.","Hay un banco en esta calle.","hay","Está un banco en esta calle."],
 ["The bank is on this street.","El banco está en esta calle.","está","El banco hay en esta calle."],
 ["Where are my keys?","¿Dónde están mis llaves?","están","¿Dónde hay mis llaves?"],
 ["Is there milk in the fridge?","¿Hay leche en el refrigerador?|¿Hay leche en la nevera?","hay","¿Está leche en el refrigerador?"],
 ["The keys are on the table.","Las llaves están [en|sobre] la mesa.","están","Las llaves hay en la mesa."],
 ["There are two cars outside.","Hay dos [carros|coches] [afuera|fuera].","hay","Están dos carros afuera."]
]},
{t:"Qué or cuál",o:["qué","cuál","cuáles"],
 b:"**qué** asks for a definition or goes right before a noun: *¿Qué es esto?*, *¿Qué color?* **cuál / cuáles** picks from options, and is used with *ser* for specific things: *¿Cuál es tu nombre?*",
 it:[
 ["What is your phone number?","¿Cuál es tu número de teléfono?|¿Cuál es su número de teléfono?","cuál","¿Qué es tu número de teléfono?"],
 ["What is this?","¿Qué es esto?","qué","¿Cuál es esto?"],
 ["Which one do you want?","¿Cuál quieres?|¿Cuál quiere (usted)?","cuál","¿Qué uno quieres?"],
 ["What color is your car?","¿De qué color es tu [carro|coche|auto]?","qué","¿De cuál color es tu carro?"],
 ["Which ones are your shoes?","¿Cuáles son tus zapatos?","cuáles","¿Qué son tus zapatos?"],
 ["What do you want to eat?","¿Qué quieres comer?|¿Qué quiere comer (usted)?","qué","¿Cuál quieres comer?"]
]},
{t:"El or él, tu or tú, mi or mí",
 b:"The accent changes the word. **el** = the, **él** = he. **tu** = your, **tú** = you. **mi** = my, **mí** = me (after a preposition: *para mí*).",
 w:[["el / él","the / he"],["tu / tú","your / you"],["mi / mí","my / me"]],
 it:[
 ["He is my friend.","Él es mi amigo.","él","El es mi amigo.",["el","él"]],
 ["The dog is big.","El perro es grande.","el","Él perro es grande.",["el","él"]],
 ["Your house is pretty.","Tu casa es [bonita|linda].","tu","Tú casa es bonita.",["tu","tú"]],
 ["You are my brother.","Tú eres mi hermano.|Eres mi hermano.","tú","Tu eres mi hermano.",["tu","tú"]],
 ["This gift is for me.","Este regalo es para mí.","mí","Este regalo es para mi.",["mi","mí"]],
 ["My car is red.","Mi [carro|coche|auto] es rojo.","mi","Mí carro es rojo.",["mi","mí"]],
 ["I am going with him.","Voy con él.","él","Voy con el.",["el","él"]]
]}
],
A2:[
{t:"Por qué or porque",o:["por qué","porque"],
 b:"**por qué** (two words, accent) asks *why*, in direct and indirect questions. **porque** (one word, no accent) answers: *because*.",
 it:[
 ["Why are you sad?","¿Por qué estás triste?|¿Por qué está (usted) triste?","por qué","¿Porque estás triste?"],
 ["Because I am tired.","Porque estoy cansad[o|a].","porque","Por qué estoy cansado."],
 ["I do not know why she left.","No sé por qué se fue.|No sé por qué ella se fue.","por qué","No sé porque se fue."],
 ["I study because I want to learn.","Estudio porque quiero aprender.","porque","Estudio por qué quiero aprender."],
 ["Why not?","¿Por qué no?","por qué","¿Porque no?"],
 ["I am here because you called me.","Estoy aquí porque me llamaste.","porque","Estoy aquí por qué me llamaste."]
]},
{t:"Si or sí",o:["si","sí"],
 b:"**si** (no accent) means *if*. **sí** (accent) means *yes*, and also *himself / herself* after a preposition.",
 it:[
 ["Yes, I want to go.","Sí, quiero ir.","sí","Si, quiero ir."],
 ["If it rains, I will stay home.","Si llueve, me [quedo|quedaré] en casa.","si","Sí llueve, me quedo en casa."],
 ["I do not know if he is coming.","No sé si {él} viene.","si","No sé sí él viene."],
 ["I think so.","Creo que sí.","sí","Creo que si."],
 ["If you want, we can eat.","Si quieres, podemos comer.","si","Sí quieres, podemos comer."],
 ["Yes, of course.","Sí, [claro|por supuesto].","sí","Si, claro."]
]},
{t:"Small words with a big accent",
 b:"**te** (you, as an object) vs **té** (tea). **se** (pronoun) vs **sé** (I know). **de** (of, from) vs **dé** (give, subjunctive). **mas** (but, rare) vs **más** (more).",
 w:[["te / té","you / tea"],["se / sé","himself, etc. / I know"],["de / dé","of / give"],["mas / más","but / more"]],
 it:[
 ["Do you want tea?","¿Quieres té?|¿Quiere (usted) té?","té","¿Quieres te?",["te","té"]],
 ["I love you.","Te [quiero|amo].","te","Té quiero.",["te","té"]],
 ["I do not know.","No sé.|No lo sé.","sé","No se.",["se","sé"]],
 ["He gets up early.","{Él} se levanta temprano.","se","Él sé levanta temprano.",["se","sé"]],
 ["I want more coffee.","Quiero más café.","más","Quiero mas café.",["mas","más"]],
 ["The house is from 1950.","La casa es de 1950.","de","La casa es dé 1950.",["de","dé"]]
]},
{t:"Pedir or preguntar",
 b:"Both can mean *ask*. **preguntar** = ask a question, for information. **pedir** = ask for something, request it.",
 it:[
 ["I am going to ask for the bill.","Voy a pedir la cuenta.","pedir","Voy a preguntar la cuenta.",["pedir","preguntar"]],
 ["She asked me my name.","{Ella} me preguntó mi nombre.|{Ella} me preguntó cómo me llamo.","preguntó","Ella me pidió mi nombre.",["pidió","preguntó"]],
 ["Can I ask you something?","¿Te puedo preguntar algo?|¿Puedo preguntarte algo?","preguntar",null,["pedir","preguntar"]],
 ["I asked for help.","(Yo) pedí ayuda.","pedí","Pregunté ayuda.",["pedí","pregunté"]],
 ["Ask the teacher.","Pregúntale al [profesor|maestro].|Pregúntale a la [profesora|maestra].","pregúntale","Pídele al profesor.",["pregúntale","pídele"]],
 ["We ordered two pizzas.","Pedimos dos pizzas.","pedimos","Preguntamos dos pizzas.",["pedimos","preguntamos"]]
]},
{t:"Llevar or traer, ir or venir",
 b:"Spanish looks at where the **speaker** is. **traer / venir** = toward here, where I am. **llevar / ir** = away from here, toward somewhere else.",
 it:[
 ["Bring me a glass of water.","Tráeme un vaso de agua.","tráeme","Llévame un vaso de agua.",["tráeme","llévame"]],
 ["I am going to take the kids to school.","Voy a llevar a los niños a la escuela.|Llevaré a los niños a la escuela.","llevar","Voy a traer a los niños a la escuela.",["llevar","traer"]],
 ["Come here!","¡Ven [aquí|acá]!","ven","¡Ve aquí!",["ven","ve"]],
 ["I am going to your house tomorrow.","Mañana voy a tu casa.|Voy a tu casa mañana.","voy","Mañana vengo a tu casa.",["voy","vengo"]],
 ["Are you coming to my party?","¿Vienes a mi fiesta?|¿Viene (usted) a mi fiesta?","vienes","¿Vas a mi fiesta?",["vienes","vas"]],
 ["Did you bring the keys?","¿Trajiste las llaves?|¿Trajo (usted) las llaves?","trajiste","¿Llevaste las llaves?",["trajiste","llevaste"]]
]},
{t:"Mi or mío, tu or tuyo",
 b:"**mi, tu, su** go **before** a noun: mi casa. **mío, tuyo, suyo** go **after** the noun or after *ser*, and agree: es mío, una amiga mía.",
 it:[
 ["This book is mine.","Este libro es mío.","mío","Este libro es mi.",["mi","mío"]],
 ["My car is old.","Mi [carro|coche|auto] es viejo.","mi","Mío carro es viejo.",["mi","mío"]],
 ["Is this pen yours?","¿Esta pluma es tuya?|¿Es tuya esta pluma?","tuya","¿Esta pluma es tu?",["tu","tuya","tuyo"]],
 ["A friend of mine lives here.","Una amiga mía vive aquí.|Un amigo mío vive aquí.","mía","Una amiga mi vive aquí.",["mi","mía","mío"]],
 ["Your house is beautiful.","Tu casa es [bonita|linda|hermosa].","tu","Tuya casa es bonita.",["tu","tuya"]],
 ["The keys are hers.","Las llaves son suyas.|Las llaves son de ella.","suyas","Las llaves son sus.",["sus","suyas"]]
]},
{t:"Buen, gran, primer: short forms",
 b:"Some adjectives lose their ending before a masculine singular noun: **bueno → buen**, **malo → mal**, **primero → primer**, **tercero → tercer**. **grande → gran** before any singular noun, and then it means *great*.",
 it:[
 ["It is the first day.","Es el primer día.","primer","Es el primero día.",["primer","primero"]],
 ["He is a great man.","{Él} es un gran hombre.","gran","Él es un grande hombre.",["gran","grande"]],
 ["The house is big.","La casa es grande.","grande","La casa es gran.",["gran","grande"]],
 ["I live on the third floor.","Vivo en el tercer piso.","tercer","Vivo en el tercero piso.",["tercer","tercero"]],
 ["She was the first.","{Ella} fue la primera.","primera","Ella fue la primer.",["primer","primera"]],
 ["What a bad day!","¡Qué mal día!","mal","¡Qué malo día!",["mal","malo"]]
]},
{t:"También or tampoco",o:["también","tampoco"],
 b:"**también** = also, too: agreeing with something positive. **tampoco** = neither, not either: agreeing with something negative. *A mí también* / *A mí tampoco*.",
 it:[
 ["I like coffee. Me too.","Me gusta el café. A mí también.","también","Me gusta el café. A mí tampoco."],
 ["I do not like coffee. Me neither.","No me gusta el café. A mí tampoco.","tampoco","No me gusta el café. A mí también."],
 ["She also speaks English.","{Ella} también habla inglés.|{Ella} habla inglés también.","también","Ella tampoco habla inglés."],
 ["I cannot go either.","Yo tampoco puedo ir.|Tampoco puedo ir.|No puedo ir tampoco.","tampoco","Yo también no puedo ir."],
 ["We are tired too.","([Nosotros|Nosotras]) también estamos cansad[os|as].|Estamos cansados también.","también","Nosotros tampoco estamos cansados."]
]}
],
B1:[
{t:"Algún, ningún, alguno, ninguno",
 b:"**alguno / ninguno** drop the -o before a masculine singular noun: **algún** libro, **ningún** problema. Alone, or before feminine nouns, they keep their ending: *¿Tienes alguno?*, *ninguna idea*.",
 it:[
 ["Do you have any questions?","¿Tienes alguna pregunta?|¿Tiene (usted) alguna pregunta?","alguna","¿Tienes algún pregunta?",["algún","alguna","alguno"]],
 ["There is no problem.","No hay ningún problema.","ningún","No hay ninguno problema.",["ningún","ninguno","ninguna"]],
 ["Some day I will travel to Spain.","Algún día viajaré a España.","algún","Alguno día viajaré a España.",["algún","alguno","alguna"]],
 ["I do not have any.","No tengo ninguno.|No tengo ninguna.","ninguno","No tengo ningún.",["ningún","ninguno"]],
 ["Is there any restaurant near here?","¿Hay algún restaurante cerca?|¿Hay algún restaurante por aquí?","algún","¿Hay alguno restaurante cerca?",["algún","alguno"]],
 ["I have no idea.","No tengo ninguna idea.|No tengo idea.|No tengo ni idea.","ninguna","No tengo ningún idea.",["ningún","ninguna"]]
]},
{t:"Lo or le",
 b:"**lo / la** replace the direct object, the person or thing that receives the action: *lo veo*. **le / les** replace the indirect object, *to whom*: *le doy el libro*. Verbs like *decir, dar, gustar* take **le**.",
 it:[
 ["I see him every day.","Lo veo todos los días.|Lo veo cada día.","lo",null,["lo","le"]],
 ["I give her the book.","Le doy el libro.","le","La doy el libro.",["la","le"]],
 ["I told them the truth.","Les dije la verdad.","les","Los dije la verdad.",["los","les"]],
 ["I bought a pizza and ate it.","Compré una pizza y la comí.","la","Compré una pizza y le comí.",["la","le"]],
 ["Call her tomorrow.","Llámala mañana.","llámala",null,["llámala","llámale"]],
 ["I like it. Does she like it?","Me gusta. ¿Le gusta a ella?|Me gusta. ¿A ella le gusta?","le","Me gusta. ¿La gusta a ella?",["la","le"]]
]},
{t:"Saber, poder, conocer",
 b:"**saber** + infinitive = know how to (a skill). **poder** = be able to right now (permission or circumstances). **conocer** = know a person or a place.",
 it:[
 ["I know how to swim, but I cannot swim today.","Sé nadar, pero hoy no puedo nadar.|Sé nadar, pero hoy no puedo.","puedo","Sé nadar, pero hoy no sé nadar.",["puedo","sé"]],
 ["Do you know how to drive?","¿Sabes [manejar|conducir]?","sabes","¿Conoces manejar?",["sabes","conoces"]],
 ["Can I come in?","¿Puedo [pasar|entrar]?","puedo","¿Sé pasar?",["puedo","sé"]],
 ["Do you know Mexico City?","¿Conoces la Ciudad de México?|¿Conoces Ciudad de México?","conoces","¿Sabes la Ciudad de México?",["sabes","conoces"]],
 ["She knows how to cook very well.","{Ella} sabe cocinar muy bien.","sabe","Ella conoce cocinar muy bien.",["sabe","conoce"]],
 ["We cannot come tomorrow.","No podemos venir mañana.|Mañana no podemos venir.","podemos","No sabemos venir mañana.",["podemos","sabemos"]]
]},
{t:"Volver or devolver, dejar or salir",
 b:"**volver** = come back (you return). **devolver** = give back (you return something). **salir** = leave a place. **dejar** = leave something behind, or let.",
 it:[
 ["I will be back at six.","Vuelvo a las seis.|Regreso a las seis.","vuelvo","Devuelvo a las seis.",["vuelvo","devuelvo"]],
 ["I have to return the book.","Tengo que devolver el libro.","devolver","Tengo que volver el libro.",["volver","devolver"]],
 ["I left my keys at home.","Dejé [las|mis] llaves en casa.","dejé","Salí las llaves en casa.",["dejé","salí"]],
 ["We left the house at eight.","Salimos de casa a las ocho.","salimos","Dejamos de casa a las ocho.",["salimos","dejamos"]],
 ["She left without saying goodbye.","{Ella} se fue sin despedirse.|{Ella} salió sin despedirse.","fue","Ella se dejó sin despedirse.",["fue","dejó"]],
 ["When are you coming back?","¿Cuándo vuelves?|¿Cuándo regresas?|¿Cuándo vuelve (usted)?","vuelves","¿Cuándo devuelves?",["vuelves","devuelves"]]
]},
{t:"Jugar or tocar, tomar or llevar",
 b:"**jugar** = play a game or sport. **tocar** = play an instrument (or touch). **tomar** = take, grab, drink, or take transport. **llevar** = carry, take somewhere, or wear.",
 it:[
 ["I play the guitar.","Toco la guitarra.","toco","Juego la guitarra.",["toco","juego"]],
 ["We play soccer on Saturdays.","Jugamos (al) fútbol los sábados.","jugamos","Tocamos fútbol los sábados.",["jugamos","tocamos"]],
 ["She is wearing a red dress.","{Ella} lleva un vestido rojo.","lleva","Ella toma un vestido rojo.",["lleva","toma"]],
 ["I take the bus to work.","Tomo el autobús para ir al trabajo.|Tomo el autobús al trabajo.","tomo","Llevo el autobús al trabajo.",["tomo","llevo"]],
 ["Do you play the piano?","¿Tocas el piano?|¿Toca (usted) el piano?","tocas","¿Juegas el piano?",["tocas","juegas"]],
 ["Take an umbrella.","Lleva un paraguas.|Llévate un paraguas.","lleva",null,["lleva","juega"]]
]},
{t:"Donde, adónde, dónde",
 b:"**dónde / adónde** (accent) ask questions, direct or indirect. **donde** (no accent) links two parts of a sentence: *la casa donde vivo*. **adónde** is for movement: *¿Adónde vas?*",
 it:[
 ["Where do you live?","¿Dónde vives?|¿Dónde vive (usted)?","dónde","¿Donde vives?",["donde","dónde"]],
 ["The city where I was born is small.","La ciudad donde nací es [pequeña|chica].","donde","La ciudad dónde nací es pequeña.",["donde","dónde"]],
 ["Where are you going?","¿Adónde vas?|¿A dónde vas?|¿Adónde va (usted)?","adónde","¿Adonde vas?",["adonde","adónde"]],
 ["I do not know where she is.","No sé dónde está.|No sé dónde está ella.","dónde","No sé donde está.",["donde","dónde"]],
 ["This is the restaurant where we met.","Este es el restaurante donde nos conocimos.","donde","Este es el restaurante dónde nos conocimos.",["donde","dónde"]],
 ["Tell me where it is.","Dime dónde está.","dónde","Dime donde está.",["donde","dónde"]]
]}
],
B2:[
{t:"Pero, sino, sino que",
 b:"**pero** = but, adding a contrast. **sino** = but rather: after a negative, it replaces what you just denied (*no es azul sino verde*). Before a conjugated verb use **sino que**.",
 it:[
 ["It is not blue but green.","No es azul sino verde.","sino","No es azul pero verde.",["pero","sino"]],
 ["It is expensive, but it is good.","Es caro, pero es bueno.","pero","Es caro, sino es bueno.",["pero","sino"]],
 ["He did not call; instead he wrote to me.","No llamó, sino que me escribió.","sino que","No llamó, sino me escribió.",["pero","sino","sino que"]],
 ["I want to go, but I cannot.","Quiero ir, pero no puedo.","pero","Quiero ir, sino no puedo.",["pero","sino"]],
 ["She is not my sister but my cousin.","No es mi hermana sino mi prima.","sino","No es mi hermana pero mi prima.",["pero","sino"]],
 ["Not only does she sing, she also dances.","No solo canta, sino que también baila.","sino que","No solo canta, pero también baila.",["pero","sino","sino que"]]
]},
{t:"Hay, ahí, ay",o:["hay","ahí","ay"],
 b:"Three words that sound almost the same. **hay** = there is / there are. **ahí** = there (a place). **¡ay!** = ouch / oh no.",
 it:[
 ["There is a problem.","Hay un problema.","hay","Ahí un problema."],
 ["Your keys are there.","Tus llaves están ahí.","ahí","Tus llaves están hay."],
 ["Ouch, that hurts!","¡Ay, eso duele!|¡Ay, me duele!","ay","¡Hay, eso duele!"],
 ["Is there coffee?","¿Hay café?","hay","¿Ahí café?"],
 ["Wait there.","Espera ahí.|Espere ahí.","ahí","Espera hay."],
 ["Oh no, I forgot!","¡Ay, se me olvidó!|¡Ay, lo olvidé!","ay","¡Ahí, se me olvidó!"]
]},
{t:"Haya, halla, allá",o:["haya","halla","allá"],
 b:"**haya** = subjunctive of *haber* (there may be / has). **halla** = finds, from *hallar*. **allá** = over there.",
 it:[
 ["I hope there is coffee.","Espero que haya café.|Ojalá haya café.","haya","Espero que allá café."],
 ["She lives over there.","{Ella} vive allá.","allá","Ella vive haya."],
 ["He never finds his keys.","Nunca halla sus llaves.|{Él} nunca halla sus llaves.","halla","Nunca haya sus llaves."],
 ["I hope she has arrived.","Espero que haya llegado.","haya","Espero que halla llegado."],
 ["The station is over there.","Allá está la estación.|La estación está allá.","allá","Haya está la estación."]
]},
{t:"Hecho or echo, a ver or haber",
 b:"**hecho** = done / made, or a fact (from *hacer*). **echo** = I throw (from *echar*). **a ver** = let's see. **haber** = the verb *haber*: to have (as a helper verb) or there to be.",
 it:[
 ["I have done my homework.","He hecho [la|mi] tarea.","hecho","He echo la tarea.",["hecho","echo"]],
 ["I miss you.","Te echo de menos.","echo","Te hecho de menos.",["hecho","echo"]],
 ["Let's see what happens.","A ver qué pasa.","a ver","Haber qué pasa.",["a ver","haber"]],
 ["There must be a solution.","Tiene que haber una solución.|Debe haber una solución.","haber","Tiene que a ver una solución.",["a ver","haber"]],
 ["In fact, I do not know.","De hecho, no lo sé.","hecho","De echo, no lo sé.",["hecho","echo"]],
 ["Let's see, show me.","A ver, [enséñamelo|muéstramelo].","a ver","Haber, enséñamelo.",["a ver","haber"]]
]},
{t:"Aún or aun, solo",
 b:"**aún** (accent) = still / yet: *aún no ha llegado*. **aun** (no accent) = even: *aun así*. **solo** no longer needs an accent in modern spelling, whether it means *only* or *alone*.",
 it:[
 ["She has not arrived yet.","{Ella} aún no ha llegado.|{Ella} todavía no ha llegado.","aún","Ella aun no ha llegado.",["aun","aún"]],
 ["Even so, I like it.","Aun así, me gusta.","aun","Aún así, me gusta.",["aun","aún"]],
 ["Are you still here?","¿Aún estás aquí?|¿Todavía estás aquí?","aún","¿Aun estás aquí?",["aun","aún"]],
 ["Even the kids understood.","Aun los niños entendieron.|Incluso los niños entendieron.|Hasta los niños entendieron.","aun","Aún los niños entendieron.",["aun","aún"]],
 ["I only want water.","Solo quiero agua.|Sólo quiero agua.","solo",null,["solo","sola"]]
]},
{t:"Ser or estar: words that change meaning",
 b:"Some adjectives change meaning with each verb. **ser listo** = clever, **estar listo** = ready. **ser aburrido** = boring, **estar aburrido** = bored. **ser rico** = rich, **estar rico** = tasty. **estar malo** = sick.",
 it:[
 ["He is very clever.","{Él} es muy listo.","es","Él está muy listo.",["es","está"]],
 ["I am ready.","(Yo) estoy list[o|a].","estoy","Soy listo.",["soy","estoy"]],
 ["The soup is tasty.","La sopa está [rica|deliciosa].","está","La sopa es rica.",["es","está"]],
 ["They are rich.","{[Ellos|Ellas]} son ric[os|as].","son","Ellos están ricos.",["son","están"]],
 ["The class is boring.","La clase es aburrida.","es","La clase está aburrida.",["es","está"]],
 ["My son is sick.","Mi hijo está [malo|enfermo].","está","Mi hijo es malo.",["es","está"]]
]},
{t:"Recordar or acordarse, realizar or darse cuenta",
 b:"**recordar** takes the thing directly: *recuerdo tu nombre*. **acordarse** needs **de**: *me acuerdo de tu nombre*. **realizar** means *to carry out*, not *to realize*; for that, use **darse cuenta (de)**.",
 it:[
 ["I remember your name.","Recuerdo tu nombre.|Me acuerdo de tu nombre.","recuerdo","Recuerdo de tu nombre.",["recuerdo","acuerdo"]],
 ["Do you remember me?","¿Te acuerdas de mí?|¿Me recuerdas?","acuerdas","¿Te acuerdas mí?",["acuerdas","recuerdas"]],
 ["I realized that it was late.","Me di cuenta de que era tarde.","cuenta","Realicé que era tarde.",["cuenta","realicé"]],
 ["They carried out a study.","Realizaron un estudio.|Hicieron un estudio.","realizaron",null,["realizaron","se dieron cuenta"]],
 ["She did not realize.","{Ella} no se dio cuenta.","dio","Ella no realizó.",["dio","realizó"]]
]}
]
}, en:{
A1:[
{t:"Here o there",o:["here","there"],
 b:"**here** = aquí (cerca de mí). **there** = ahí / allí. Con verbos de movimiento no se usa *to*: **come here**, **go there**.",
 w:[["here","aquí"],["there","ahí / allí"]],
 it:[
 ["Ven aquí.","Come here.","here","Come to here."],
 ["Mis llaves están ahí.","My keys are there.","there","My keys are here."],
 ["Vivo aquí.","I live here.","here","I live there."],
 ["¿Vas allí mañana?","Are you going there tomorrow?","there","Are you going to there tomorrow?"],
 ["Pon la caja aquí.","Put the box here.","here",null],
 ["¿Hay alguien ahí?","Is anyone there?|Is somebody there?|Is someone there?","there","Is anyone here?"]
]},
{t:"Its o it's",o:["its","it's"],
 b:"**it's** = it is (o it has). **its** = su (de una cosa o un animal), sin apóstrofo. Prueba: si puedes decir *it is*, lleva apóstrofo.",
 it:[
 ["Hace frío.","It's cold.","it's","Its cold."],
 ["El perro mueve su cola.","The dog wags its tail.|The dog is wagging its tail.","its","The dog wags it's tail."],
 ["Es mi turno.","It's my turn.","it's","Its my turn."],
 ["La empresa cambió su nombre.","The company changed its name.","its","The company changed it's name."],
 ["Son las tres.","It's three o'clock.|It's three.","it's","Its three o'clock."],
 ["El árbol perdió sus hojas.","The tree lost its leaves.","its","The tree lost it's leaves."]
]},
{t:"Your o you're",o:["your","you're"],
 b:"**you're** = you are. **your** = tu / su. Prueba: si puedes decir *you are*, escribe *you're*.",
 it:[
 ["Eres mi mejor amigo.","You're my best friend.","you're","Your my best friend."],
 ["¿Es tu carro?","Is that your car?|Is this your car?|Is it your car?","your","Is that you're car?"],
 ["Tienes razón.","You're right.","you're","Your right."],
 ["Me gusta tu camisa.","I like your shirt.","your","I like you're shirt."],
 ["Llegas tarde.","You're late.","you're","Your late."],
 ["¿Cómo está tu [madre|mamá]?","How is your [mother|mom]?","your","How is you're mother?"]
]},
{t:"Their, there, they're",o:["their","there","they're"],
 b:"**their** = su (de ellos). **there** = allí, o en *there is / there are*. **they're** = they are.",
 it:[
 ["La casa de ellos es grande.","Their house is [big|large].","their","There house is big."],
 ["Hay un problema.","There is a problem.","there","Their is a problem."],
 ["Están cansados.","They're tired.","they're","Their tired."],
 ["Pon tus zapatos allí.","Put your shoes there.","there","Put your shoes their."],
 ["Son mis amigos.","They're my friends.","they're","There my friends."],
 ["Ellos aman a su perro.","They love their dog.","their","They love they're dog."]
]},
{t:"To, too, two",o:["to","too","two"],
 b:"**to** = a / para (preposición, y delante de verbos: *to go*). **too** = también, o demasiado. **two** = dos.",
 it:[
 ["Voy a la tienda.","I am going to the [store|shop].","to","I am going too the store."],
 ["Yo también.","Me too.","too","Me to."],
 ["Tengo dos gatos.","I have two cats.","two","I have too cats."],
 ["Es demasiado caro.","It is too expensive.","too","It is to expensive."],
 ["Quiero comer.","I want to eat.","to","I want too eat."],
 ["Ella también habla inglés.","She speaks English too.|She also speaks English.","too","She speaks English to."]
]},
{t:"He, his; she, her",
 b:"**he / she** = él / ella (sujeto). **his** = su (de él), **her** = su (de ella) o *la* (objeto). El posesivo depende de **quién tiene** la cosa, no de la cosa.",
 it:[
 ["Su hermana (de él) es doctora.","His sister is a doctor.","his","Her sister is a doctor.",["his","her","he"]],
 ["Ella llama a su [madre|mamá].","She calls her [mother|mom].","her","She calls his mother.",["his","her","she"]],
 ["Él está en su carro.","He is in his car.","his","He is in he car.",["his","he","him"]],
 ["La conozco.","I know her.","her","I know she.",["she","her"]],
 ["Su perro (de ella) es pequeño.","Her dog is [small|little].","her","His dog is small.",["his","her"]],
 ["Él y ella son amigos.","He and she are friends.|She and he are friends.","he","Him and she are friends.",["he","him","his"]]
]}
],
A2:[
{t:"Then o than",o:["then","than"],
 b:"**than** compara: *bigger than* (más grande que). **then** = entonces / luego.",
 it:[
 ["Ella es más alta que yo.","She is taller than me.|She is taller than I am.","than","She is taller then me."],
 ["Primero comemos, luego salimos.","First we eat, then we go out.","then","First we eat, than we go out."],
 ["Es mejor que el otro.","It is better than the other one.|It is better than the other.","than","It is better then the other one."],
 ["¿Y entonces qué pasó?","And then what happened?|What happened then?","then","And than what happened?"],
 ["Tengo más dinero que tú.","I have more money than you.","than","I have more money then you."]
]},
{t:"Say o tell",
 b:"**tell** lleva persona: *tell me, tell her*. **say** no la lleva, o usa *to*: *say hello*, *say something to her*. Fijas: *tell the truth, tell a story, say yes*.",
 it:[
 ["Dime la verdad.","Tell me the truth.","tell","Say me the truth.",["say","tell"]],
 ["Ella dijo que sí.","She said yes.","said","She told yes.",["said","told"]],
 ["Me dijo que estaba cansado.","He told me that he was tired.|He told me he was tired.|He said that he was tired.|He said he was tired.","told","He said me that he was tired.",["said","told"]],
 ["¿Qué dijiste?","What did you say?","say","What did you tell?",["say","tell"]],
 ["Cuéntame una historia.","Tell me a story.","tell","Say me a story.",["say","tell"]],
 ["Saluda a tu mamá.","Say hello to your [mom|mother].|Say hi to your [mom|mother].","say","Tell hello to your mom.",["say","tell"]]
]},
{t:"Bring o take, come o go",
 b:"Como en español: **bring / come** = hacia donde estoy yo. **take / go** = hacia otro lugar.",
 it:[
 ["Trae tu libro a clase mañana.","Bring your book to class tomorrow.","bring","Take your book to class tomorrow.",["bring","take"]],
 ["Lleva al perro al parque.","Take the dog to the park.","take","Bring the dog to the park.",["bring","take"]],
 ["Ven a mi casa.","Come to my house.","come","Go to my house.",["come","go"]],
 ["Me voy a casa.","I am going home.","going",null,["going","coming"]],
 ["¿Puedes traerme agua?","Can you bring me some water?|Can you bring me water?","bring","Can you take me some water?",["bring","take"]],
 ["¡Ya voy!","I'm coming!","coming","I'm going!",["coming","going"]]
]},
{t:"Lend o borrow",
 b:"**lend** = prestar (das). **borrow** = pedir prestado (recibes). *Can you lend me...?* / *Can I borrow...?*",
 it:[
 ["¿Me prestas tu lápiz?","Can you lend me your pencil?|Can I borrow your pencil?","lend","Can you borrow me your pencil?",["lend","borrow"]],
 ["¿Puedo usar tu teléfono?","Can I borrow your phone?","borrow","Can I lend your phone?",["lend","borrow"]],
 ["Le presté dinero.","I lent him money.|I lent her money.","lent","I borrowed him money.",["lent","borrowed"]],
 ["Ella me pidió prestado mi carro.","She borrowed my car.","borrowed","She lent my car.",["lent","borrowed"]],
 ["Nunca presto mis libros.","I never lend my books.","lend","I never borrow my books.",["lend","borrow"]]
]},
{t:"Good o well",o:["good","well"],
 b:"**good** es adjetivo (bueno): *a good cook*. **well** es adverbio (bien): *she cooks well*.",
 it:[
 ["Ella cocina bien.","She cooks well.","well","She cooks good."],
 ["Es un buen libro.","It is a good book.","good","It is a well book."],
 ["Hablas inglés muy bien.","You speak English very well.","well","You speak English very good."],
 ["La comida está buena.","The food is good.","good","The food is well."],
 ["¡Bien hecho!","Well done!","well","Good done!"],
 ["Él es un buen estudiante.","He is a good student.","good","He is a well student."]
]},
{t:"Bored o boring",
 b:"**-ed** describe cómo **te sientes**: *I am bored* (estoy aburrido). **-ing** describe **lo que causa** el sentimiento: *the movie is boring*. Igual: interested / interesting, tired / tiring, excited / exciting.",
 it:[
 ["Estoy aburrid[o|a].","I am bored.","bored","I am boring.",["bored","boring"]],
 ["La película es aburrida.","The [movie|film] is boring.","boring","The movie is bored.",["bored","boring"]],
 ["Me interesa la historia.","I am interested in history.","interested","I am interesting in history.",["interested","interesting"]],
 ["Fue un día agotador.","It was a tiring day.|It was an exhausting day.","tiring","It was a tired day.",["tired","tiring"]],
 ["Los niños están emocionados.","The [children|kids] are excited.","excited","The children are exciting.",["excited","exciting"]],
 ["El libro es muy interesante.","The book is very interesting.","interesting","The book is very interested.",["interested","interesting"]]
]},
{t:"Fun o funny",o:["fun","funny"],
 b:"**fun** = divertido (algo que disfrutas). **funny** = gracioso (te hace reír).",
 it:[
 ["La fiesta fue divertida.","The party was fun.","fun","The party was funny."],
 ["Tu hermano es muy gracioso.","Your brother is very funny.","funny","Your brother is very fun."],
 ["¡Diviértete!","Have fun!","fun","Have funny!"],
 ["Es un chiste muy gracioso.","It is a very funny joke.","funny","It is a very fun joke."],
 ["Nadar es divertido.","Swimming is fun.","fun","Swimming is funny."]
]}
],
B1:[
{t:"Few, little; a few, a little",
 b:"**few / a few** con contables (books, friends). **little / a little** con incontables (time, money). Sin *a* suena negativo (casi nada); con *a* es positivo (algo).",
 it:[
 ["Tengo unos cuantos amigos aquí.","I have a few friends here.","few","I have a little friends here.",["few","little"]],
 ["Tengo un poco de tiempo.","I have a little time.","little","I have a few time.",["few","little"]],
 ["Vinieron muy pocas personas.","Very few people came.","few","Very little people came.",["few","little"]],
 ["Hay poca leche.","There is little milk.|There is not much milk.","little","There is few milk.",["few","little"]],
 ["Habla un poco de español.","He speaks a little Spanish.|She speaks a little Spanish.","little","He speaks a few Spanish.",["few","little"]],
 ["Espera unos minutos.","Wait a few minutes.","few","Wait a little minutes.",["few","little"]]
]},
{t:"Already, yet, still",o:["already","yet","still"],
 b:"**already** = ya (antes de lo esperado, en afirmativas). **yet** = todavía / ya, en negativas y preguntas, al final. **still** = todavía (sigue pasando).",
 it:[
 ["Ya comí.","I have already eaten.|I already ate.","already","I have yet eaten."],
 ["Todavía no ha llegado.","She has not arrived yet.|He has not arrived yet.","yet","She has not arrived already."],
 ["¿Todavía vives aquí?","Do you still live here?","still","Do you yet live here?"],
 ["¿Ya terminaste?","Have you finished yet?|Are you done yet?|Have you finished already?","yet","Have you finished still?"],
 ["Todavía está lloviendo.","It is still raining.","still","It is yet raining."],
 ["Ya lo sé.","I already know.|I know already.","already","I still know."]
]},
{t:"Hear o listen; see, look o watch",
 b:"**hear / see** pasan sin querer (oír, ver). **listen to / look at / watch** son con atención. **watch** es para algo que se mueve: tele, partidos, películas.",
 it:[
 ["¿Oyes ese ruido?","Do you hear that noise?|Can you hear that noise?","hear","Do you listen that noise?",["hear","listen"]],
 ["Escucha esta canción.","Listen to this song.","listen","Hear to this song.",["hear","listen"]],
 ["Mira esta foto.","Look at this photo.|Look at this picture.","look","Watch at this photo.",["look","watch","see"]],
 ["Vimos un partido de fútbol.","We watched a soccer game.|We watched a soccer match.|We watched a football match.","watched","We looked a soccer game.",["watched","looked","saw"]],
 ["No veo nada.","I cannot see anything.|I do not see anything.","see","I can't watch anything.",["see","watch","look"]],
 ["Ella está viendo la tele.","She is watching TV.","watching","She is seeing TV.",["watching","seeing","looking"]]
]},
{t:"Remember o remind",
 b:"**remember** = recordar (tú lo recuerdas). **remind** = recordarle algo a alguien, o hacerte pensar en algo: *remind me to call*, *you remind me of my brother*.",
 it:[
 ["Recuérdame llamarla.","Remind me to call her.","remind","Remember me to call her.",["remember","remind"]],
 ["¿Te acuerdas de mí?","Do you remember me?","remember","Do you remind me?",["remember","remind"]],
 ["Me recuerdas a mi hermano.","You remind me of my brother.","remind","You remember me of my brother.",["remember","remind"]],
 ["No recuerdo su nombre.","I do not remember his name.|I do not remember her name.|I cannot remember her name.|I cannot remember his name.","remember","I don't remind his name.",["remember","remind"]],
 ["Esta canción me recuerda el verano.","This song reminds me of summer.|This song reminds me of the summer.","reminds","This song remembers me of summer.",["remembers","reminds"]]
]},
{t:"Who, which, whose",o:["who","which","whose"],
 b:"**who** para personas, **which** para cosas, **whose** = cuyo / de quién.",
 it:[
 ["¿De quién es este libro?","Whose book is this?|Whose is this book?","whose","Who book is this?"],
 ["La mujer que vive aquí es doctora.","The woman who lives here is a doctor.","who","The woman which lives here is a doctor."],
 ["El carro, que es rojo, es mío.","The car, which is red, is mine.","which","The car, who is red, is mine."],
 ["El hombre cuyo perro ladra es mi vecino.","The man whose dog barks is my neighbor.|The man whose dog is barking is my neighbor.","whose","The man who dog barks is my neighbor."],
 ["¿Quién llamó?","Who called?","who","Whose called?"],
 ["¿Cuál prefieres?","Which one do you prefer?|Which do you prefer?","which","Who one do you prefer?"]
]},
{t:"Rise o raise; lie o lay",
 b:"**rise** = subir solo (el sol sale). **raise** = levantar algo (raise your hand). **lie** = acostarse, estar tumbado. **lay** = poner algo (lay the book on the table).",
 it:[
 ["El sol sale a las seis.","The sun rises at six.","rises","The sun raises at six.",["rises","raises"]],
 ["Levanta la mano.","Raise your hand.","raise","Rise your hand.",["rise","raise"]],
 ["Quiero acostarme un rato.","I want to lie down for a while.","lie","I want to lay down for a while.",["lie","lay"]],
 ["Pon el libro en la mesa.","Lay the book on the table.|Put the book on the table.","lay","Lie the book on the table.",["lie","lay"]],
 ["Los precios suben cada año.","Prices rise every year.|Prices go up every year.","rise","Prices raise every year.",["rise","raise"]],
 ["Me subieron el sueldo.","They raised my salary.|I got a raise.","raised","They rose my salary.",["rose","raised"]]
]}
],
B2:[
{t:"Affect o effect",
 b:"**affect** es verbo (afectar). **effect** es sustantivo (efecto). Truco: *Affect* = *Action*.",
 it:[
 ["El clima afecta mi estado de ánimo.","The weather affects my mood.","affects","The weather effects my mood.",["affects","effects"]],
 ["El medicamento tuvo un buen efecto.","The medicine had a good effect.|The medication had a good effect.","effect","The medicine had a good affect.",["affect","effect"]],
 ["¿Cómo te afectó?","How did it affect you?","affect","How did it effect you?",["affect","effect"]],
 ["Los efectos fueron graves.","The effects were serious.|The effects were severe.","effects","The affects were serious.",["affects","effects"]],
 ["Esto no nos afecta.","This does not affect us.","affect","This does not effect us.",["affect","effect"]]
]},
{t:"Fewer o less",o:["fewer","less"],
 b:"**fewer** con contables (fewer cars). **less** con incontables (less traffic). Con dinero, tiempo y distancias se usa *less*.",
 it:[
 ["Hay menos carros hoy.","There are fewer cars today.","fewer","There are less cars today."],
 ["Necesito menos azúcar.","I need less sugar.","less","I need fewer sugar."],
 ["Menos personas vinieron este año.","Fewer people came this year.","fewer","Less people came this year."],
 ["Gasta menos dinero.","Spend less money.","less","Spend fewer money."],
 ["Tengo menos problemas ahora.","I have fewer problems now.","fewer","I have less problems now."],
 ["Tardó menos de una hora.","It took less than an hour.","less","It took fewer than an hour."]
]},
{t:"Who o whom",o:["who","whom"],
 b:"**who** es sujeto (hace la acción). **whom** es objeto o va tras preposición: *to whom, with whom*. Truco: si la respuesta sería *him*, usa *whom*.",
 it:[
 ["¿Quién llamó?","Who called?","who","Whom called?"],
 ["¿Con quién hablaste?","With whom did you speak?|Who did you speak with?|Who did you talk to?","whom","With who did you speak?"],
 ["¿A quién se lo diste?","To whom did you give it?|Who did you give it to?","whom","To who did you give it?"],
 ["La persona que me ayudó es médica.","The person who helped me is a doctor.","who","The person whom helped me is a doctor."],
 ["El hombre con el que me casé.","The man whom I married.|The man I married.|The man who I married.","whom",null]
]},
{t:"In time o on time; at the end o in the end",
 b:"**on time** = puntual. **in time** = a tiempo para algo, antes de que sea tarde. **at the end (of)** = al final de algo concreto. **in the end** = al final, finalmente.",
 it:[
 ["El tren llegó puntual.","The train arrived on time.","on","The train arrived in time.",["in","on"]],
 ["Llegamos justo a tiempo para la cena.","We arrived just in time for dinner.","in","We arrived just on time for dinner.",["in","on"]],
 ["Al final de la película, todos lloraron.","At the end of the [movie|film], everyone cried.","at","In the end of the movie, everyone cried.",["at","in"]],
 ["Al final, decidimos quedarnos.","In the end, we decided to stay.","in","At the end, we decided to stay.",["at","in"]],
 ["Siempre llega puntual.","She always arrives on time.|He always arrives on time.","on","She always arrives in time.",["in","on"]]
]},
{t:"Between o among; since",
 b:"**between** = entre dos (o cosas separadas). **among** = entre un grupo. **since** también significa *ya que*, no solo *desde*.",
 it:[
 ["Estoy sentado entre Ana y Luis.","I am sitting between Ana and Luis.","between","I am sitting among Ana and Luis.",["between","among"]],
 ["Lo compartimos entre todos.","We shared it among everyone.|We shared it among all of us.","among","We shared it between everyone.",["between","among"]],
 ["Ya que estás aquí, ayúdame.","Since you are here, help me.","since","Because of you are here, help me.",["since","for"]],
 ["Vivo aquí desde 2019.","I have lived here since 2019.","since","I have lived here for 2019.",["since","for"]],
 ["Hay un parque entre la escuela y el banco.","There is a park between the school and the bank.","between","There is a park among the school and the bank.",["between","among"]]
]}
]
}};

// Demonstratives also join the Spanish A1 Practice syllabus.
ES_A1.push({t:"Este, ese, aquel: this and that",
 b:"Distance picks the word. **este** = this (near me, pairs with **aquí**), **ese** = that (near you, **ahí**), **aquel** = that over there (far from both, **allí**). Each has a feminine form (esta, esa, aquella), plurals, and a no-noun form for ideas: **esto, eso, aquello**.",
 w:[["este / esta","this"],["ese / esa","that (near you)"],["aquel / aquella","that (over there)"],["esto / eso / aquello","this / that (no noun)"],["aquí / ahí / allí","here / there / over there"]],
 it:[
 ["This book is mine.","Este libro es mío.","este","Esto libro es mío."],
 ["That car is yours.","Ese [carro|coche|auto] es tuyo.","ese","Esa carro es tuyo."],
 ["That building over there is a hospital.","Aquel edificio es un hospital.","aquel","Aquella edificio es un hospital."],
 ["What is this?","¿Qué es esto?","esto","¿Qué es este?"],
 ["These shoes are new.","Estos zapatos son nuevos.","estos","Estas zapatos son nuevos."],
 ["Those chairs are free.","Esas sillas están libres.","esas","Esos sillas están libres."],
 ["That is why I am here.","Por eso estoy aquí.","eso","Por ese estoy aquí."],
 ["My parents live over there.","Mis padres viven [allí|allá].","allí","Mis padres viven aquel."],
 ["Come here.","Ven [aquí|acá].","aquí","Ven este."],
 ["I like this song.","Me gusta esta canción.","esta","Me gusta este canción."]
 ]});
