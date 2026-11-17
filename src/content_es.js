/* ===================== Pre-built content: Spanish for English speakers =====================
   Sentence items: [native, target, cloze word, wrong version]
   Pattern syntax: a|b alternatives · [a|b] inline choice · (x) optional, left out of the shown answer · {x} optional, kept in the shown answer
   A wrong version starting with ~ only works when the meaning is shown (skipped in Survivor). */
const ES_A1 = [
{t:"Greetings and goodbyes",
 b:"**Hola** works at any hour. Use **buenos días** in the morning, **buenas tardes** in the afternoon and **buenas noches** at night. Written Spanish opens questions and exclamations with ¿ and ¡.",
 w:[["hola","hello"],["buenos días","good morning"],["buenas tardes","good afternoon"],["buenas noches","good night"],["hasta luego","see you later"],["gracias","thank you"]],
 it:[
 ["Good morning!","¡Buenos días!","días","¡Bueno días!"],
 ["Good afternoon!","¡Buenas tardes!","tardes","¡Buenos tardes!"],
 ["Good night!|Good evening!","¡Buenas noches!","noches","¡Buenos noches!"],
 ["See you later!","¡Hasta luego!","luego"],
 ["[Hello|Hi], [thank you|thanks].","Hola, gracias.","gracias"],
 ["[Hello|Hi], good afternoon.","Hola, buenas tardes.","buenas"]
 ]},
{t:"Ser: saying who you are",
 b:"**Ser** describes identity: who or what someone is, their job, origin and traits. Forms: yo **soy**, tú **eres**, él/ella **es**, nosotros **somos**, ellos **son**. Spanish usually drops the subject pronoun because the verb already shows who.",
 w:[["soy","I am"],["eres","you are"],["es","he / she / it is"],["somos","we are"],["son","they are"],["de","from / of"]],
 sp:{tense:"ser (present)",endings:"soy · eres · es · somos · sois · son",irregular:"Fully irregular: memorize it."},
 it:[
 ["I am a student.","(Yo) soy estudiante.|(Yo) soy [un|una] estudiante.","soy","Yo es estudiante."],
 ["She is a doctor.","{Ella} es [doctora|médica|médico].","es","Ella soy doctora."],
 ["We are friends.","(Nosotros) somos amigos.|(Nosotras) somos amigas.","somos","Nosotros son amigos."],
 ["They are from Mexico.","{[Ellos|Ellas]} son de México.","son","Ellos somos de México."],
 ["You are my friend.","(Tú) eres mi [amigo|amiga].|(Usted) es mi [amigo|amiga].","eres","Tú es mi amigo."]
 ]},
{t:"Gender and articles: el, la, un, una",
 b:"Every Spanish noun is masculine or feminine. Most nouns ending in **-o** take **el / un**; most ending in **-a** take **la / una**. Learn each noun with its article, because rebels like **el día** and **la mano** exist.",
 w:[["el libro","the book"],["la casa","the house"],["un perro","a dog"],["una mesa","a table"],["el día","the day"],["la mano","the hand"]],
 it:[
 ["It is a book.","Es un libro.","un","Es una libro."],
 ["It is a table.","Es una mesa.","una","Es un mesa."],
 ["The dog is my friend.","El perro es mi amigo.","el","La perro es mi amigo."],
 ["It is the house.","Es la casa.","la","Es el casa."],
 ["It is the hand.","Es la mano.","la","Es el mano."]
 ]},
{t:"Plurals: -s and -es",
 b:"Add **-s** to nouns ending in a vowel and **-es** to nouns ending in a consonant. Articles and adjectives go plural too: **el → los**, **la → las**, **nuevo → nuevos**.",
 w:[["los libros","the books"],["las casas","the houses"],["las ciudades","the cities"],["los profesores","the teachers"],["nuevos","new (plural)"],["grandes","big (plural)"]],
 it:[
 ["The books are new.","Los libros son nuevos.","libros","Los libro son nuevos."],
 ["The houses are big.","Las casas son grandes.","casas","La casas son grandes."],
 ["The dogs are big.","Los perros son grandes.","los","El perros son grandes."],
 ["They are the teachers.","{[Ellos|Ellas]} son [los profesores|las profesoras|los maestros|las maestras].","son","Ellos son los profesor."],
 ["The cities are big.","Las ciudades son grandes.","ciudades","Las ciudads son grandes."]
 ]},
{t:"Estar: location and mood",
 b:"**Estar** is for where something is and how someone feels right now. Forms: **estoy**, **estás**, **está**, **estamos**, **están**. Location and temporary states use estar, not ser.",
 w:[["estoy","I am"],["está","he / she / it is"],["estamos","we are"],["están","they are"],["aquí","here"],["cansado","tired"]],
 sp:{tense:"estar (present)",endings:"estoy · estás · está · estamos · estáis · están",irregular:"Irregular yo form, and accents on estás, está, están."},
 it:[
 ["I am at home.","(Yo) estoy en casa.","estoy","Yo soy en casa."],
 ["How are you?","¿Cómo estás (tú)?|¿Cómo está (usted)?|¿Cómo están (ustedes)?","estás"],
 ["She is tired.","{Ella} está cansada.","está","Ella es cansada."],
 ["We are here.","([Nosotros|Nosotras]) estamos aquí.|Aquí estamos.","estamos","Nosotros somos aquí."],
 ["The book is on the table.","El libro está [en|sobre] la mesa.","está","El libro es en la mesa."]
 ]},
{t:"Tener: having, age and hunger",
 b:"**Tener** means to have: **tengo**, **tienes**, **tiene**, **tenemos**, **tienen**. Spanish also *has* age, hunger and thirst: **tengo veinte años**, **tengo hambre**, **tengo sed**.",
 w:[["tengo","I have"],["tienes","you have"],["tiene","he / she has"],["tenemos","we have"],["tengo hambre","I am hungry"],["tengo sed","I am thirsty"]],
 sp:{tense:"tener (present)",endings:"tengo · tienes · tiene · tenemos · tenéis · tienen",irregular:"yo tengo; e → ie in tienes, tiene, tienen."},
 it:[
 ["I have a dog.","(Yo) tengo un perro.","tengo","Yo tiene un perro."],
 ["I am hungry.","(Yo) tengo hambre.","tengo","Estoy hambre."],
 ["She is twenty years old.|She is twenty.","{Ella} tiene veinte años.","tiene","Ella es veinte años."],
 ["We have a big house.","([Nosotros|Nosotras]) tenemos una casa grande.","tenemos","Nosotros tienen una casa grande."],
 ["Are you thirsty?","¿(Tú) tienes sed?|¿Tienes sed tú?|¿(Usted) tiene sed?|¿Tiene sed usted?|¿Tienen sed?","tienes","¿Estás sed?"]
 ]},
{t:"Regular -ar verbs",
 b:"Drop **-ar** and add **-o, -as, -a, -amos, -an**. Hablar: **hablo**, **hablas**, **habla**, **hablamos**, **hablan**. The same endings work for trabajar, estudiar, comprar and hundreds more.",
 w:[["hablar","to speak"],["trabajar","to work"],["estudiar","to study"],["comprar","to buy"],["hablo","I speak"],["hablamos","we speak"]],
 sp:{tense:"present, -ar verbs",endings:"-o · -as · -a · -amos · -áis · -an",irregular:""},
 it:[
 ["I speak Spanish.","(Yo) hablo español.","hablo","Yo habla español."],
 ["She works here.","{Ella} trabaja aquí.","trabaja","Ella trabajo aquí."],
 ["We study Spanish.|We are studying Spanish.","([Nosotros|Nosotras]) estudiamos español.","estudiamos","Nosotros estudian español."],
 ["They buy a house.|They are buying a house.","{[Ellos|Ellas]} compran una casa.","compran","Ellos compramos una casa."],
 ["Do you speak Spanish?","¿(Tú) hablas español?|¿Hablas español tú?|¿(Usted) habla español?|¿Habla (usted) español?|¿(Ustedes) hablan español?","hablas","¿Tú hablo español?"]
 ]},
{t:"Regular -er and -ir verbs",
 b:"-er verbs take **-o, -es, -e, -emos, -en**: como, comes, come, comemos, comen. -ir verbs are identical except for **-imos**: vivimos. Comer, beber, leer, vivir and escribir all follow the pattern.",
 w:[["comer","to eat"],["beber","to drink"],["leer","to read"],["vivir","to live"],["escribir","to write"],["agua","water"]],
 sp:{tense:"present, -er / -ir verbs",endings:"-o · -es · -e · -emos / -imos · -en",irregular:""},
 it:[
 ["I live in Mexico.","(Yo) vivo en México.","vivo","Yo vive en México."],
 ["She reads a book.|She is reading a book.","{Ella} lee un libro.","lee","Ella leo un libro."],
 ["We eat at home.","([Nosotros|Nosotras]) comemos en casa.","comemos","Nosotros comen en casa."],
 ["They drink water.","{[Ellos|Ellas]} beben agua.|{[Ellos|Ellas]} toman agua.","beben","Ellos bebe agua."],
 ["We live here.","([Nosotros|Nosotras]) vivimos aquí.|Aquí vivimos.","vivimos","Nosotros vivemos aquí."]
 ]},
{t:"Saying no and asking yes/no questions",
 b:"Put **no** right before the verb to make a sentence negative: **No hablo inglés**. For a yes/no question, keep the same words and wrap them in **¿ ?**: **¿Hablas inglés?** No helper word like *do* is needed.",
 w:[["no","no / not"],["sí","yes"],["inglés","English"],["también","also"],["pero","but"],["¿verdad?","right?"]],
 it:[
 ["I do not speak English.","(Yo) no hablo inglés.","no","Yo hablo no inglés."],
 ["She does not work here.","{Ella} no trabaja aquí.","no","Ella no trabajo aquí."],
 ["We are not tired.","(Nosotros) no estamos cansados.|(Nosotras) no estamos cansadas.","no","No somos cansados."],
 ["Do you live here?","¿(Tú) vives aquí?|¿Vives aquí tú?|¿(Usted) vive aquí?|¿Vive (usted) aquí?|¿(Ustedes) viven aquí?","vives","¿Tú vivo aquí?"],
 ["No, I do not have a dog.","No, (yo) no tengo (un) perro.","tengo","No, yo tengo no perro."]
 ]},
{t:"Question words",
 b:"Question words always carry an accent: **qué** (what), **quién** (who), **dónde** (where), **cuándo** (when), **cómo** (how), **por qué** (why). The verb usually comes right after them.",
 w:[["qué","what"],["quién","who"],["dónde","where"],["cuándo","when"],["por qué","why"],["¿cómo te llamas?","what is your name?"]],
 it:[
 ["Where do you live?","¿Dónde vives (tú)?|¿Dónde vive (usted)?|¿Dónde viven (ustedes)?","dónde"],
 ["What is your name?|What are you called?","¿Cómo te llamas?|¿Cómo se llama (usted)?|¿Cuál es tu nombre?|¿Cuál es su nombre?","cómo"],
 ["Who is she?","¿Quién es ella?|¿Quién es?","quién"],
 ["When do you work?","¿Cuándo trabajas (tú)?|¿Cuándo trabaja (usted)?|¿Cuándo trabajan (ustedes)?","cuándo"],
 ["Why do you study Spanish?|Why are you studying Spanish?","¿Por qué estudias español?|¿Por qué estudia (usted) español?|¿Por qué estudian (ustedes) español?","por qué"]
 ]},
{t:"Adjectives agree and follow the noun",
 b:"Adjectives usually come **after** the noun and match its gender and number: **el carro rojo**, **la casa roja**, **los carros rojos**. Adjectives ending in -e or a consonant only change for plural: **grande → grandes**.",
 w:[["rojo","red"],["blanco","white"],["pequeño","small"],["bonito","pretty"],["nuevo","new"],["el carro","the car"]],
 it:[
 ["I have a red car.","(Yo) tengo un [carro|coche|auto] rojo.","rojo","Tengo un rojo carro."],
 ["The house is white.","La casa es blanca.","blanca","La casa es blanco."],
 ["The dogs are small.|The dogs are little.","Los perros son pequeños.|Los perros son chicos.","pequeños","Los perros son pequeño."],
 ["She has a pretty house.|She has a beautiful house.|She has a nice house.","{Ella} tiene una casa [bonita|linda|hermosa].|{Ella} tiene una [bonita|linda|hermosa] casa.","bonita","Ella tiene una casa bonito."],
 ["The books are new.","Los libros son nuevos.","nuevos","Los libros son nuevo."]
 ]},
{t:"Gustar: saying what you like",
 b:"Spanish says *it pleases me*: **me gusta** + one thing or a verb, **me gustan** + several things. Swap the pronoun for other people: **te gusta** (you), **le gusta** (he/she), **nos gusta** (we).",
 w:[["me gusta","I like (one thing)"],["me gustan","I like (several things)"],["te gusta","you like"],["le gusta","he / she likes"],["la música","music"],["el café","coffee"]],
 it:[
 ["I like coffee.","(A mí) me gusta el café.","gusta","Yo gusto el café."],
 ["I like dogs.","(A mí) me gustan los perros.","gustan","Me gusta los perros."],
 ["Do you like music?","¿(A ti) te gusta la música?|¿Le gusta la música (a usted)?|¿Les gusta la música?","te","¿Tú gustas la música?"],
 ["She likes to read.|She likes reading.","{A ella} le gusta leer.","le","Ella gusta leer."],
 ["I do not like the house.","(A mí) no me gusta la casa.","me","No gusto la casa."]
 ]},
{t:"Ir: going places and making plans",
 b:"**Ir** (to go) is irregular: **voy**, **vas**, **va**, **vamos**, **van**. Use **ir a** + place for where you go, and **ir a** + infinitive for plans: **Voy a comer** = I am going to eat. Remember **a + el = al**.",
 w:[["voy","I go"],["vas","you go"],["va","he / she goes"],["vamos","we go"],["al","to the (a + el)"],["el parque","the park"]],
 sp:{tense:"ir (present)",endings:"voy · vas · va · vamos · vais · van",irregular:"Fully irregular. ir a + infinitive = going to."},
 it:[
 ["I am going to the park.|I go to the park.","(Yo) voy al parque.","voy","Yo va al parque."],
 ["We are going to eat.","([Nosotros|Nosotras]) vamos a comer.","vamos","Nosotros van a comer."],
 ["She is going to study.","{Ella} va a estudiar.","va","Ella voy a estudiar."],
 ["Where are you going?","¿[Adónde|A dónde|Dónde] vas (tú)?|¿[Adónde|A dónde|Dónde] va (usted)?|¿[Adónde|A dónde|Dónde] van (ustedes)?","vas"],
 ["They are going to buy a car.","{[Ellos|Ellas]} van a comprar un [carro|coche|auto].","van","Ellos vamos a comprar un carro."]
 ]},
{t:"Family and possessives",
 b:"**Mi**, **tu** and **su** mean my, your and his/her; add **-s** when the thing owned is plural: **mis padres**. **Nuestro** (our) also changes for gender: **nuestra casa**. Possession uses **de**, never an apostrophe: **el carro de Ana**.",
 w:[["la madre","the mother"],["el padre","the father"],["el hermano","the brother"],["la hermana","the sister"],["los padres","the parents"],["nuestro","our"]],
 it:[
 ["My mother is a doctor.|My mom is a doctor.","Mi [madre|mamá] es [doctora|médica|médico].","mi","Mis madre es doctora."],
 ["My parents live in Mexico.","Mis [padres|papás] viven en México.","mis","Mi padres viven en México."],
 ["Is he your brother?","¿{Él} es tu hermano?|¿Es {él} tu hermano?|¿{Él} es su hermano?","tu","¿Él es tus hermano?"],
 ["Our house is small.|Our house is little.","Nuestra casa es [pequeña|chica].","nuestra","Nuestro casa es pequeña."],
 ["It is Ana's car.","Es el [carro|coche|auto] de Ana.","de","Es Ana's carro."]
 ]},
{t:"Hay: there is and there are",
 b:"**Hay** means both *there is* and *there are*, and it never changes: **Hay un banco** / **Hay dos bancos**. Use it to say what exists; use **está** to say where a specific thing is.",
 w:[["hay","there is / there are"],["el banco","the bank"],["la tienda","the store"],["el restaurante","the restaurant"],["muchos","many"],["cerca","nearby"]],
 it:[
 ["There is a bank here.","Hay un banco aquí.|Aquí hay un banco.","hay","Es un banco aquí."],
 ["There are two stores.|There are two shops.","Hay dos tiendas.","hay","Hay dos tienda."],
 ["Is there a restaurant nearby?|Is there a restaurant near here?","¿Hay un restaurante cerca (de aquí)?|¿Hay algún restaurante cerca (de aquí)?","hay","¿Es un restaurante cerca?"],
 ["There is no water.|There is not any water.","No hay agua.","hay","No es agua."],
 ["There are many books in the house.|There are a lot of books in the house.","Hay muchos libros en la casa.|En la casa hay muchos libros.","muchos","Hay mucho libros en la casa."]
 ]}
];

