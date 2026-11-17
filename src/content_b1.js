/* ===================== B1 content pack ===================== */
const ES_B1 = [
{t:"Preterite vs imperfect",
 b:"The **preterite** reports completed events: what happened. The **imperfect** paints the background: what was going on, what things were like, what used to happen. Together: **Llovía cuando salí** = it was raining when I left.",
 w:[["mientras","while"],["cuando","when"],["de repente","suddenly"],["llovía","it was raining"],["salí","I left"],["llegó","he / she arrived"]],
 it:[
 ["It was raining when I left.","Llovía cuando salí.|Estaba lloviendo cuando salí.|Cuando salí, llovía.|Cuando salí, estaba lloviendo.","llovía","~Llovió cuando salía."],
 ["I was eating when she arrived.","(Yo) comía cuando {ella} llegó.|(Yo) estaba comiendo cuando {ella} llegó.|Cuando {ella} llegó, (yo) comía.|Cuando {ella} llegó, (yo) estaba comiendo.","llegó","~Comía cuando ella llegaba."],
 ["When I was a child, I lived in Texas.|When I was a kid, I lived in Texas.|As a child, I lived in Texas.","Cuando era niñ[o|a], vivía en Texas.|De niñ[o|a] vivía en Texas.|Cuando era niñ[o|a], viví en Texas.","vivía"],
 ["Yesterday I bought a book.|I bought a book yesterday.","Ayer (yo) compré un libro.|(Yo) compré un libro ayer.","compré","~Ayer compraba un libro."],
 ["We were tired, so we went home.","Estábamos cansad[os|as], así que [fuimos|nos fuimos] a casa.|Estábamos cansad[os|as], entonces [fuimos|nos fuimos] a casa.|Estábamos cansad[os|as] y por eso [fuimos|nos fuimos] a casa.","estábamos","~Estuvimos cansados, así que íbamos a casa."]
 ]},
{t:"Present perfect: haber + participle",
 b:"Form it with **haber** + past participle: **he, has, ha, hemos, han** + **-ado / -ido**. Use it for experiences and recent events: **He comido** = I have eaten. Irregular participles: **hecho, visto, dicho, escrito, vuelto, puesto**.",
 w:[["he","I have"],["has","you have"],["ha","he / she has"],["hemos","we have"],["hecho","done / made"],["visto","seen"]],
 sp:{tense:"present perfect",endings:"he · has · ha · hemos · habéis · han + -ado / -ido",irregular:"hecho, visto, dicho, escrito, vuelto, puesto, abierto, roto"},
 it:[
 ["I have eaten.|I have already eaten.","(Yo) he comido.|Ya he comido.|Ya comí.","he","Yo ha comido."],
 ["Have you seen this movie?|Have you seen this film?","¿(Tú) has visto esta película?|¿Ha visto (usted) esta película?|¿Han visto esta película?|¿Ya viste esta película?","visto","¿Has veído esta película?"],
 ["She has never been to Spain.","{Ella} nunca ha estado en España.|{Ella} no ha estado nunca en España.|{Ella} jamás ha estado en España.","estado","Ella nunca ha estada en España."],
 ["We have done the homework.|We have done our homework.","([Nosotros|Nosotras]) hemos hecho la tarea.|([Nosotros|Nosotras]) hemos hecho los deberes.|Ya hicimos la tarea.","hecho","Hemos hacido la tarea."],
 ["They have not arrived yet.|They have not arrived.","{[Ellos|Ellas]} no han llegado todavía.|{[Ellos|Ellas]} todavía no han llegado.|{[Ellos|Ellas]} aún no han llegado.|{[Ellos|Ellas]} no han llegado aún.","han","Ellos no han llegados todavía."]
 ]},
{t:"Future tense",
 b:"Add the endings to the whole infinitive: **-é, -ás, -á, -emos, -án**. Hablaré, comerás, vivirá. A dozen verbs change the stem: **tendré, haré, podré, diré, saldré, vendré, sabré, querré, pondré, habrá**.",
 w:[["llamaré","I will call"],["tendrá","he / she will have"],["haremos","we will do / make"],["vendrán","they will come"],["habrá","there will be"],["la fiesta","the party"]],
 sp:{tense:"future",endings:"infinitive + -é · -ás · -á · -emos · -éis · -án",irregular:"tendr-, har-, podr-, dir-, saldr-, vendr-, sabr-, querr-, pondr-, habr-"},
 it:[
 ["I will call you tomorrow.","(Yo) te llamaré mañana.|Mañana te llamaré.|(Yo) [lo|la|le] llamaré mañana.|(Yo) te voy a llamar mañana.","llamaré","Te llamaró mañana."],
 ["She will have time next week.","{Ella} tendrá tiempo la próxima semana.|{Ella} tendrá tiempo la semana que viene.|La próxima semana {ella} tendrá tiempo.|{Ella} tendrá tiempo la semana próxima.","tendrá","Ella tenerá tiempo la próxima semana."],
 ["We will do it later.","([Nosotros|Nosotras]) lo haremos [más tarde|después|luego].","haremos","Lo haceremos más tarde."],
 ["They will come to the party.","{[Ellos|Ellas]} vendrán a la fiesta.","vendrán","Ellos venirán a la fiesta."],
 ["There will be a lot of people.|There will be many people.","Habrá mucha gente.|Habrá muchas personas.","habrá","Habrán mucha gente."]
 ]},
{t:"Conditional: would",
 b:"The conditional says what *would* happen. Add **-ía, -ías, -ía, -íamos, -ían** to the infinitive: hablaría, comería. It uses the same irregular stems as the future: **tendría, haría, podría**. **Me gustaría** = I would like.",
 w:[["me gustaría","I would like"],["podrías","you could"],["sería","it would be"],["iría","I / he / she would go"],["deberías","you should"],["descansar","to rest"]],
 sp:{tense:"conditional",endings:"infinitive + -ía · -ías · -ía · -íamos · -íais · -ían",irregular:"tendría, haría, podría, diría, saldría, vendría, sabría, querría, pondría, habría"},
 it:[
 ["I would like a coffee.","(A mí) me gustaría un café.|Quisiera un café.","gustaría","Yo gustaría un café."],
 ["Could you help me?","¿(Tú) podrías ayudarme?|¿Me podrías ayudar?|¿(Usted) podría ayudarme?|¿Me podría ayudar?|¿Podrían ayudarme?","podrías","¿Poderías ayudarme?"],
 ["It would be better.","Sería mejor.","sería","Sería más mejor."],
 ["I would go, but I have to work.","(Yo) iría, pero tengo que trabajar.","iría","Yo irería, pero tengo que trabajar."],
 ["You should rest.","(Tú) deberías descansar.|(Usted) debería descansar.|Deberían descansar.","deberías","Deberías descansas."]
 ]},
{t:"Subjunctive: wishes and requests",
 b:"After a wish or request about **someone else**, Spanish uses **que** + subjunctive. Swap the vowel: -ar verbs take **-e** (hable), -er/-ir take **-a** (coma, viva). **Quiero que vengas** = I want you to come. Irregulars: **sea, vaya, tenga, haga, venga**.",
 w:[["quiero que","I want (someone) to"],["espero que","I hope that"],["vengas","you come (subj.)"],["tengas","you have (subj.)"],["sea","be (subj.)"],["ojalá","hopefully"]],
 sp:{tense:"present subjunctive",endings:"-ar: -e · -es · -e · -emos · -en / -er, -ir: -a · -as · -a · -amos · -an",irregular:"sea, vaya, tenga, haga, venga, diga, pueda, sepa, esté, dé"},
 it:[
 ["I want you to come.","(Yo) quiero que (tú) vengas.|(Yo) quiero que (usted) venga.|(Yo) quiero que vengan.","vengas","Quiero que vienes."],
 ["I hope you have a good day.|I hope that you have a good day.","Espero que tengas un buen día.|Espero que (usted) tenga un buen día.|Espero que tengan un buen día.|Ojalá (que) tengas un buen día.","tengas","Espero que tienes un buen día."],
 ["She wants us to study more.","{Ella} quiere que ([nosotros|nosotras]) estudiemos más.","estudiemos","Ella quiere que estudiamos más."],
 ["My mother wants me to eat more.|My mom wants me to eat more.","Mi [madre|mamá] quiere que (yo) coma más.","coma","Mi madre quiere que como más."],
 ["I hope it is true.|I hope that it is true.|Hopefully it is true.","Espero que sea [verdad|cierto].|Ojalá (que) sea [verdad|cierto].","sea","Espero que es verdad."]
 ]},
{t:"Subjunctive: feelings and doubt",
 b:"Feelings and doubt also trigger the subjunctive: **me alegra que**, **dudo que**, **no creo que**, **es importante que**. But certainty keeps the indicative: **Creo que viene** / **No creo que venga**.",
 w:[["me alegra que","I am glad that"],["dudo que","I doubt that"],["no creo que","I do not think that"],["es importante que","it is important that"],["creo que","I think that (+ indicative)"],["tener razón","to be right"]],
 it:[
 ["I am glad that you are here.|I am glad you are here.|I am happy that you are here.|I am happy you are here.","Me alegra que estés aquí.|Me alegro de que estés aquí.|Me alegra que (usted) esté aquí.|Me alegro de que (usted) esté aquí.|Me alegra que estén aquí.","estés","Me alegra que estás aquí."],
 ["I do not think he will come.|I do not think that he will come.|I do not think he is coming.|I do not think that he is coming.","No creo que {él} venga.","venga","No creo que él viene."],
 ["I doubt that it is true.|I doubt it is true.","Dudo que sea [verdad|cierto].","sea","Dudo que es verdad."],
 ["It is important that you study.|It is important for you to study.","Es importante que (tú) estudies.|Es importante que (usted) estudie.|Es importante que estudien.","estudies","Es importante que estudias."],
 ["I think she is right.|I think that she is right.","Creo que {ella} tiene razón.","tiene","Creo que ella tenga razón."]
 ]},
{t:"Formal and negative commands",
 b:"**Usted** commands and all **negative** commands use the subjunctive form: **hable**, **coma**, **no hables**, **no comas**. Pronouns attach to positive commands (**dígame**) but go before negative ones (**no me digas**).",
 w:[["pase","come in (usted)"],["cierre","close (usted)"],["no comas","do not eat (tú)"],["no te preocupes","do not worry"],["no me digas","do not tell me"],["siéntese","sit down (usted)"]],
 it:[
 ["Do not worry.","No te preocupes.|No se preocupe.|No se preocupen.","preocupes","No te preocupas."],
 ["Do not tell me that.","No me digas eso.|No me diga eso.|No me digan eso.","digas","No dime eso."],
 ["Sit down, please.|Please sit down.|Have a seat, please.|Please have a seat.","Siéntese, por favor.|Por favor, siéntese.|Siéntate, por favor.|Por favor, siéntate.|Siéntense, por favor.","siéntese","Se siente, por favor."],
 ["Do not eat that.","No comas eso.|No coma eso.|No coman eso.","comas","No comes eso."],
 ["Come in and close the door.","Pase y cierre la puerta.|Pasa y cierra la puerta.|Entre y cierre la puerta.|Entra y cierra la puerta.|Pasen y cierren la puerta.","cierre","Pase y cerra la puerta."]
 ]},
{t:"Double object pronouns: me lo, se la",
 b:"When two object pronouns meet, the indirect one comes first: **me lo**, **te la**, **nos los**. **Le** and **les** turn into **se** before lo / la / los / las: **Se lo doy** = I give it to him. With infinitives they can attach: **dármelo**.",
 w:[["me lo","it to me"],["te la","it to you"],["se lo","it to him / her / them"],["dar","to give"],["prestar","to lend"],["mandar","to send"]],
 it:[
 ["Can you give it to me?","¿Me lo puedes dar?|¿Puedes dármelo?|¿Me la puedes dar?|¿Puedes dármela?|¿Me lo puede dar?|¿Puede dármelo?|¿Me lo das?|¿Me la das?","lo","¿Puedes lo me dar?"],
 ["I gave it to her.","(Yo) se lo di {a ella}.|(Yo) se la di {a ella}.","se","Le lo di a ella."],
 ["She sent them to us.","{Ella} nos los [mandó|envió].|{Ella} nos las [mandó|envió].","nos","Ella los nos mandó."],
 ["I will lend it to you.","(Yo) te lo [presto|prestaré|voy a prestar].|(Yo) te la [presto|prestaré|voy a prestar].|Voy a prestártelo.|Voy a prestártela.","te","Lo te presto."],
 ["I am going to tell him.|I am going to tell him that.|I am going to tell it to him.","(Yo) se lo voy a decir.|(Yo) voy a decírselo.","se","Le lo voy a decir."]
 ]},
{t:"Relative pronouns: que, quien, donde, lo que",
 b:"**Que** links most clauses: **el libro que leo**. Use **quien** for people after a preposition (**la persona con quien hablo**), **donde** for places, and **lo que** for *what / the thing that*: **Lo que quiero es dormir**.",
 w:[["que","that / which / who"],["quien","who / whom"],["donde","where"],["lo que","what / the thing that"],["la persona","the person"],["nací","I was born"]],
 it:[
 ["The book that I am reading is very good.|The book I am reading is very good.","El libro que [leo|estoy leyendo] es muy bueno.","que","El libro quien leo es muy bueno."],
 ["That is the house where I was born.","Esa es la casa donde nací.|Esa es la casa en la que nací.|Aquella es la casa donde nací.|Esa es la casa en donde nací.","donde","Esa es la casa que nací."],
 ["I do not understand what you are saying.|I do not understand what you say.","(Yo) no entiendo lo que dices.|(Yo) no entiendo lo que estás diciendo.|(Yo) no comprendo lo que dices.|(Yo) no entiendo lo que dice.|(Yo) no entiendo lo que dicen.|(Yo) no entiendo qué dices.","lo que"],
 ["She is the person I work with.|She is the person with whom I work.|She is the person that I work with.|She is the person who I work with.","{Ella} es la persona con quien trabajo.|{Ella} es la persona con la que trabajo.","quien","Ella es la persona que trabajo con."],
 ["What I need is a coffee.","Lo que necesito es un café.","lo","Que necesito es un café."]
 ]},
{t:"Impersonal se",
 b:"Use **se** + verb when it does not matter who does it: **Se habla español** = Spanish is spoken. The verb matches the thing: **se vende casa**, **se venden casas**. For rules and customs: **No se puede fumar aquí**.",
 w:[["se habla","is spoken / people speak"],["se venden","are sold / for sale"],["se puede","one can / it is allowed"],["se dice","it is said / you say"],["se necesitan","are needed"],["fumar","to smoke"]],
 it:[
 ["Spanish is spoken here.|They speak Spanish here.|People speak Spanish here.","Aquí se habla español.|Se habla español aquí.","se","Aquí se hablan español."],
 ["How do you say this in Spanish?|How do you say that in Spanish?","¿Cómo se dice esto en español?|¿Cómo se dice eso en español?","dice","¿Cómo se dices esto en español?"],
 ["You cannot smoke here.|Smoking is not allowed here.|One cannot smoke here.","No se puede fumar aquí.|Aquí no se puede fumar.","puede","No se puedes fumar aquí."],
 ["Houses are sold here.|Houses for sale here.","Aquí se venden casas.|Se venden casas aquí.","venden","Aquí se vende casas."],
 ["Employees are needed.|Employees needed.|Workers are needed.|Staff needed.","Se necesitan empleados.|Se necesita personal.|Se necesitan trabajadores.","necesitan","Se necesita empleados."]
 ]},
{t:"Pluperfect: había + participle",
 b:"For an action that happened **before another past action**: imperfect of **haber** + participle. **Había, habías, había, habíamos, habían** + comido. **Cuando llegué, ya había salido** = when I arrived, he had already left.",
 w:[["había","I / he / she had"],["habíamos","we had"],["habían","they had"],["ya","already"],["todavía no","not yet"],["antes","before"]],
 sp:{tense:"pluperfect",endings:"había · habías · había · habíamos · habían + -ado / -ido",irregular:"same irregular participles: hecho, visto, dicho, escrito"},
 it:[
 ["When I arrived, she had already left.","Cuando llegué, {ella} ya había salido.|Cuando llegué, {ella} ya se había ido.|Cuando llegué, ya {ella} había salido.","había","Cuando llegué, ella ya ha salido."],
 ["I had never seen the sea.|I had never seen the ocean.","(Yo) nunca había visto el mar.|(Yo) no había visto nunca el mar.|(Yo) jamás había visto el mar.","visto","Nunca había veído el mar."],
 ["We had already eaten.","([Nosotros|Nosotras]) ya habíamos comido.","habíamos","Ya habíamos comimos."],
 ["They had not finished yet.|They had not finished.","{[Ellos|Ellas]} todavía no habían terminado.|{[Ellos|Ellas]} no habían terminado todavía.|{[Ellos|Ellas]} aún no habían terminado.|{[Ellos|Ellas]} no habían terminado aún.|{[Ellos|Ellas]} todavía no habían acabado.","habían","Ellos todavía no había terminado."],
 ["I had studied Spanish before.","(Yo) había estudiado español antes.|Antes (yo) había estudiado español.|(Yo) ya había estudiado español antes.","estudiado","Había estudiando español antes."]
 ]},
{t:"Si clauses: real possibilities",
 b:"For real possibilities: **si** + present, then present, future or a command. **Si llueve, no voy** / **Si tengo tiempo, te llamaré**. Never put the future or the present subjunctive right after si.",
 w:[["si","if"],["llueve","it rains"],["tiempo","time"],["ayuda","help"],["avísame","let me know"],["llegar tarde","to be late"]],
 it:[
 ["If it rains, I will not go.|If it rains, I am not going.","Si llueve, no [voy|iré|voy a ir].","llueve","Si lloverá, no voy."],
 ["If I have time, I will call you.","Si tengo tiempo, te [llamo|llamaré|voy a llamar].|Si tengo tiempo, [lo|la|le] [llamo|llamaré].","tengo","Si tendré tiempo, te llamo."],
 ["If you want, we can eat here.","Si quieres, podemos comer aquí.|Si quiere, podemos comer aquí.|Si quieren, podemos comer aquí.","quieres","Si quieras, podemos comer aquí."],
 ["If you need help, let me know.|If you need help, tell me.","Si necesitas ayuda, avísame.|Si necesitas ayuda, dime.|Si necesita ayuda, avíseme.|Si necesitas ayuda, me avisas.|Si necesitas ayuda, me dices.","necesitas","Si necesites ayuda, avísame."],
 ["If we do not leave now, we will be late.|If we do not leave now, we will arrive late.|If we do not go now, we will be late.","Si no salimos ahora, [llegaremos|llegamos|vamos a llegar] tarde.|Si no nos vamos ahora, [llegaremos|llegamos|vamos a llegar] tarde.","salimos","Si no saldremos ahora, llegaremos tarde."]
 ]},
{t:"Something and nothing: algo, nada, nadie",
 b:"Pairs: **algo / nada**, **alguien / nadie**, **siempre / nunca**, **también / tampoco**. Spanish stacks negatives: if the negative word comes after the verb, **no** goes before it: **No tengo nada**, **No vino nadie**.",
 w:[["algo","something"],["nada","nothing"],["alguien","someone"],["nadie","no one"],["nunca","never"],["tampoco","neither / not either"]],
 it:[
 ["I do not have anything.|I have nothing.","(Yo) no tengo nada.","nada","No tengo algo."],
 ["Nobody came.|No one came.","No vino nadie.|Nadie vino.","nadie","No vino alguien."],
 ["Is there someone at home?|Is anyone home?|Is there anyone at home?|Is anybody home?|Is someone home?","¿Hay alguien en casa?","alguien","¿Hay nadie en casa?"],
 ["I never drink coffee.","(Yo) nunca [tomo|bebo] café.|(Yo) no [tomo|bebo] café nunca.|(Yo) no [tomo|bebo] nunca café.|(Yo) jamás [tomo|bebo] café.","nunca","Yo tomo nunca café."],
 ["I do not like it either.|Me neither.","(A mí) tampoco me gusta.|(A mí) no me gusta tampoco.","tampoco","A mí también no me gusta."]
 ]},
{t:"Subjunctive after cuando and para que",
 b:"**Para que** (so that) always takes the subjunctive. **Cuando**, **en cuanto** and **hasta que** take it when the action is still in the future: **Cuando llegues, llámame**. For habits, keep the indicative: **Cuando llego, como**.",
 w:[["para que","so that"],["cuando","when"],["en cuanto","as soon as"],["hasta que","until"],["llámame","call me"],["sepa","I know (subj.)"]],
 it:[
 ["When you arrive, call me.|Call me when you arrive.|Call me when you get here.|When you get here, call me.|Call me when you get there.","Cuando llegues, llámame.|Llámame cuando llegues.|Cuando llegue, llámeme.|Llámeme cuando llegue.","llegues","Cuando llegarás, llámame."],
 ["I am explaining it so that you understand.|I explain it so that you understand.|I am explaining it so you understand.","(Yo) [lo|te lo] explico para que entiendas.|(Yo) [lo|se lo] explico para que entienda.|(Yo) lo explico para que entiendan.","entiendas","Lo explico para que entiendes."],
 ["We will eat when she arrives.|We are going to eat when she arrives.|We will eat when she gets here.","([Nosotros|Nosotras]) [comeremos|vamos a comer|comemos] cuando {ella} llegue.|Cuando {ella} llegue, [comeremos|vamos a comer|comemos].","llegue","Comeremos cuando ella llegará."],
 ["I will wait until you finish.|I will wait until you are done.|I am going to wait until you finish.","(Yo) [esperaré|voy a esperar|espero] hasta que termines.|(Yo) [esperaré|voy a esperar] hasta que (usted) termine.|(Yo) [esperaré|voy a esperar] hasta que acabes.","termines","Esperaré hasta que terminas."],
 ["As soon as I know, I will tell you.|I will tell you as soon as I know.","En cuanto (lo) sepa, te [aviso|digo|lo digo|avisaré|diré|lo diré].|Te [aviso|digo|avisaré|diré|lo digo|lo diré] en cuanto (lo) sepa.|Tan pronto como (lo) sepa, te [aviso|digo|avisaré|diré|lo diré].","sepa","En cuanto sé, te aviso."]
 ]},
{t:"Verb phrases: acabar de, volver a, seguir",
 b:"Spanish packs a lot into short verb phrases: **acabar de** + infinitive (to have just), **volver a** + infinitive (to do again), **dejar de** + infinitive (to stop), **seguir** + gerund (to keep doing), **llevar** + time + gerund (to have been doing).",
 w:[["acabo de","I have just"],["volver a","to do again"],["dejar de","to stop / quit"],["sigo","I keep / I still"],["llevo","I have been (for a time)"],["intentar","to try"]],
 it:[
 ["I have just arrived.|I just arrived.|I just got here.|I have just gotten here.","(Yo) acabo de llegar.","acabo","Acabo llegar."],
 ["She stopped smoking.|She quit smoking.","{Ella} dejó de fumar.","dejó","Ella dejó fumar."],
 ["I keep studying Spanish.|I am still studying Spanish.|I continue studying Spanish.|I continue to study Spanish.","(Yo) sigo estudiando español.|(Yo) continúo estudiando español.","sigo","Sigo estudiar español."],
 ["We are going to try again.|We will try again.","([Nosotros|Nosotras]) vamos a volver a intentarlo.|([Nosotros|Nosotras]) lo vamos a volver a intentar.|([Nosotros|Nosotras]) vamos a intentarlo [otra vez|de nuevo].|([Nosotros|Nosotras]) vamos a volver a intentar.|([Nosotros|Nosotras]) lo vamos a intentar [otra vez|de nuevo].|([Nosotros|Nosotras]) [lo intentaremos|intentaremos] [otra vez|de nuevo].|Volveremos a intentarlo.","volver","Vamos a volver intentarlo."],
 ["I have been living here for two years.|I have lived here for two years.","(Yo) llevo dos años viviendo aquí.|(Yo) llevo viviendo aquí dos años.|Hace dos años que vivo aquí.|(Yo) vivo aquí desde hace dos años.|(Yo) he vivido aquí (por) dos años.","llevo","Llevo dos años vivir aquí."]
 ]}
];

