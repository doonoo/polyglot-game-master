/* ===================== Grammar tips matched to each sentence ===================== */
/* Each rule looks at the correct answer (and what you typed) and explains the grammar
   actually used there. Rules touching the words you got wrong are shown first. */
const TIP_ES = [  // target: Spanish  → tips for English speakers (with Spanish text too)
 {id:"prog", re:/\b(estoy|estás|está|estamos|están|estaba|estabas|estábamos|estaban|sigo|sigue|llevo|llevas|lleva)\s+\w+(ando|iendo|yendo)\b/,
  en:"Estar + -ando/-iendo is the “-ing” form for actions in progress: estoy comiendo = I am eating; estaba comiendo = I was eating.",
  es:"Estar + -ando/-iendo expresa lo que pasa ahora mismo: estoy comiendo."},
 {id:"estar", re:/\b(estoy|estás|está|estamos|estáis|están|estaba|estaban|estuve|estuvo|esté|estés)\b/,
  en:"Estar is for states and location: how something is right now (cansado, enfermo, abierto) and where it is (en casa).",
  es:"Estar: estados y ubicación (cansado, abierto, en casa)."},
 {id:"ser", re:/\b(soy|eres|es|somos|sois|son|era|eras|éramos|eran|sea)\b/,
  en:"Ser is for what something is: identity, origin, job, time, what it is made of and what it is like (alto, simpático).",
  es:"Ser: identidad, origen, profesión, hora y características."},
 {id:"tener", re:/\b(tengo|tienes|tiene|tenemos|tienen|tenía|tuve)\s+(\w+\s+)?(hambre|sed|frío|calor|sueño|miedo|prisa|razón|suerte|años|ganas|cuidado)\b/,
  en:"Spanish uses tener (have) where English uses “be”: tengo hambre = I'm hungry, tengo frío = I'm cold, tengo 30 años = I'm 30.",
  es:"Se usa tener: tengo hambre, tengo frío, tengo 30 años."},
 {id:"tenerque", re:/\b(tengo|tienes|tiene|tenemos|tienen|tuve|tenía)\s+que\b|\bhay\s+que\b/,
  en:"Tener que + verb = have to; hay que + verb = one has to (general).",
  es:"Tener que = obligación personal; hay que = obligación general."},
 {id:"gustar", re:/\b(gusta|gustan|gustaría|encanta|encantan|duele|duelen|interesa|interesan|importa|falta|faltan|parece|molesta)\b/,
  en:"Gustar works backwards: the thing liked is the subject. Me gusta + one thing, me gustan + several. A mí / a ella can be added for emphasis.",
  es:"Gustar: lo que gusta es el sujeto. Me gusta + singular, me gustan + plural."},
 {id:"hay", re:/\bhay\b(?!\s+que)|\bhabía\b(?!\s+\w+(ado|ido|to|cho|so))/,
  en:"Hay = there is / there are. It never changes for plural (hay un gato, hay tres gatos). Past: había.",
  es:"Hay no cambia en plural: hay un gato, hay tres gatos."},
 {id:"ira", re:/\b(voy|vas|va|vamos|van|iba|ibas|íbamos|iban)\s+a\s+\w+(ar|er|ir)(lo|la|los|las|le|les|me|te|se|nos)?\b/,
  en:"Ir a + infinitive is the everyday future: voy a estudiar = I'm going to study.",
  es:"Ir a + infinitivo = futuro cercano: voy a estudiar."},
 {id:"perf", re:/\b(he|has|ha|hemos|habéis|han)\s+\w+(ado|ido|to|cho|sto)\b/,
  en:"Present perfect = haber + participle: he comido (I have eaten). The participle never changes: ha comido, hemos comido.",
  es:"Pretérito perfecto: haber + participio (he comido)."},
 {id:"pluperf", re:/\b(había|habías|habíamos|habían)\s+\w+(ado|ido|to|cho)\b/,
  en:"Había + participle = had done something (before another past moment).",
  es:"Había + participio = pasado anterior a otro pasado."},
 {id:"subj", re:/\b(ojalá|para que|antes de que|sin que|a menos que|con tal de que|en caso de que)\b|\b(quiero|quieres|quiere|queremos|quieren|espero|esperamos|necesito|prefiero|pido|pide|recomiendo|sugiero|dudo|me alegra|me alegro de|es importante|es posible|es necesario|es raro|es una pena|no creo|puede)\s+que\b/,
  en:"These phrases trigger the subjunctive: wishes, requests, feelings, doubt, purpose (para que) and future time with cuando. Quiero que vengas (not vienes).",
  es:"Deseo, petición, emoción, duda, finalidad y cuando + futuro piden subjuntivo: quiero que vengas."},
 {id:"impsubj", re:/\b(?!(para|cara|caras|clara|sara|primera|tercera|cualquiera|era|quiera|quieras|quieran|madera|carrera|escalera|afuera|fuera|bandera|nevera|cartera|frontera|manera|primavera|espera|ahora|hora|vara|tara|mara|lara|clara|rara|guitarra|parada|prepara|separa|compara|declara|repara|enfermera|cocinera|camarera|abogada|bandera|carnicera|panadera|pera)\b)\w+(ara|aras|áramos|aran|iera|ieras|iéramos|ieran|iese)\b/,
  en:"Imperfect subjunctive (-ara/-iera) appears after si for unreal conditions and after past wishes: si tuviera dinero…, quería que vinieras.",
  es:"Subjuntivo imperfecto (-ara/-iera): si tuviera…, quería que vinieras."},
 {id:"si", re:/^\s*¿?si\s|\s(si)\s(?!no\b)/,
  en:"Si clauses: si + present → future (si llueve, me quedo); si + -ara/-iera → conditional (si lloviera, me quedaría).",
  es:"Si + presente → futuro; si + imperfecto de subjuntivo → condicional."},
 {id:"cond", re:/\b(?!(librer|galer|fruter|panader|pizzer|loter|cafeter|carnicer|zapater|ferreter|joyer|peluquer|bater|categor|cervecer|mayor|pastel|perfumer|lavander|jugueter|papeler|frutería|tienda)\w*)\w+(ría|rías|ríamos|rían)\b/,
  en:"Conditional (-ría) = would: me gustaría = I would like, podría = could.",
  es:"Condicional (-ría): me gustaría, podría."},
 {id:"fut", re:/\b\w+(ré|rás|rá|rán)\b/,
  en:"Simple future: infinitive + -é, -ás, -á, -emos, -án (hablaré). A few are irregular: tendré, haré, podré, saldré, vendré, diré.",
  es:"Futuro: infinitivo + -é/-ás/-á/-emos/-án (hablaré); irregulares: tendré, haré, diré."},
 {id:"pret", re:/\b(?!(qué|porqué|café|bebé|josé|canapé|chalé|puré|menú|olé|ahí|así|aquí|allí|sí|mí|rubí|esquí|maní|ají|jabalí|colibrí|bisturí)\b)\w{1,}(é|ó|í|aste|iste|aron|ieron)\b|\b(fui|fue|fuimos|fueron|hice|hizo|tuve|tuvo|dije|dijo|puse|vine|pude|supe|quise|estuve)\b/,
  en:"Preterite = finished actions at a specific moment (ayer, el lunes, en 2015): compré, comió, fuimos.",
  es:"Pretérito indefinido = acciones terminadas en un momento concreto: compré, fuimos."},
 {id:"imperf", re:/\b\w{2,}(aba|abas|ábamos|aban|íamos|ían)\b|\b(tenía|tenías|había|vivía|comía|quería|querías|podía|sabía|hacía|decía|salía|veía|leía|escribía|venía|conocía|creía|parecía|dormía|bebía|sentía|prefería|entendía|llovía|nevaba|era|eras|éramos|eran|iba|ibas|iban)\b/,
  en:"Imperfect (-aba / -ía) = background, habits and descriptions in the past: cuando era niño, jugaba mucho.",
  es:"Imperfecto (-aba/-ía) = hábitos, descripciones y fondo en el pasado."},
 {id:"refl", re:/\b(me|te|se|nos)\s+(llamo|llamas|llama|levanto|levantas|levanta|acuesto|ducho|visto|siento|sientes|siente|despierto|quedo|queda|preocupes|preocupa|casaron|conocimos|conocieron|fue|va|vamos|olvidó|olvidaron|rompió|cayó|acabó|perdió|puso|hizo|volvió|parece|alegro|acuesta|acuestan|afeita|despierta|despiertan|levantan|duchan|viste|lava|lavo|pone|ponen|sienta|quedan)\b|\b\w+(arse|erse|irse|ándose|iéndose)\b/,
  en:"Reflexive verbs carry a pronoun that matches the subject: me levanto, te levantas, se levanta, nos levantamos.",
  es:"Verbos reflexivos: el pronombre coincide con el sujeto (me levanto, te levantas…)."},
 {id:"selo", re:/\bse\s+(lo|la|los|las)\b/,
  en:"Le/les become se before lo/la/los/las: se lo doy (not le lo doy).",
  es:"Le/les se convierten en se ante lo/la: se lo doy."},
 {id:"objpro", re:/(^[¡¿]?\s*(?=(lo|le|les|me|te|nos)\s)|\b(no|yo|tú|él|ella|usted|nosotros|ellos|ellas|ya|nunca|también|siempre|que)\s+)(lo|la|los|las|le|les|me|te|nos)\s+\w+(o|oy|as|a|amos|an|é|ó|í|aste|aron|es|e|en|aba|ía|ré|rá)\b|\b\w+(ar|er|ir|ndo)(lo|la|los|las|le|les|me|te|nos|selo|sela)\b|^[¡¿]?\w*[áéíó]\w*(me|te|lo|la|nos|le|les|melo|selo|sela)\b/,
  en:"Object pronouns go before a conjugated verb (lo veo) or attach to an infinitive, a gerund or a command (verlo, viéndolo, míralo).",
  es:"Los pronombres van antes del verbo conjugado (lo veo) o pegados al infinitivo/imperativo (verlo, míralo)."},
 {id:"contr", re:/\b(al|del)\b/,
  en:"A + el = al, de + el = del: voy al parque, vengo del trabajo. (Not with él or with la.)",
  es:"A + el = al; de + el = del."},
 {id:"persa", re:/\b(veo|ves|ve|vi|conozco|conoces|conoce|llamo|llama|llamé|visito|visita|ayudo|ayuda|busco|quiero|quiere|espero|espera|invito|invita|cuido|cuida|extraño|echo de menos|trae)\s+a\s+(mi|tu|su|nuestra|nuestro|mis|tus|sus|los|las|la|el|un|una|nadie|alguien|ana|luis|maría|juan|pedro)\b/,
  en:"Personal a: put a before a person who receives the action: veo a mi madre, conozco a Luis.",
  es:"A personal: veo a mi madre, conozco a Luis."},
 {id:"porpara", re:/\b(por(?!\s+favor)|para)\b/,
  en:"Por = cause, exchange, through, by means of, duration (gracias por, por teléfono). Para = purpose, recipient, destination, deadline (para ti, para el lunes).",
  es:"Por = causa, intercambio, medio; para = finalidad, destinatario, destino, plazo."},
 {id:"hace", re:/\bhace\s+(un|una|dos|tres|cuatro|cinco|diez|mucho|poco|años|meses|días|semanas|\d+)\b|\bdesde hace\b/,
  en:"Hace + time = ago (llegó hace una hora). Desde hace + time = for, with something still going on (vivo aquí desde hace un año).",
  es:"Hace + tiempo = ago; desde hace = for (todavía continúa)."},
 {id:"hacetiempo", re:/\bhace\s+(frío|calor|sol|viento|buen tiempo|mal tiempo|mucho frío|mucho calor)\b/,
  en:"Weather uses hacer: hace frío, hace calor, hace sol (it is cold / hot / sunny).",
  es:"El tiempo usa hacer: hace frío, hace sol."},
 {id:"muymucho", re:/\b(muy|mucho|mucha|muchos|muchas)\b/,
  en:"Muy (very) goes with adjectives and adverbs: muy grande. Mucho (a lot, many) goes with nouns and verbs and agrees: mucha agua, muchos libros, trabajo mucho.",
  es:"Muy + adjetivo; mucho/a/os/as + sustantivo o verbo."},
 {id:"comp", re:/\b(más|menos)\s+\w+\s+que\b|\btan\s+\w+\s+como\b|\btanto|tanta|tantos|tantas\b|\b(mejor|peor|mayor|menor)\b/,
  en:"Comparisons: más/menos … que, tan … como, tanto … como. Irregular: mejor, peor, mayor, menor.",
  es:"Comparativos: más/menos … que, tan … como; mejor, peor, mayor, menor."},
 {id:"neg", re:/\bno\s+\w+\s+(nada|nadie|nunca|ningún|ninguna|tampoco)\b|\b(nada|nadie|nunca|tampoco)\b/,
  en:"Spanish uses double negatives: no veo nada, no viene nadie. If nunca/nadie comes first, drop the no: nunca como carne.",
  es:"Doble negación: no veo nada; si nunca va delante, sin no: nunca como carne."},
 {id:"qword", re:/\b(qué|cómo|dónde|adónde|cuándo|cuánto|cuánta|cuántos|cuántas|quién|quiénes|cuál|cuáles|por qué)\b/,
  en:"Question words carry an accent (qué, cómo, dónde, cuándo, cuánto, quién, cuál, por qué), even inside a sentence: no sé dónde está.",
  es:"Los interrogativos llevan tilde: qué, cómo, dónde, cuándo…"},
 {id:"acabar", re:/\b(acabo|acabas|acaba|acabamos|acaban)\s+de\b|\b(vuelvo|vuelve|volvió|volver)\s+a\b|\b(dejé|dejó|dejar|deja)\s+de\b/,
  en:"Verb phrases: acabar de + infinitive = to have just done; volver a = to do again; dejar de = to stop doing.",
  es:"Acabar de = acción reciente; volver a = otra vez; dejar de = parar."},
 {id:"cmd", re:/^[¡¿]?(no\s+)?\w+(a|e|en|an)(me|te|lo|la|nos|le|les|selo|sela)?[,.!]|^[¡¿]?(ven|haz|pon|sal|ten|ve|di|sé|vete|dime|hazlo|ponlo|siéntate|siéntese|pase|espere|firme)\b/,
  en:"Commands: tú uses the él form (habla, come); negatives and usted use the subjunctive (no hables, hable usted). Irregular tú: ven, haz, pon, sal, ten, ve, di.",
  es:"Imperativo: tú = forma de él (habla); negativo y usted = subjuntivo (no hables, hable)."},
 {id:"time", re:/\b(son las|es la|a las|a la)\s+(una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|\d+)\b/,
  en:"Time: es la una, son las dos/tres…; at = a las (a las ocho). Y cuarto, y media, menos cuarto.",
  es:"La hora: es la una, son las dos; a las ocho."}
];
TIP_ES.push(
 {id:"saber", re:/\b(sé|sabes|sabe|sabemos|saben)\b/,
  en:"Saber = to know facts or how to do something (no sé, sé nadar). Yo form is irregular: sé. For people and places use conocer.",
  es:"Saber = datos o habilidades (sé nadar); conocer = personas y lugares."},
 {id:"ir", re:/\b(voy|vas|va|vamos|van)\s+(a|al|en|de)\b|^¡vamos!/,
  en:"Ir (to go) is irregular: voy, vas, va, vamos, van. Use a + place (voy a casa, vamos a la playa) and en + transport (voy en bici).",
  es:"Ir es irregular: voy, vas, va, vamos, van; a + lugar, en + transporte."},
 {id:"adjagr", re:/\b(un|una|unos|unas|el|la|los|las)\s+\w+\s+\w+(o|a|os|as|e|es)\b(?!\s+\w)/,
  en:"Most adjectives go after the noun and agree with it: una casa blanca, los zapatos rojos, un libro interesante.",
  es:"El adjetivo suele ir detrás del sustantivo y concuerda: una casa blanca, los zapatos rojos."},
 {id:"tenerposs", re:/\b(tengo|tienes|tiene|tenemos|tienen|tenía|tuve)\b/,
  en:"Tener = to have. It is irregular: tengo, tienes, tiene, tenemos, tienen.",
  es:"Tener es irregular: tengo, tienes, tiene, tenemos, tienen."},
 {id:"greet", re:/\b(buenos días|buenas tardes|buenas noches|hasta luego|hasta mañana|hasta pronto|bienvenid\w*|mucho gusto|encantad\w*|igualmente)\b/,
  en:"Greetings: buenos días (día is masculine), but buenas tardes / buenas noches (feminine). Hasta = until: hasta luego, hasta mañana. Bienvenido changes for a woman or a group: bienvenida, bienvenidos.",
  es:"Buenos días, pero buenas tardes/noches; hasta luego, hasta mañana; bienvenido/a/os."},
 {id:"tu", re:/\b(tú|usted|ustedes)\b|\bque tengas?\b/,
  en:"Tú is informal (friends, family); usted is polite and uses the él/ella verb form: ¿Y tú? / ¿Y usted?",
  es:"Tú = informal; usted = formal, con la forma de él/ella."},
 {id:"pres", re:/(^[¡¿]?\s*|^[¡¿]?\s*(mi|tu|su|mis|tus|sus|nuestro|nuestra|nuestros|nuestras|el|la|los|las)\s+\w+\s+|\b(yo|tú|él|ella|usted|nosotros|nosotras|ellos|ellas|ustedes|no)\s+)(?!(el|la|los|las|un|una|mi|tu|su|este|esta|ese|esa|muy|más|hoy|ya|no|se|me|te|lo|le|nos|que|y|o|a|en|de|con)\b)\w{2,}(o|as|a|amos|an|es|e|emos|en|imos)\b/,
  en:"Present tense: the ending shows who does it (hablo, hablas, habla, hablamos, hablan), so subject pronouns are usually left out.",
  es:"Presente: la terminación indica la persona (hablo, hablas, habla…), por eso se omite el pronombre."}
);
const TIP_EN = [  // target: English → tips for Spanish speakers (with English text too)
 {id:"doq", re:/^(do|does|did)\b|\b(do|does|did)\s+(you|i|we|they|he|she|it|your|my|his|her|our|their|the)\b|\b(don't|doesn't|didn't|do not|does not|did not)\b|^yes, (i|we|they|he|she) (do|does|did)\b|^no, (i|we|they|he|she) (don't|doesn't|didn't|do not|does not)\b/,
  es:"En inglés las preguntas y negaciones usan do/does/did y el verbo vuelve a la forma base: Does she work? She doesn't work (no “works”).",
  en:"Questions and negatives use do/does/did, and the main verb goes back to its base form: Does she work? She doesn't work."},
 {id:"s3", re:/\b(he|she|it)\s+((usually|always|often|never|sometimes|also|really)\s+)?(?!is|was|has|does|can|will|would|should|must|might)\w+s\b/,
  es:"Con he/she/it el verbo en presente lleva -s: she works, he goes, it rains.",
  en:"With he/she/it, present-tense verbs take -s: she works, he goes."},
 {id:"be", re:/\b(am|is|are|i'm|you're|he's|she's|it's|we're|they're|isn't|aren't)\b/,
  es:"To be = ser y estar a la vez. También se usa para la edad, el hambre y el frío: I am hungry, I am 30.",
  en:"To be covers both ser and estar, and also age, hunger and cold: I am hungry, I am 30."},
 {id:"itis", re:/^(it is|it's|it was|there is|there are|there was|there were)\b/,
  es:"El inglés siempre necesita sujeto: It is cold (Hace frío), It is late (Es tarde). There is/are = hay.",
  en:"English always needs a subject: It is cold. There is / there are = hay."},
 {id:"thereis", re:/\bthere (is|are|was|were|isn't|aren't)\b/,
  es:"There is + singular, there are + plural (hay): there is a cat, there are two cats.",
  en:"There is + singular, there are + plural."},
 {id:"perf", re:/\b(have|has|i've|you've|we've|they've|he's|she's|haven't|hasn't)\s+(\w+\s+)?(been|done|gone|seen|eaten|had|made|taken|written|known|lost|bought|broken|spoken|finished|started|lived|worked|called|arrived|decided|paid|found|met|left)\b/,
  es:"Present perfect (have/has + participio) une el pasado con el presente: I have lost my keys (y todavía no las tengo). Con for/since: I have lived here since 2020.",
  en:"Present perfect (have/has + past participle) links past and present: I have lost my keys."},
 {id:"past", re:/\b(went|saw|ate|bought|took|came|drank|gave|slept|wrote|told|said|made|did|had|was|were|met|found|thought|got|ran|broke|lost|paid|knew)\b/,
  es:"Pasado simple: muchos verbos comunes son irregulares (go → went, see → saw, buy → bought). Se usa para acciones terminadas: yesterday, last week, ago.",
  en:"Past simple: many common verbs are irregular (went, saw, bought). Use it for finished actions."},
 {id:"pastreg", re:/\b(?!(speed|hundred|indeed|tired|married|bored|interested|excited|worried|surprised|scared|closed|crowded|naked|sacred|wicked|bed|need|feed|seed|weed)\b)\w{3,}ed\b/,
  es:"El pasado regular termina en -ed: worked, called, stopped (consonante doble), studied (-y → -ied).",
  en:"Regular past ends in -ed: worked, stopped, studied."},
 {id:"will", re:/\b(will|won't|i'll|you'll|we'll|it'll|going to)\b/,
  es:"Futuro: will para decisiones del momento, promesas y predicciones; going to para planes ya decididos.",
  en:"Future: will for instant decisions, promises and predictions; going to for plans."},
 {id:"modal", re:/\b(cannot|can|can't|could|should|must|might|may|would)\s+(not\s+)?\w+/,
  es:"Después de can, could, should, must, might y would va el verbo en forma base, sin to: I can swim (no “I can to swim”).",
  en:"After modal verbs comes the base form, without to: I can swim."},
 {id:"article", re:/\b(a|an)\s+\w+/,
  es:"A delante de sonido consonante (a car, a university) y an delante de sonido vocal (an apple, an hour). Las profesiones llevan artículo: she is a doctor.",
  en:"A before consonant sounds, an before vowel sounds. Jobs take an article: she is a doctor."},
 {id:"adj", re:/\b(a|an|the|my|your|his|her|our|their)\s+(big|small|new|old|good|bad|red|blue|black|white|long|short|nice|beautiful|interesting|fast|cold|hot|tall|cheap|expensive|young|happy|great)\s+\w+/,
  es:"En inglés el adjetivo va antes del sustantivo y no cambia en plural: a red car, two red cars.",
  en:"Adjectives go before the noun and never take -s: a red car, two red cars."},
 {id:"prep", re:/\b(in|on|at)\s+(the\s+)?(morning|afternoon|evening|night|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend|january|february|march|april|may|june|july|august|september|october|november|december|summer|winter|spring|fall|autumn|\d{4}|\d+|noon|midnight|work|home|school)\b/,
  es:"In/on/at: at + hora (at five), on + día (on Monday), in + mes, año o estación (in May, in 2020, in summer). At home, at work.",
  en:"At + clock time, on + days, in + months/years/seasons."},
 {id:"ing", re:/\b(like|love|hate|enjoy|mind|stop|stopped|finish|finished|avoid|avoids|suggest|keep|kept|quit)\s+\w+ing\b/,
  es:"Después de enjoy, mind, stop, finish, avoid y suggest va el verbo en -ing: I enjoy reading.",
  en:"After enjoy, mind, stop, finish, avoid and suggest use -ing: I enjoy reading."},
 {id:"to", re:/\b(want|wants|wanted|need|needs|decided|hope|promised|learn|would like)\s+to\s+\w+/,
  es:"Después de want, need, decide, hope y would like va to + verbo: I want to go.",
  en:"After want, need, decide, hope and would like use to + verb."},
 {id:"comp", re:/\b\w+er than\b|\bmore \w+ than\b|\bthe \w+est\b|\bthe most\b|\bas \w+ as\b|\b(better|worse|best|worst)\b/,
  es:"Comparativos: adjetivos cortos + -er than (taller than); largos: more … than. Superlativo: the -est / the most. Irregulares: better, worse, best, worst.",
  en:"Short adjectives + -er than, long ones more … than; superlatives the -est / the most."},
 {id:"poss", re:/\b(his|her|its|their)\b/,
  es:"His/her dependen del dueño, no de la cosa: his car (de él), her car (de ella). Its = de una cosa o animal.",
  en:"His/her depend on the owner, not the thing owned."},
 {id:"usedto", re:/\bused to\b/,
  es:"Used to + verbo = lo que hacías antes y ya no (antes vivía…). Negación: didn't use to.",
  en:"Used to + verb = a past habit that has stopped."},
 {id:"quant", re:/\b(some|any|much|many|a few|a little|a lot of|few|little)\b/,
  es:"Much/a little con incontables (much water), many/a few con contables (many books). Some en afirmativas, any en preguntas y negaciones.",
  en:"Much/a little for uncountables, many/a few for countables; some in statements, any in questions and negatives."},
 {id:"cont", re:/\b(am|is|are|was|were|be)\s+\w+ing\b/,
  es:"To be + -ing = acción en curso: I am working (estoy trabajando).",
  en:"Be + -ing = an action in progress: I am working."},
 {id:"pron", re:/\b(me|him|her|us|them)\b/,
  es:"Pronombres de objeto: me, him, her, us, them van después del verbo: I see him (lo veo).",
  en:"Object pronouns (me, him, her, us, them) go after the verb."},
 {id:"cond2", re:/^if\b.*\b(would|will)\b|,\s*(i|we|you|he|she|they) (would|will)\b/,
  es:"If + presente → will (if it rains, I will stay); if + pasado → would (if I had money, I would travel); if + had + participio → would have.",
  en:"If + present → will; if + past → would; if + had done → would have done."}
];

TIP_EN.push(
 {id:"greet", re:/\b(good morning|good afternoon|good evening|good night|see you|goodbye|bye|nice to meet you|pleased to meet you|welcome)\b/,
  es:"Saludos: good morning/afternoon/evening al llegar, good night solo al despedirse o ir a dormir. See you (later/tomorrow) = hasta luego/mañana.",
  en:"Good evening when arriving, good night only when leaving or going to bed."},
 {id:"have", re:/\b(have|has|had)\b/,
  es:"Have = tener (I have, she has). En inglés no se usa have para la edad, el hambre o el frío: I am 30, I am hungry.",
  en:"Have / has = possession. Age, hunger and cold use be: I am 30."},
 {id:"plural", re:/\b(children|men|women|feet|teeth|mice|people|knives|wives|lives|\w+ies|\w+(x|sh|ch|ss)es)\b/,
  es:"Plurales: -s normalmente, -es tras s/x/sh/ch (boxes), -y → -ies (cities), f → ves (knives) e irregulares: children, men, women, feet, teeth, people.",
  en:"Plurals: -es after s/x/sh/ch, -y → -ies, f → ves, and irregulars like children, feet, teeth."},
 {id:"imp", re:/^(please\s+)?(open|close|sit|come|go|turn|listen|look|take|read|write|wait|stop|don't|do not|let's|let us|cross|be|call|tell|give|help|try|remember|speak|answer|repeat|bring|put|show)\b/,
  es:"Órdenes: verbo en forma base sin sujeto (Open the window). Negativo: Don't + verbo. Let's = vamos a…",
  en:"Commands use the base verb with no subject; negative: Don't …; Let's = let us."},
 {id:"like", re:/\b(like|likes|love|loves|hate|hates)\b/,
  es:"Like funciona al revés que gustar: la persona es el sujeto (I like music = me gusta la música). Para cosas en general no se usa artículo: I like dogs.",
  en:"Like: the person is the subject (I like music). No article for things in general."},
 {id:"please", re:/\b(please|thank you|thanks|excuse me|sorry)\b/,
  es:"Cortesía: please va al principio o al final (Two coffees, please). Thank you / thanks, excuse me para llamar la atención y sorry para disculparse.",
  en:"Please goes at the start or end; excuse me to get attention, sorry to apologise."},
 {id:"pres", re:/^((on \w+|today|now|usually|currently),?\s+)?(i|you|we|they|my \w+|our \w+|your \w+|the \w+s)\s+\w+/,
  es:"Presente simple: I/you/we/they + verbo base (I work); solo he/she/it añade -s.",
  en:"Present simple: I/you/we/they + base verb; only he/she/it adds -s."}
);
/* Make \b and \w understand accented letters (á, ñ, ü…) */
for(const list of [TIP_ES, TIP_EN]) for(const r of list){
  const B = "(?:(?<![\\p{L}\\p{N}])(?=[\\p{L}\\p{N}])|(?<=[\\p{L}\\p{N}])(?![\\p{L}\\p{N}]))";
  r.re = new RegExp(r.re.source.replace(/\\b/g, B).replace(/\\w/g, "[\\p{L}\\p{N}_]"), "u");
}
// broad fallbacks go last so specific rules win ties
for(const list of [TIP_ES, TIP_EN]) list.sort((a, b) => (a.id === "pres") - (b.id === "pres"));

function tipsFor(answer, yours, al, segs, skip){
  const rules = al === "es" ? TIP_ES : al === "en" ? TIP_EN : null;
  if(!rules || !answer) return [];
  const low = s => String(s || "").toLowerCase().replace(/[“”"]/g, "");
  const A = low(answer), Y = low(yours);
  const wrong = new Set();
  for(const s of segs || []){ for(const w of (s.b || []).concat(s.y || [])) wrong.add(fbKey(w)); if(s.acc) wrong.add(fbKey(s.acc)); }
  const ui = UI && UI.code === "es" ? "es" : "en";
  const out = [];
  for(const r of rules){
    if(skip && skip.has(r.id)) continue;
    const m = A.match(r.re);
    if(!m) continue;
    const words = m[0].split(/\s+/).map(fbKey);
    const touches = r.id !== "pres" && words.some(w => wrong.has(w));
    const inYours = r.re.test(Y);
    out.push({r, score:(touches ? 3 : 0) + (inYours ? 0 : 1)});
  }
  const MID = /^(ser|estar|hay|pret|imperf|contr|qword|tu|greet|like|ir|past|pastreg|plural|have|adjagr|adj|objpro|muymucho|porpara|quant|poss|tenerposs|prep)$/, LOW = /^(be|article|pron|please|pres)$/;
  const tier = id => LOW.test(id) ? 0 : MID.test(id) ? 1 : 2;
  out.sort((a, b) => (b.score - a.score) || (tier(b.r.id) - tier(a.r.id)));
  const best = out.filter(x => x.score >= 3);
  const pickN = best.length ? best.slice(0, 2) : out.slice(0, 1);
  // avoid near-duplicates (e.g. estar + progressive)
  const seen = new Set(), res = [];
  for(const x of pickN){ if(x.r.id === "estar" && seen.has("prog")) continue; seen.add(x.r.id); res.push(x.r[ui] || x.r.en); }
  return res;
}