const ES_A2 = [
{t:"Ser vs estar",
 b:"**Ser** is for what something is: identity, origin, profession, time and lasting traits. **Estar** is for location and for states that can change: mood, health, temperature. **Es aburrido** = he is boring; **está aburrido** = he is bored.",
 w:[["ser","to be (identity, traits)"],["estar","to be (location, states)"],["aburrido","boring / bored"],["frío","cold"],["la sopa","the soup"],["la película","the movie"]],
 it:[
 ["My sister is a teacher.","Mi hermana es [profesora|maestra].","es","Mi hermana está profesora."],
 ["The soup is cold.","La sopa está fría.","está","~La sopa es fría."],
 ["We are in Madrid.","([Nosotros|Nosotras]) estamos en Madrid.","estamos","Somos en Madrid."],
 ["I am bored.","(Yo) estoy aburrid[o|a].","estoy","~Soy aburrido."],
 ["The movie is boring.","La película es aburrida.","es"],
 ["It is three o'clock.|It is three.","Son las tres.","son","Están las tres."]
 ]},
{t:"Stem-changing verbs",
 b:"Some verbs change their stem vowel in every form except nosotros: **e → ie** (querer: quiero, queremos), **o → ue** (poder: puedo, podemos), **e → i** (pedir: pido, pedimos). The endings stay regular.",
 w:[["querer","to want"],["poder","to be able to"],["dormir","to sleep"],["pedir","to ask for / order"],["pensar","to think"],["volver","to return"]],
 sp:{tense:"present, stem-changers",endings:"e→ie · o→ue · e→i (never in nosotros)",irregular:"quiero, puedo, duermo, pido, pienso, vuelvo"},
 it:[
 ["I want a coffee.","(Yo) quiero un café.","quiero","Yo quero un café."],
 ["Can you help me?","¿(Tú) puedes ayudarme?|¿Me puedes ayudar?|¿(Usted) puede ayudarme?|¿Me puede ayudar?|¿Pueden ayudarme?","puedes"],
 ["She sleeps eight hours.","{Ella} duerme ocho horas.","duerme","Ella dorme ocho horas."],
 ["We want to eat.","([Nosotros|Nosotras]) queremos comer.","queremos","Nosotros quieremos comer."],
 ["I always order the soup.","(Yo) siempre pido la sopa.|(Yo) pido siempre la sopa.|Siempre pido yo la sopa.","pido"]
 ]},
{t:"Reflexive verbs: daily routine",
 b:"Reflexive verbs describe what you do to yourself and need a matching pronoun: **me**, **te**, **se**, **nos**, **se**. Levantarse: **me levanto**, **te levantas**, **se levanta**. The pronoun goes before the conjugated verb.",
 w:[["levantarse","to get up"],["ducharse","to shower"],["acostarse","to go to bed"],["despertarse","to wake up"],["llamarse","to be called"],["temprano","early"]],
 it:[
 ["I get up early.","(Yo) me levanto temprano.","me","Yo levanto temprano."],
 ["She showers at night.","{Ella} se ducha [por|en|de] la noche.|{Ella} se baña [por|en|de] la noche.|{Ella} se ducha de noche.","se","Ella ducha se por la noche."],
 ["We go to bed late.","([Nosotros|Nosotras]) nos acostamos tarde.","nos","Nosotros se acostamos tarde."],
 ["What time do you wake up?","¿A qué hora te despiertas?|¿A qué hora se despierta (usted)?|¿A qué hora se despiertan?","te","¿A qué hora tú despiertas?"],
 ["My name is Ana.","(Yo) me llamo Ana.|Mi nombre es Ana.","llamo"]
 ]},
{t:"Present progressive: estar + -ando / -iendo",
 b:"For actions happening right now, use **estar** + gerund. -ar verbs take **-ando** (hablando); -er and -ir verbs take **-iendo** (comiendo, viviendo). Watch **leyendo** and **durmiendo**.",
 w:[["hablando","speaking"],["comiendo","eating"],["trabajando","working"],["leyendo","reading"],["durmiendo","sleeping"],["ahora","now"]],
 sp:{tense:"present progressive",endings:"estar + -ando (-ar) / -iendo (-er, -ir)",irregular:"leyendo, durmiendo, pidiendo, yendo"},
 it:[
 ["I am eating now.","(Yo) estoy comiendo ahora.|Ahora estoy comiendo.","comiendo","Estoy comendo ahora."],
 ["She is working.","{Ella} está trabajando.","trabajando","Ella es trabajando."],
 ["We are reading a book.","([Nosotros|Nosotras]) estamos leyendo un libro.","leyendo","Estamos leiendo un libro."],
 ["The children are sleeping.|The kids are sleeping.","Los niños están durmiendo.","durmiendo","Los niños están dormiendo."],
 ["What are you doing?","¿Qué estás haciendo?|¿Qué haces?|¿Qué está haciendo (usted)?|¿Qué están haciendo (ustedes)?","haciendo"]
 ]},
{t:"Direct object pronouns: lo, la, los, las",
 b:"Replace a noun you already mentioned with **lo**, **la**, **los** or **las**, matching its gender and number. The pronoun goes **before** the conjugated verb: **Lo tengo** = I have it. **Me**, **te** and **nos** work the same way.",
 w:[["lo","him / it (masc.)"],["la","her / it (fem.)"],["los","them (masc.)"],["las","them (fem.)"],["me","me"],["te","you"]],
 it:[
 ["The book? I have it.","¿El libro? (Yo) lo tengo.","lo","¿El libro? Tengo lo."],
 ["The house? We are buying it.|The house? We buy it.","¿La casa? ([Nosotros|Nosotras]) la compramos.|¿La casa? La estamos comprando.|¿La casa? Estamos comprándola.","la","¿La casa? Lo compramos."],
 ["The tacos? She eats them.|The tacos? She is eating them.","¿Los tacos? {Ella} los come.|¿Los tacos? {Ella} se los come.","los","¿Los tacos? Ella come los."],
 ["She knows me.","{Ella} me conoce.","me","Ella conoce me."],
 ["I love you.","(Yo) te [quiero|amo].","te","Yo quiero te."]
 ]},
{t:"Preterite: regular -ar verbs",
 b:"The preterite tells finished past actions. -ar endings: **-é, -aste, -ó, -amos, -aron**. Hablé, hablaste, habló, hablamos, hablaron. The accents matter: **hablo** = I speak, **habló** = he spoke.",
 w:[["ayer","yesterday"],["anoche","last night"],["hablé","I spoke"],["habló","he / she spoke"],["compramos","we bought"],["trabajaron","they worked"]],
 sp:{tense:"preterite, -ar verbs",endings:"-é · -aste · -ó · -amos · -asteis · -aron",irregular:"-car / -gar / -zar change in yo: busqué, llegué, empecé"},
 it:[
 ["I worked yesterday.","(Yo) trabajé ayer.|Ayer (yo) trabajé.","trabajé","Yo trabajo ayer."],
 ["She bought a car.","{Ella} compró un [carro|coche|auto].","compró","Ella compré un carro."],
 ["We talked last night.|We spoke last night.","([Nosotros|Nosotras]) hablamos anoche.|Anoche hablamos.","hablamos","Nosotros hablaron anoche."],
 ["They studied a lot.","{[Ellos|Ellas]} estudiaron mucho.","estudiaron","Ellos estudiamos mucho."],
 ["Did you work yesterday?","¿(Tú) trabajaste ayer?|¿Ayer trabajaste?|¿(Usted) trabajó ayer?|¿Trabajaron (ustedes) ayer?","trabajaste","¿Trabajastes ayer?"]
 ]},
{t:"Preterite: regular -er and -ir verbs",
 b:"-er and -ir verbs share one set of preterite endings: **-í, -iste, -ió, -imos, -ieron**. Comí, comiste, comió, comimos, comieron. Same for vivir: viví, vivió, vivieron.",
 w:[["comí","I ate"],["comió","he / she ate"],["vivimos","we lived"],["escribieron","they wrote"],["la carta","the letter"],["el año pasado","last year"]],
 sp:{tense:"preterite, -er / -ir verbs",endings:"-í · -iste · -ió · -imos · -isteis · -ieron",irregular:"leyó, leyeron; durmió, pidió (3rd person stem change)"},
 it:[
 ["I ate tacos yesterday.","(Yo) comí tacos ayer.|Ayer (yo) comí tacos.","comí","Yo comé tacos ayer."],
 ["She lived in Spain last year.","{Ella} vivió en España el año pasado.|El año pasado {ella} vivió en España.","vivió","Ella vivó en España el año pasado."],
 ["We wrote a letter.","([Nosotros|Nosotras]) escribimos una carta.","escribimos","Nosotros escribemos una carta."],
 ["They drank water.","{[Ellos|Ellas]} bebieron agua.|{[Ellos|Ellas]} tomaron agua.","bebieron","Ellos bebaron agua."],
 ["Did you eat?","¿(Tú) comiste?|¿(Usted) comió?|¿Comieron (ustedes)?|¿Ya comiste?","comiste","¿Comaste?"]
 ]},
{t:"Preterite: ir, ser, hacer, tener",
 b:"The most-used verbs are irregular in the preterite and carry no accents. **Ir** and **ser** share forms: **fui, fuiste, fue, fuimos, fueron**. **Hacer**: hice, hiciste, hizo. **Tener**: tuve, tuviste, tuvo.",
 w:[["fui","I went / I was"],["fue","he / she went / was"],["fuimos","we went"],["hice","I did / made"],["hizo","he / she did / made"],["tuve","I had"]],
 sp:{tense:"preterite, irregulars",endings:"fui · fuiste · fue · fuimos · fueron",irregular:"hice, hizo · tuve, tuvo · estuve · pude · dije"},
 it:[
 ["I went to the park.","(Yo) fui al parque.","fui","Yo fue al parque."],
 ["She went to Mexico.","{Ella} fue a México.","fue","Ella fui a México."],
 ["What did you do yesterday?","¿Qué hiciste ayer?|¿Qué hizo (usted) ayer?|¿Qué hicieron (ustedes) ayer?","hiciste","¿Qué haciste ayer?"],
 ["We went to the restaurant.","([Nosotros|Nosotras]) fuimos al restaurante.","fuimos","Nosotros imos al restaurante."],
 ["I had a problem.","(Yo) tuve un problema.","tuve","Yo tení un problema."]
 ]},
{t:"Imperfect: how things used to be",
 b:"The imperfect describes habits and background in the past. -ar verbs: **-aba, -abas, -aba, -ábamos, -aban**. -er/-ir verbs: **-ía, -ías, -ía, -íamos, -ían**. Only three irregulars: **era** (ser), **iba** (ir), **veía** (ver).",
 w:[["vivía","I used to live"],["jugaba","I used to play"],["era","I / he / she was"],["íbamos","we used to go"],["de niño","as a child"],["siempre","always"]],
 sp:{tense:"imperfect",endings:"-aba · -abas · -aba · -ábamos · -aban / -ía · -ías · -ía · -íamos · -ían",irregular:"ser: era · ir: iba · ver: veía"},
 it:[
 ["I used to live in Mexico.","(Yo) vivía en México.|Antes (yo) vivía en México.","vivía","Yo vivaba en México."],
 ["When I was a child, I played a lot.|When I was a kid, I played a lot.|When I was a child, I used to play a lot.|When I was a kid, I used to play a lot.","Cuando era niñ[o|a], jugaba mucho.|De niñ[o|a] jugaba mucho.","jugaba","Cuando era niño, jugía mucho."],
 ["She always worked here.|She always used to work here.","{Ella} siempre trabajaba aquí.|{Ella} trabajaba aquí siempre.|{Ella} trabajaba siempre aquí.","trabajaba","Ella siempre trabajía aquí."],
 ["We used to go to the park.","([Nosotros|Nosotras]) íbamos al parque.","íbamos","Nosotros íamos al parque."],
 ["The house was big.","La casa era grande.","era","La casa eraba grande."]
 ]},
{t:"Por vs para",
 b:"**Para** points forward: purpose, recipient, destination, deadline (**para ti**, **para mañana**). **Por** looks at cause, duration, exchange and movement through (**por dos horas**, **gracias por**, **por el parque**).",
 w:[["para","for (purpose, recipient, deadline)"],["por","for (cause, duration), through"],["gracias por","thanks for"],["para mañana","for / by tomorrow"],["el regalo","the gift"],["aprender","to learn"]],
 it:[
 ["This gift is for you.","Este regalo es para ti.|Este regalo es para usted.|Este regalo es para ustedes.","para","Este regalo es por ti."],
 ["Thank you for the coffee.|Thanks for the coffee.","Gracias por el café.","por","Gracias para el café."],
 ["I study to learn.|I study in order to learn.","(Yo) estudio para aprender.","para","Estudio por aprender."],
 ["We walked through the park.","([Nosotros|Nosotras]) caminamos por el parque.","por"],
 ["I worked for two hours.","(Yo) trabajé {por} dos horas.|(Yo) trabajé durante dos horas.","por","Trabajé para dos horas."],
 ["I need it for tomorrow.|I need it by tomorrow.","(Yo) [lo|la] necesito para mañana.","para","Lo necesito por mañana."]
 ]},
{t:"Comparisons",
 b:"Use **más … que** (more than), **menos … que** (less than) and **tan … como** (as … as). A few are irregular: **mejor** (better), **peor** (worse), **mayor** (older), **menor** (younger).",
 w:[["más … que","more … than"],["menos … que","less … than"],["tan … como","as … as"],["mejor","better"],["peor","worse"],["mayor","older"]],
 it:[
 ["My brother is taller than me.|My brother is taller than I am.","Mi hermano es más alto que yo.","que","Mi hermano es más alto de yo."],
 ["This car is better.","Este [carro|coche|auto] es mejor.","mejor","Este carro es más bueno."],
 ["She is as tall as her mother.|She is as tall as her mom.","{Ella} es tan alta como su [madre|mamá].","como","Ella es tan alta que su madre."],
 ["The book is less interesting than the movie.","El libro es menos interesante que la película.","menos","El libro es menos interesante como la película."],
 ["My sister is older than me.|My sister is older than I am.","Mi hermana es mayor que yo.|Mi hermana es más grande que yo.","mayor","Mi hermana es más mayor que yo."]
 ]},
{t:"Tener que and hay que",
 b:"**Tener que** + infinitive says what a specific person has to do: **Tengo que trabajar**. **Hay que** + infinitive is a general rule for everyone: **Hay que estudiar**. **Deber** + infinitive is a softer *should*.",
 w:[["tengo que","I have to"],["tienes que","you have to"],["hay que","one must / you have to"],["deber","should / must"],["mañana","tomorrow"],["bien","well"]],
 it:[
 ["I have to work tomorrow.","(Yo) tengo que trabajar mañana.|Mañana (yo) tengo que trabajar.","que","Tengo trabajar mañana."],
 ["You have to study more.","(Tú) tienes que estudiar más.|(Usted) tiene que estudiar más.|(Ustedes) tienen que estudiar más.","tienes","Tienes de estudiar más."],
 ["We have to go.|We have to leave.","([Nosotros|Nosotras]) tenemos que [ir|irnos].|Nos tenemos que ir.","tenemos","Tenemos que vamos."],
 ["One must eat well.|You have to eat well.|We have to eat well.","Hay que comer bien.","hay","Hay comer bien."],
 ["She has to buy water.","{Ella} tiene que comprar agua.","tiene","Ella tiene que compra agua."]
 ]},
{t:"Verbs like gustar: encantar, doler, interesar",
 b:"These verbs work like gustar: the thing is the subject and the person is **me, te, le, nos, les**. **Me encanta** = I love it, **me duele** = it hurts me, **me interesa** = it interests me. Use the plural verb for plural things: **me duelen los pies**.",
 w:[["me encanta","I love (it)"],["me duele","it hurts me"],["nos gusta","we like"],["les gusta","they like"],["la cabeza","the head"],["los pies","the feet"]],
 it:[
 ["I love this song.","(A mí) me encanta esta canción.","encanta","Yo encanto esta canción."],
 ["My head hurts.|I have a headache.","Me duele la cabeza.","duele","Mi cabeza duele me."],
 ["We like to travel.|We like traveling.","(A [nosotros|nosotras]) nos gusta viajar.","nos","Nosotros gustamos viajar."],
 ["They like tacos.","{A [ellos|ellas]} les gustan los tacos.","gustan","A ellos les gusta los tacos."],
 ["My feet hurt.","Me duelen los pies.","duelen","Me duele los pies."]
 ]},
{t:"Informal commands (tú)",
 b:"For a positive tú command, use the **él/ella present form**: habla, come, escribe. Eight are irregular: **ven, di, sal, haz, ten, ve, pon, sé**. Pronouns attach to the end: **dime**, **ayúdame**.",
 w:[["habla","speak!"],["come","eat!"],["ven","come!"],["haz","do / make!"],["dime","tell me"],["despacio","slowly"]],
 sp:{tense:"tú commands (affirmative)",endings:"same as él/ella present: habla · come · escribe",irregular:"ven · di · sal · haz · ten · ve · pon · sé"},
 it:[
 ["Come here!","¡Ven aquí!|¡Ven acá!","ven","¡Viene aquí!"],
 ["Speak more slowly, please.|Speak slower, please.","Habla más despacio, por favor.|Por favor, habla más despacio.|Habla más lento, por favor.","habla","Hablas más despacio, por favor."],
 ["Tell me the truth.","Dime la verdad.","dime","Di me la verdad."],
 ["Do your homework.","Haz tu tarea.|Haz la tarea.|Haz tus deberes.","haz","Hace tu tarea."],
 ["Eat your tacos.","Come tus tacos.|Cómete tus tacos.","come","Comes tus tacos."]
 ]},
{t:"Saber vs conocer",
 b:"**Saber** is knowing facts or how to do something: **sé nadar**, **no sé**. **Conocer** is being familiar with people and places: **conozco a Ana**, **conozco Madrid**. Both have an irregular yo form: **sé**, **conozco**.",
 w:[["sé","I know (a fact / how to)"],["sabes","you know"],["conozco","I know (a person / place)"],["conoce","he / she knows (person / place)"],["nadar","to swim"],["la verdad","the truth"]],
 it:[
 ["I do not know.","(Yo) no sé.|No lo sé.","sé"],
 ["I know Ana.","(Yo) conozco a Ana.","conozco","Yo sé a Ana."],
 ["Do you know how to swim?|Can you swim?","¿(Tú) sabes nadar?|¿(Usted) sabe nadar?|¿Saben nadar?","sabes","¿Conoces nadar?"],
 ["She knows Madrid well.|She knows Madrid very well.","{Ella} conoce bien Madrid.|{Ella} conoce Madrid bien.|{Ella} conoce muy bien Madrid.|{Ella} conoce Madrid muy bien.","conoce","Ella sabe bien Madrid."],
 ["We know the truth.","([Nosotros|Nosotras]) [sabemos|conocemos] la verdad.","sabemos"]
 ]}
];