const EN_B1 = [
{t:"Present perfect: have + participio",
 b:"Se forma con **have / has + participio**: **I have eaten**, **she has seen**. Sirve para experiencias de vida y para cosas que acaban de pasar o siguen siendo verdad. Palabras típicas: **ever**, **never**, **already**, **yet**, **just**.",
 w:[["have eaten","he comido"],["has seen","ha visto"],["never","nunca"],["already","ya"],["yet","todavía / ya (en preguntas)"],["just","acabar de"]],
 sp:{tense:"present perfect",endings:"have / has + participio",irregular:"been, seen, done, eaten, gone, written, bought, met"},
 it:[
 ["(Yo) ya comí.|(Yo) ya he comido.","I have already eaten.|I already ate.|I have eaten already.","eaten","I have already ate."],
 ["¿Has visto esta película?|¿Ya viste esta película?|¿Ha visto (usted) esta película?","Have you seen this [movie|film]?","seen","Have you saw this movie?"],
 ["{Ella} nunca ha estado en España.|{Ella} no ha estado nunca en España.","She has never been to Spain.|She has never been in Spain.","been","She has never be to Spain."],
 ["Todavía no hemos terminado.|Aún no hemos terminado.|No hemos terminado todavía.|No hemos terminado aún.","We have not finished yet.|We are not finished yet.|We have not finished.","yet","We have not finished already."],
 ["{Él} acaba de llegar.","He has just arrived.|He just arrived.|He just got here.|He has just gotten here.","just","He has just arrive."]
 ]},
{t:"Present perfect o past simple: for y since",
 b:"Con un momento terminado (**yesterday**, **last year**, **in 2020**) se usa **past simple**: **I saw him yesterday**. Para algo que empezó antes y sigue ahora, **present perfect** con **for** (duración) o **since** (punto de inicio): **I have lived here for two years / since 2022**.",
 w:[["for two years","desde hace dos años"],["since Monday","desde el lunes"],["How long…?","¿cuánto tiempo…?"],["known","conocido"],["lived","vivido"],["each other","el uno al otro"]],
 it:[
 ["(Yo) vivo aquí desde hace dos años.|Hace dos años que vivo aquí.|(Yo) llevo dos años viviendo aquí.|(Yo) he vivido aquí (por) dos años.","I have lived here for two years.|I have been living here for two years.","for","I live here since two years."],
 ["{Ella} trabaja aquí desde el lunes.|{Ella} ha trabajado aquí desde el lunes.","She has worked here since Monday.|She has been working here since Monday.","since","She has worked here for Monday."],
 ["(Yo) lo vi ayer.|Ayer lo vi.|(Yo) le vi ayer.","I saw him yesterday.|Yesterday I saw him.","saw","I have seen him yesterday."],
 ["¿Cuánto tiempo llevas aquí?|¿Cuánto tiempo has estado aquí?|¿Hace cuánto (tiempo) (que) estás aquí?|¿Cuánto tiempo lleva (usted) aquí?|¿Cuánto llevas aquí?","How long have you been here?","long","How much time you are here?"],
 ["Nos conocemos desde hace diez años.|Hace diez años que nos conocemos.|Nos conocemos hace diez años.","We have known each other for ten years.","known","We know each other since ten years."]
 ]},
{t:"Pasado continuo: was / were + -ing",
 b:"Describe una acción en progreso en el pasado: **I was sleeping**. Muchas veces la interrumpe otra en past simple con **when**: **I was sleeping when you called**. Con **while** van dos acciones al mismo tiempo.",
 w:[["was sleeping","estaba durmiendo"],["were watching","estaban viendo"],["when","cuando"],["while","mientras"],["called","llamaste / llamó"],["left","salimos / salió"]],
 sp:{tense:"past continuous",endings:"was / were + verb-ing",irregular:""},
 it:[
 ["(Yo) estaba durmiendo cuando llamaste.|(Yo) dormía cuando llamaste.|(Yo) estaba durmiendo cuando (usted) llamó.|Cuando llamaste, (yo) estaba durmiendo.","I was sleeping when you called.|When you called, I was sleeping.","sleeping","I was sleep when you called."],
 ["¿Qué estabas haciendo?|¿Qué hacías?|¿Qué estaba haciendo (usted)?","What were you doing?","were","What was you doing?"],
 ["Estaba lloviendo cuando salimos.|Llovía cuando salimos.|Cuando salimos, estaba lloviendo.|Cuando salimos, llovía.","It was raining when we left.|When we left, it was raining.|It was raining when we went out.","raining","It was rain when we left."],
 ["{Ellos} estaban viendo la tele mientras (yo) cocinaba.|{Ellos} veían la tele mientras (yo) cocinaba.|{Ellos} estaban viendo la televisión mientras (yo) cocinaba.|{Ellos} estaban viendo la tele mientras (yo) estaba cocinando.|{Ellas} estaban viendo la tele mientras (yo) cocinaba.","They were watching TV while I was cooking.|They were watching TV while I cooked.|They were watching television while I was cooking.","while","They were watching TV during I was cooking."],
 ["{Ella} no estaba escuchando.|{Ella} no escuchaba.","She was not listening.","listening","She was not listen."]
 ]},
{t:"Used to: lo que antes hacías",
 b:"**Used to + verbo base** habla de hábitos o situaciones del pasado que ya no son así: **I used to smoke** = antes fumaba. Negación y pregunta pierden la -d: **I didn't use to**, **Did you use to…?** No existe en presente: para hábitos actuales se usa **usually**.",
 w:[["used to","antes + imperfecto / solía"],["didn't use to","antes no"],["anymore","ya no"],["smoke","fumar"],["play soccer","jugar al fútbol"],["as a child","de niño"]],
 it:[
 ["Antes (yo) fumaba.|(Yo) fumaba antes.|(Yo) solía fumar.","I used to smoke.","used","I use to smoke."],
 ["De niñ[o|a] (yo) jugaba al fútbol.|Cuando era niñ[o|a], jugaba (al) fútbol.|De niñ[o|a] (yo) jugaba fútbol.","I used to play soccer as a child.|As a child, I used to play soccer.|I used to play football as a child.|When I was a child, I used to play soccer.|I used to play soccer when I was a child.|I used to play soccer as a kid.|I used to play soccer when I was a kid.","play","I used to playing soccer as a child."],
 ["{Ella} antes vivía aquí.|Antes {ella} vivía aquí.|{Ella} vivía aquí antes.|{Ella} solía vivir aquí.","She used to live here.","live","She used to lived here."],
 ["Antes no me gustaba el café.|No me gustaba el café antes.|Antes el café no me gustaba.","I did not use to like coffee.|I did not used to like coffee.|I never used to like coffee.|I used to not like coffee.","like","I didn't used to liked coffee."],
 ["Ya no trabajo allí.|Ya no trabajo ahí.","I do not work there anymore.|I no longer work there.|I do not work there any more.|I do not work there any longer.","anymore","I don't work there already."]
 ]},
{t:"Primer condicional: if + presente, will",
 b:"Para posibilidades reales del futuro: **If + present simple, will + verbo base**. **If it rains, I will stay home**. Después de if nunca va will. También existe **unless** (a menos que) y se puede invertir el orden de las dos partes.",
 w:[["if","si"],["unless","a menos que"],["will stay","me quedaré"],["pass the exam","aprobar el examen"],["be late","llegar tarde"],["let me know","avísame"]],
 it:[
 ["Si llueve, me quedaré en casa.|Si llueve, me quedo en casa.|Si llueve, me voy a quedar en casa.","If it rains, I will stay home.|If it rains, I will stay at home.|I will stay home if it rains.|If it rains, I am going to stay home.","rains","If it will rain, I will stay home."],
 ["Si tengo tiempo, te llamaré.|Si tengo tiempo, te llamo.|Si tengo tiempo, te voy a llamar.","If I have time, I will call you.|I will call you if I have time.","have","If I will have time, I will call you."],
 ["Si no salimos ahora, llegaremos tarde.|Si no nos vamos ahora, llegaremos tarde.|Si no salimos ahora, vamos a llegar tarde.|Si no salimos ahora, llegamos tarde.","If we do not leave now, we will be late.|If we do not go now, we will be late.|We will be late if we do not leave now.|Unless we leave now, we will be late.|If we do not leave now, we will arrive late.","will","If we don't leave now, we late."],
 ["Si estudias, aprobarás el examen.|Si estudias, vas a aprobar el examen.|Si estudias, pasarás el examen.|Si estudias, apruebas el examen.|Si estudias, vas a pasar el examen.","If you study, you will pass the [exam|test].|You will pass the [exam|test] if you study.","pass","If you study, you will to pass the exam."],
 ["Si necesitas ayuda, avísame.|Si necesitas ayuda, dime.|Si necesita ayuda, avíseme.","If you need help, let me know.|If you need help, tell me.|Let me know if you need help.|If you need any help, let me know.","need","If you will need help, let me know."]
 ]},
{t:"Segundo condicional: if + pasado, would",
 b:"Para situaciones imaginarias: **If + past simple, would + verbo base**. **If I had money, I would travel** = si tuviera dinero, viajaría. Con to be se prefiere **were** para todas las personas: **If I were you…**",
 w:[["would","(condicional: -ría)"],["If I were you","yo que tú"],["had","tuviera"],["lived","viviera"],["won","ganara"],["lottery","lotería"]],
 it:[
 ["Si tuviera dinero, viajaría.|Si yo tuviera dinero, viajaría.|Si tuviese dinero, viajaría.","If I had money, I would travel.|I would travel if I had money.","had","If I would have money, I would travel."],
 ["Yo que tú, no lo haría.|Si yo fuera tú, no lo haría.|Yo en tu lugar no lo haría.|Si fuera tú, no lo haría.","If I were you, I would not do it.|If I was you, I would not do it.|I would not do it if I were you.|If I were you, I would not do that.","were","If I am you, I would not do it."],
 ["¿Qué harías?|¿Qué haría (usted)?|¿Qué harían?","What would you do?","would","What will you did?"],
 ["Si {ella} viviera aquí, la vería más.|Si {ella} viviese aquí, la vería más.|Si {ella} viviera aquí, la vería más seguido.","If she lived here, I would see her more.|If she lived here, I would see her more often.|I would see her more if she lived here.","lived","If she would live here, I would see her more."],
 ["Si (yo) ganara la lotería, compraría una casa.|Si me ganara la lotería, (me) compraría una casa.|Si (yo) ganase la lotería, compraría una casa.","If I won the lottery, I would buy a house.|I would buy a house if I won the lottery.","won","If I win the lottery, I would buy a house."]
 ]},
{t:"Voz pasiva: be + participio",
 b:"Cuando importa más la acción que quien la hace: **to be + participio**. **English is spoken here**, **The house was built in 1990**. Quien hace la acción, si se menciona, va con **by**. En inglés se usa mucho más que en español.",
 w:[["is spoken","se habla"],["was built","fue construida"],["was written","fue escrito"],["was stolen","fue robado"],["were sold","se vendieron"],["by","por"]],
 sp:{tense:"passive voice",endings:"am / is / are / was / were + participio",irregular:"built, made, written, sold, spoken, stolen, given"},
 it:[
 ["Aquí se habla inglés.|Se habla inglés aquí.","English is spoken here.|They speak English here.|People speak English here.","spoken","English is speak here."],
 ["La casa fue construida en 1990.|La casa se construyó en 1990.","The house was built in 1990.","built","The house was build in 1990."],
 ["Este libro fue escrito por una mujer.|Este libro lo escribió una mujer.","This book was written by a woman.|A woman wrote this book.","by","~This book was written for a woman."],
 ["Me robaron el teléfono.|Me robaron el celular.|Mi teléfono fue robado.|Se robaron mi teléfono.","My phone was stolen.|My cell phone was stolen.|They stole my phone.|Someone stole my phone.|My phone got stolen.","stolen","My phone was stole."],
 ["Los boletos se vendieron ayer.|Las entradas se vendieron ayer.|Los boletos fueron vendidos ayer.|Ayer se vendieron los boletos.","The tickets were sold yesterday.","were","The tickets was sold yesterday."]
 ]},
{t:"Oraciones de relativo: who, which, that, where",
 b:"**Who** para personas, **which** para cosas, **that** para las dos y **where** para lugares. **The man who lives here**, **the book that I bought**. Si el relativo es objeto se puede omitir: **the book I bought**. *Lo que* se dice **what**.",
 w:[["who","que / quien (personas)"],["which","que / el cual (cosas)"],["that","que"],["where","donde"],["what","lo que"],["with","con"]],
 it:[
 ["El hombre que vive aquí es doctor.|El hombre que vive aquí es médico.","The man who lives here is a doctor.|The man that lives here is a doctor.","who","The man which lives here is a doctor."],
 ["El libro que compré es muy bueno.","The book that I bought is very good.|The book I bought is very good.|The book which I bought is very good.","that","The book who I bought is very good."],
 ["Esa es la casa donde nací.|Esa es la casa en la que nací.|Aquella es la casa donde nací.","That is the house where I was born.|That is the house I was born in.|That is the house in which I was born.","where","That is the house which I was born."],
 ["{Ella} es la persona con la que trabajo.|{Ella} es la persona con quien trabajo.","She is the person I work with.|She is the person that I work with.|She is the person who I work with.|She is the person with whom I work.|She is the person whom I work with.","with","She is the person I work."],
 ["No entiendo lo que dices.|No entiendo lo que estás diciendo.|No entiendo qué dices.|No entiendo lo que dice.","I do not understand what you are saying.|I do not understand what you say.|I do not understand what you mean.","what","I don't understand that you are saying."]
 ]},
{t:"Posibilidad: might, may, could",
 b:"Para decir que algo es posible pero no seguro: **might**, **may** o **could** + verbo base, sin *to*. **It might rain** = puede que llueva. La negación es **might not**. **Maybe** va al principio y lleva verbo normal: **Maybe she is busy**.",
 w:[["might","puede que / quizás"],["may","puede que"],["could","podría"],["might not","puede que no"],["maybe","quizás / tal vez"],["busy","ocupado"]],
 it:[
 ["Puede que llueva mañana.|Quizás llueva mañana.|Tal vez llueva mañana.|Puede ser que llueva mañana.|A lo mejor llueve mañana.|Quizá llueva mañana.","It might rain tomorrow.|It may rain tomorrow.|It could rain tomorrow.|Maybe it will rain tomorrow.","might","It might to rain tomorrow."],
 ["Puede que {ella} esté ocupada.|Quizás {ella} esté ocupada.|Tal vez {ella} esté ocupada.|A lo mejor {ella} está ocupada.|Quizá {ella} esté ocupada.","She might be busy.|She may be busy.|She could be busy.|Maybe she is busy.","be","She might is busy."],
 ["Puede que (yo) no vaya.|Quizás no vaya.|Tal vez no vaya.|A lo mejor no voy.","I might not go.|I may not go.|Maybe I will not go.|I might not come.","not","I don't might go."],
 ["Podríamos ir al cine.","We could go to the [movies|cinema].|We might go to the [movies|cinema].","could","We could to go to the movies."],
 ["Puede que tengas razón.|Quizás tengas razón.|Tal vez tengas razón.|A lo mejor tienes razón.|Puede que tenga razón.","You might be right.|You may be right.|You could be right.|Maybe you are right.","right","You might have reason."]
 ]},
{t:"Verbo + -ing o verbo + to",
 b:"Algunos verbos van seguidos de **-ing**: **enjoy, finish, mind, avoid, keep** (**I enjoy cooking**). Otros llevan **to + verbo**: **want, need, decide, hope, learn** (**I want to go**). Después de una preposición siempre va **-ing**: **before leaving**.",
 w:[["enjoy + -ing","disfrutar"],["finish + -ing","terminar de"],["want to","querer"],["decide to","decidir"],["stay","quedarse"],["before leaving","antes de salir"]],
 it:[
 ["(Yo) disfruto cocinar.|Me gusta cocinar.|(Yo) disfruto cocinando.|(Yo) disfruto de cocinar.","I enjoy cooking.","cooking","I enjoy to cook."],
 ["(Yo) quiero aprender inglés.","I want to learn English.","to","I want learn English."],
 ["{Ella} decidió quedarse.","She decided to stay.","stay","She decided staying."],
 ["Terminamos de comer.|([Nosotros|Nosotras]) terminamos de comer.","We finished eating.|We have finished eating.","eating","We finished to eat."],
 ["Llámame antes de salir.|Llámeme antes de salir.|Llámame antes de irte.","Call me before leaving.|Call me before you leave.|Call me before you go.|Call me before going.","leaving","Call me before to leave."]
 ]},
{t:"Phrasal verbs básicos",
 b:"Un phrasal verb es verbo + partícula con significado propio: **get up** (levantarse), **look for** (buscar), **turn on / off** (encender / apagar), **give up** (rendirse), **find out** (enterarse). Con pronombre, este va en medio: **turn it off**.",
 w:[["get up","levantarse"],["look for","buscar"],["turn on","encender / prender"],["turn off","apagar"],["give up","rendirse"],["keys","llaves"]],
 it:[
 ["(Yo) me levanto a las seis.","I get up at six.|I get up at six o'clock.","up","I get me up at six."],
 ["(Yo) estoy buscando mis llaves.|(Yo) busco mis llaves.|Ando buscando mis llaves.","I am looking for my keys.","for","I am looking my keys."],
 ["Apaga la luz, por favor.|Por favor, apaga la luz.|Apague la luz, por favor.","Turn off the light, please.|Please turn off the light.|Turn the light off, please.|Please turn the light off.|Turn off the lights, please.","off","Close the light, please."],
 ["¡No te rindas!|¡No se rinda!|¡No te des por vencid[o|a]!","Do not give up!|Never give up!","give","Don't give you up!"],
 ["Apágalo.|Apágala.|Apáguelo.","Turn it off.|Switch it off.","it","Turn off it."]
 ]},
{t:"Estilo indirecto: said y told",
 b:"Al contar lo que alguien dijo, el verbo retrocede un tiempo: **I am tired → He said (that) he was tired**; **will → would**; **can → could**. **Say** no lleva persona; **tell** sí: **He said that…** / **He told me that…**",
 w:[["said","dijo"],["told me","me dijo"],["that","que"],["would","(futuro visto desde el pasado)"],["could","podía"],["asked","preguntó"]],
 it:[
 ["{Él} dijo que estaba cansado.","He said that he was tired.|He said he was tired.","was","He said me that he was tired."],
 ["{Ella} me dijo que vendría.|{Ella} me dijo que iba a venir.","She told me that she would come.|She told me she would come.|She told me she was going to come.|She told me that she was going to come.","told","She said me that she would come."],
 ["Dijeron que no podían venir.|{Ellos} dijeron que no podían venir.|Dijeron que no podían ir.","They said that they could not come.|They said they could not come.","could","They said that they can not came."],
 ["{Él} me preguntó dónde vivía.|{Él} me preguntó dónde vivo.","He asked me where I lived.|He asked me where I live.","asked","He asked me where did I live."],
 ["Te dije que tuvieras cuidado.|Te dije que tengas cuidado.|Le dije que tuviera cuidado.","I told you to be careful.","to","I told you that be careful."]
 ]},
{t:"Too, enough, so y such",
 b:"**Too** + adjetivo = demasiado (**too expensive**). **Enough** va después del adjetivo (**big enough**) pero antes del sustantivo (**enough money**). **So** + adjetivo y **such** + (a) + sustantivo intensifican: **so good**, **such a good day**.",
 w:[["too","demasiado"],["enough","suficiente"],["so","tan"],["such a","un … tan"],["too many","demasiados"],["expensive","caro"]],
 it:[
 ["Es demasiado caro.|Está demasiado caro.","It is too expensive.","too","It is too much expensive."],
 ["No tengo suficiente dinero.|No tengo dinero suficiente.|No me alcanza el dinero.","I do not have enough money.","enough","I do not have money enough."],
 ["La casa no es lo suficientemente grande.|La casa no es suficientemente grande.|La casa no es bastante grande.","The house is not big enough.|The house is not large enough.","enough","The house is not enough big."],
 ["Fue un día tan bueno.|Fue un día tan lindo.|Fue un día tan bonito.|Fue tan buen día.","It was such a good day.|It was such a nice day.|It was such a great day.|It was such a beautiful day.","such","It was so good day."],
 ["Hay demasiada gente.|Hay demasiadas personas.","There are too many people.","many","There are too much people."]
 ]},
{t:"Preguntas indirectas",
 b:"Para preguntar con más cortesía: **Do you know…**, **Can you tell me…**, **I wonder…** + la pregunta en orden normal, sin do / does / did: **Where is the bank? → Do you know where the bank is?** Para preguntas de sí o no se usa **if**.",
 w:[["Do you know…?","¿sabes…?"],["Can you tell me…?","¿me puedes decir…?"],["I wonder","me pregunto"],["if","si"],["what time","qué hora"],["how much","cuánto"]],
 it:[
 ["¿Sabes dónde está el banco?|¿Sabe (usted) dónde está el banco?|¿Saben dónde está el banco?","Do you know where the bank is?","is","Do you know where is the bank?"],
 ["¿Me puedes decir qué hora es?|¿Puedes decirme qué hora es?|¿Me puede decir qué hora es?|¿Puede decirme qué hora es?|¿Me dices qué hora es?|¿Me puedes decir la hora?","Can you tell me what time it is?|Could you tell me what time it is?|Can you tell me the time?|Could you tell me the time?","it","Can you tell me what time is it?"],
 ["(Yo) no sé dónde vive {ella}.|(Yo) no sé dónde {ella} vive.","I do not know where she lives.","lives","I don't know where does she live."],
 ["Me pregunto si {él} vendrá.|Me pregunto si {él} va a venir.|Me pregunto si vendrá él.","I wonder if he will come.|I wonder whether he will come.|I wonder if he is coming.|I wonder if he is going to come.","if","I wonder if will he come."],
 ["¿Sabes cuánto cuesta?|¿Sabe (usted) cuánto cuesta?|¿Sabes cuánto vale?|¿Sabes cuánto es?","Do you know how much it costs?|Do you know how much it is?|Do you know how much this costs?|Do you know how much that costs?","costs","Do you know how much does it cost?"]
 ]},
{t:"Make y do",
 b:"Los dos significan *hacer*. **Do** es para tareas, trabajo y actividades en general: **do homework, do the dishes, do exercise**. **Make** es para crear o producir algo: **make dinner, make a mistake, make a decision, make money**.",
 w:[["do homework","hacer la tarea"],["do the dishes","lavar los platos"],["make dinner","hacer la cena"],["make a mistake","cometer un error"],["make a decision","tomar una decisión"],["do me a favor","hacerme un favor"]],
 it:[
 ["(Yo) tengo que hacer la tarea.|(Yo) tengo que hacer los deberes.|(Yo) tengo que hacer mi tarea.","I have to do my homework.|I have to do homework.|I have to do the homework.|I must do my homework.|I need to do my homework.","do","I have to make my homework."],
 ["(Yo) cometí un error.|Me equivoqué.|(Yo) hice un error.","I made a mistake.","made","I did a mistake."],
 ["{Ella} está haciendo la cena.|{Ella} está preparando la cena.|{Ella} hace la cena.","She is making dinner.|She is cooking dinner.|She is preparing dinner.|She makes dinner.","making","She is doing dinner."],
 ["¿Me haces un favor?|¿Me puedes hacer un favor?|¿Puedes hacerme un favor?|¿Me hace un favor?|¿Me puede hacer un favor?","Can you do me a favor?|Could you do me a favor?|Will you do me a favor?|Would you do me a favor?|Can you do me a favour?","do","Can you make me a favor?"],
 ["Tenemos que tomar una decisión.|([Nosotros|Nosotras]) tenemos que tomar una decisión.|Tenemos que decidir.","We have to make a decision.|We need to make a decision.|We must make a decision.|We have to decide.","make","We have to do a decision."]
 ]}
];

COURSE.es.B1 = ES_B1;
COURSE.en.B1 = EN_B1;

Object.assign(CATS, {
  education:{en:"Education",es:"Educación"}, business:{en:"Business",es:"Negocios"}, environment:{en:"Environment",es:"Medio ambiente"},
  society:{en:"Society",es:"Sociedad"}, relationships:{en:"Relationships",es:"Relaciones"}, ideas:{en:"Goals and ideas",es:"Metas e ideas"},
  doing:{en:"Getting things done",es:"Resolver cosas"}, wellness:{en:"Body and wellness",es:"Cuerpo y bienestar"}, media:{en:"Media",es:"Medios"}
});
VOCAB.B1 = {
  education:[["el examen|la prueba","exam|test"],["la beca","scholarship"],["la carrera","career|degree|major"],["el título","diploma|degree|title"],["aprobar","to pass"],["reprobar|suspender","to fail"],["la materia|la asignatura","subject"],["los apuntes","notes"]],
  business:[["la empresa|la compañía","company|business"],["el contrato","contract"],["el presupuesto","budget"],["la factura","invoice|bill"],["el impuesto","tax"],["el préstamo","loan"],["la deuda","debt"],["los ahorros|el ahorro","savings"]],
  environment:[["el medio ambiente","environment"],["la basura","trash|garbage|rubbish"],["reciclar","to recycle"],["la contaminación","pollution"],["el cambio climático","climate change"],["la sequía","drought"],["la inundación","flood"],["la energía","energy|power"]],
  society:[["el gobierno","government"],["la ley","law"],["el derecho","right"],["el ciudadano|la ciudadana","citizen"],["la huelga","strike"],["las elecciones","election|elections"],["la igualdad","equality"],["la pobreza","poverty"]],
  relationships:[["la pareja","partner|couple"],["la boda","wedding"],["el vecino|la vecina","neighbor|neighbour"],["la amistad","friendship"],["el novio","boyfriend|groom"],["la novia","girlfriend|bride"],["confiar","to trust"],["discutir","to argue|to discuss"],["extrañar|echar de menos","to miss"]],
  ideas:[["el éxito","success"],["el fracaso","failure"],["la meta|el objetivo","goal|objective"],["el reto|el desafío","challenge"],["la ventaja","advantage"],["la desventaja","disadvantage"],["el consejo","advice|tip"],["la oportunidad","opportunity|chance"]],
  doing:[["lograr|conseguir","to achieve|to get|to manage"],["intentar|tratar","to try"],["mejorar","to improve"],["evitar","to avoid"],["elegir|escoger","to choose|to pick"],["compartir","to share"],["resolver|solucionar","to solve|to resolve"],["quejarse","to complain"]],
  wellness:[["la herida","wound|injury"],["la receta","prescription|recipe"],["el seguro","insurance"],["la cirugía|la operación","surgery|operation"],["el estrés","stress"],["el sueño","sleep|dream"],["adelgazar|bajar de peso","to lose weight"],["sano|sana|saludable","healthy"]],
  media:[["las noticias|la noticia","news"],["el periódico|el diario","newspaper"],["el anuncio","ad|advertisement|announcement"],["la entrevista","interview"],["el periodista|la periodista","journalist|reporter"],["la red social","social network|social media"],["el enlace","link"],["descargar|bajar","to download"]]
};
