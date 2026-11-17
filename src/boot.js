function sail(id){
  const old = S;
  const past = (old.pastIslands || []).concat(old.islandId ? [old.islandId] : []).slice(-20);
  S = freshState({mode:6, target:old.target, native:old.native, level:old.level, islandId:id, pastIslands:past});
  S.cheat = old.cheat; S.srs = old.srs; S.stats = old.stats;
  S.xp = old.xp; S.badges = old.badges; S.bosses = old.bosses; S.lootCount = old.lootCount;
  undo = null;
  save(); showGame(); runTurn(null);
}
$("sailBtn").addEventListener("click", () => sail(""));
$("nextChips").addEventListener("click", e => { const b = e.target.closest("[data-isl]"); if(b) sail(b.dataset.isl); });
$("feed").addEventListener("click", e => {
  const b = e.target.closest('[data-act="override"]');
  if(!b || !canOverride()) return;
  const u = undo; undo = null;
  Narrator.stop();
  S = u.state;
  runTurn(u.answer, true);
});

/* ===================== Extra interface text for this edition ===================== */
Object.assign(I18N.en, {
  lede:"Mine sentences, build vocab and level up. Your Game Master teaches, tests, and does not sugarcoat.",
  m1d:"Work through a 15-concept syllabus per level and climb the ranks.",
  lvSoon:"More levels arrive with the next content pack.",
  override:"My answer was right",
  islandLabel:"Pick an island, or let the Game Master surprise you.",
  prebuiltTag:"Pre-built edition: no AI calls, so every turn is instant. Progress is saved on this device.",
  evC2:"Top level cleared", evC2T:"You beat the highest level in this pack. Victory lap: the syllabus restarts.",
  evC2W:"Vocab pack cleared", evC2WT:"50 more words down. The onslaught continues.",
  fell:"You fell at {lvl} with {n} concepts cleared.",
  dayStreak:"day streak", totalXp:"total XP", todayGoal:"today's goal", goalDone:"Daily goal reached!", undoTile:"Undo",
  "game.Echo Chamber":"Echo Chamber", "game.Match Madness":"Match Madness", playAudio:"Play", slowAudio:"Slow", echoOn:"Listening games",
  pairMisses:"Slips: {n}", phrasebook:"Phrasebook", back:"Back", search:"Search words and phrases", bookAll:"All", bookTricky:"⚠️ Tricky",
  bookInfo:"{n} words and phrases you have learned in {lang}. Tap one to hear it.", bookEmpty:"Nothing here yet. Play a few rounds and every new word lands in your phrasebook.",
  bookNone:"No matches.", bookMore:"Showing {n} of {d}. Search to narrow it down.",
  backup:"Move progress to another device", backupNote:"Make a code on this device, then paste it on the other one and tap Load. The code holds your saved run, streak, XP and phrasebook.",
  exportBtn:"Make a backup code", copy:"Copy", importBtn:"Load this code", backupMade:"Code ready. Copy it and paste it on your other device.",
  copied:"Copied.", copyFail:"Could not copy automatically. The code is selected: copy it by hand.", importOk:"Progress loaded.", importBad:"That code did not work. Check you copied all of it.",
  b_day3:"Habit forming", b_day3_d:"Play 3 days in a row", b_words100:"Word hoarder", b_words100_d:"100 entries in your phrasebook",
  b_b2:"Upper intermediate", b_b2_d:"Reach level B2", b_echo10:"Good ears", b_echo10_d:"Win 10 listening rounds", b_match5:"Matchmaker", b_match5_d:"Clear 5 match rounds",
  daily:"Daily challenge", fixMistakes:"Fix my mistakes", stats:"Stats", next:"Next", seeResults:"See results", check:"Check",
  dailyTitle:"Daily challenge · {d}", dailyCome:"A new challenge arrives tomorrow. Everyone learning {lang} at {lvl} gets the same 10 questions today.",
  mistakesResult:"You fixed {f} of {n}. {left} still waiting.", noMistakes:"No mistakes saved. Every question you miss in the game lands here, so you can come back and fix it.",
  copyShare:"Copy result", shareCopied:"Copied! Paste it to a friend.", shareHint:"Share your score:",
  statsTitle:"Your stats", stAnswered:"answered", stAccuracy:"accuracy", stBestStreak:"best day streak", stXp:"total XP",
  stLast14:"Correct answers, last 14 days", stByMode:"Accuracy by mode", stTricky:"Your trickiest words", stNone:"Nothing yet. Play a few rounds.",
  stDailyH:"Daily challenges", stDailyLine:"{n} played · best score {b}/10", stMistH:"Mistakes", stMistLine:"{w} waiting · {f} fixed",
  b_daily1:"Daily player", b_daily1_d:"Finish a daily challenge", b_daily10:"Perfect day", b_daily10_d:"Score 10/10 on a daily challenge", b_fixer25:"Bug fixer", b_fixer25_d:"Fix 25 saved mistakes",
  m8n:"Tricky Pairs", m8d:"Words that look or sound alike: este or esto, si or sí, there or their.", "game.Word Duel":"Word Duel",
  m7n:"Conjugation Gym", m7d:"Drill verb forms tense by tense, from the present to the subjunctive.", "game.Verb Forge":"Verb Forge", "game.Time Machine":"Time Machine", "game.Slip Fixer":"Slip Fixer",
  b_conj50:"Verb machine", b_conj50_d:"50 correct conjugations",
  cantListen:"Can't listen right now", echoSkipped:"Swapped for a reading round, no penalty. You can turn listening games off in 🎛️ settings.",
  voices:"Voices", voiceEs:"Spanish voice", voiceEn:"English voice", voiceAuto:"Best available", voiceTest:"Test",
  voiceTip:"Sounds robotic? ⭐ marks the natural-sounding voices. Microsoft Edge has free natural voices on any computer. On iPhone, download an Enhanced or Premium voice in Settings › Accessibility › Spoken Content › Voices. On Android, install Google Speech Services voices."
});
Object.assign(I18N.es, {
  lede:"Practica con frases reales, amplía tu vocabulario y sube de nivel. Tu Game Master enseña, pone a prueba y no endulza nada.",
  m1d:"Avanza por un temario de 15 conceptos por nivel y sube de rango.",
  lvSoon:"Habrá más niveles en el próximo paquete de contenido.",
  override:"Mi respuesta era correcta",
  islandLabel:"Elige una isla o deja que el Game Master te sorprenda.",
  prebuiltTag:"Edición prearmada: no usa IA, así que cada turno es instantáneo. Tu progreso se guarda en este dispositivo.",
  evC2:"Nivel máximo superado", evC2T:"Venciste el nivel más alto de este paquete. Vuelta de honor: el temario vuelve a empezar.",
  evC2W:"Paquete de vocabulario superado", evC2WT:"50 palabras más. La avalancha continúa.",
  fell:"Caíste en {lvl} con {n} conceptos superados.",
  dayStreak:"días de racha", totalXp:"XP total", todayGoal:"meta de hoy", goalDone:"¡Meta diaria cumplida!", undoTile:"Deshacer",
  "game.Echo Chamber":"Cámara de eco", "game.Match Madness":"Parejas locas", playAudio:"Escuchar", slowAudio:"Lento", echoOn:"Juegos de escucha",
  pairMisses:"Fallos: {n}", phrasebook:"Libro de frases", back:"Volver", search:"Busca palabras y frases", bookAll:"Todo", bookTricky:"⚠️ Difíciles",
  bookInfo:"{n} palabras y frases que aprendiste en {lang}. Toca una para escucharla.", bookEmpty:"Todavía no hay nada. Juega unas rondas y cada palabra nueva llegará a tu libro de frases.",
  bookNone:"Sin resultados.", bookMore:"Mostrando {n} de {d}. Busca para filtrar.",
  backup:"Pasar tu progreso a otro dispositivo", backupNote:"Crea un código en este dispositivo, pégalo en el otro y toca Cargar. El código guarda tu partida, racha, XP y libro de frases.",
  exportBtn:"Crear código de respaldo", copy:"Copiar", importBtn:"Cargar este código", backupMade:"Código listo. Cópialo y pégalo en tu otro dispositivo.",
  copied:"Copiado.", copyFail:"No se pudo copiar automáticamente. El código está seleccionado: cópialo a mano.", importOk:"Progreso cargado.", importBad:"Ese código no funcionó. Revisa que lo copiaste completo.",
  b_day3:"Creando el hábito", b_day3_d:"Juega 3 días seguidos", b_words100:"Coleccionista de palabras", b_words100_d:"100 entradas en tu libro de frases",
  b_b2:"Intermedio alto", b_b2_d:"Llega al nivel B2", b_echo10:"Buen oído", b_echo10_d:"Gana 10 rondas de escucha", b_match5:"Celestino", b_match5_d:"Completa 5 rondas de parejas",
  daily:"Reto diario", fixMistakes:"Corregir mis errores", stats:"Estadísticas", next:"Siguiente", seeResults:"Ver resultados", check:"Comprobar",
  dailyTitle:"Reto diario · {d}", dailyCome:"Mañana llega un reto nuevo. Hoy todos los que aprenden {lang} en {lvl} reciben las mismas 10 preguntas.",
  mistakesResult:"Corregiste {f} de {n}. Quedan {left} pendientes.", noMistakes:"No hay errores guardados. Cada pregunta que falles en el juego llega aquí para que puedas corregirla.",
  copyShare:"Copiar resultado", shareCopied:"¡Copiado! Pégalo para un amigo.", shareHint:"Comparte tu puntuación:",
  statsTitle:"Tus estadísticas", stAnswered:"respuestas", stAccuracy:"aciertos", stBestStreak:"mejor racha de días", stXp:"XP total",
  stLast14:"Respuestas correctas, últimos 14 días", stByMode:"Aciertos por modo", stTricky:"Tus palabras más difíciles", stNone:"Nada todavía. Juega unas rondas.",
  stDailyH:"Retos diarios", stDailyLine:"{n} jugados · mejor puntuación {b}/10", stMistH:"Errores", stMistLine:"{w} pendientes · {f} corregidos",
  b_daily1:"Jugador diario", b_daily1_d:"Termina un reto diario", b_daily10:"Día perfecto", b_daily10_d:"Saca 10/10 en un reto diario", b_fixer25:"Cazador de errores", b_fixer25_d:"Corrige 25 errores guardados",
  m8n:"Palabras trampa", m8d:"Palabras que se parecen o suenan igual: there o their, your o you're, si o sí.", "game.Word Duel":"Duelo de palabras",
  m7n:"Gimnasio de verbos", m7d:"Practica las conjugaciones tiempo por tiempo, del presente al subjuntivo.", "game.Verb Forge":"Forja de verbos", "game.Time Machine":"Máquina del tiempo", "game.Slip Fixer":"Corrige el desliz",
  b_conj50:"Máquina de verbos", b_conj50_d:"50 conjugaciones correctas",
  cantListen:"No puedo escuchar ahora", echoSkipped:"Cambiado por una ronda de lectura, sin penalización. Puedes apagar los juegos de escucha en 🎛️ ajustes.",
  voices:"Voces", voiceEs:"Voz en español", voiceEn:"Voz en inglés", voiceAuto:"La mejor disponible", voiceTest:"Probar",
  voiceTip:"¿Suena robótica? ⭐ marca las voces que suenan naturales. Microsoft Edge tiene voces naturales gratis en cualquier computadora. En iPhone, descarga una voz Mejorada o Premium en Ajustes › Accesibilidad › Contenido leído › Voces. En Android, instala las voces de Servicios de voz de Google."
});

Object.assign(I18N.en, {
  path:"Learning path", pathSub:"{lang}: {d} of {n} steps done. Tap the glowing circle to keep going.", pathBtn:"Next: {x}", pathAllDone:"Path complete!",
  unit:"Unit {n}", u_A1:"First steps", u_A2:"Everyday life", u_B1:"Getting fluent", u_B2:"Confident speaker", unitTest:"Unit test",
  start:"START", startLesson:"Start lesson", practiceAgain:"Practice again", lessonInfo:"Lesson {i}: 6 quick questions. Get 4 right to pass, all 6 for a crown 👑.",
  storyInfo:"A short story with {q} questions. Tap any line to see its translation.", testInfo:"10 questions from the whole unit. Get 8 right to pass.",
  jumpHere:"Jump here", jumpInfo:"Already know this? Pass the unit test (8 of 10) to unlock everything up to here.", locked:"Finish the step before this one to unlock it.",
  startTest:"Start test", readStory:"Read story", close:"Close", pathPassed:"Lesson passed! Next step unlocked.", pathPerfect:"Perfect! You earned a crown 👑",
  pathRetry:"Almost. Get 4 of 6 to pass. Try again.", testPassed:"Test passed! Everything up to here is unlocked.", testRetry:"Not yet. You need 8 of 10. Practice a few lessons and try again.",
  backPath:"Back to the path", stories:"Stories", storiesSub:"Short stories in the language you are learning, with questions along the way.",
  storyDone:"Story complete!", storyScore:"{r} of {n} questions right · +{x} XP", continue:"Continue", finish:"Finish", tapTranslate:"Tip: tap a line to see the translation, or 🔊 to hear it.",
  questsTitle:"Daily quests", questsReset:"New quests every day", questDone:"Quest complete! +{x} XP", questsAll:"All quests done! +{x} bonus XP",
  q_correct:"Get {g} answers right", q_xp:"Earn {g} XP", q_combo:"Get {g} right in a row", q_lesson:"Finish {g} path lessons", q_perfect:"Get a perfect lesson",
  q_story:"Read a story", q_daily:"Play the daily challenge", q_fix:"Fix {g} of your mistakes", q_conj:"Conjugate {g} verbs correctly",
  q_tricky:"Get {g} tricky pairs right", q_vocab:"Get {g} words right in Lexicon Onslaught", q_listen:"Get {g} listening rounds right",
  islHide:"Hide it and test me", islHideNote:"Study the phrase first. Once it is hidden you answer from memory.", b_path10:"Trailblazer", b_path10_d:"Complete 10 steps on the learning path", b_story3:"Bookworm", b_story3_d:"Finish 3 stories", b_quest10:"Quest hunter", b_quest10_d:"Complete 10 daily quests",
});
Object.assign(I18N.es, {
  path:"Ruta de aprendizaje", pathSub:"{lang}: {d} de {n} pasos hechos. Toca el círculo brillante para seguir.", pathBtn:"Siguiente: {x}", pathAllDone:"¡Ruta completa!",
  unit:"Unidad {n}", u_A1:"Primeros pasos", u_A2:"La vida diaria", u_B1:"Ganando fluidez", u_B2:"Hablante seguro", unitTest:"Examen de unidad",
  start:"EMPEZAR", startLesson:"Empezar lección", practiceAgain:"Practicar otra vez", lessonInfo:"Lección {i}: 6 preguntas rápidas. Acierta 4 para pasar, las 6 para ganar una corona 👑.",
  storyInfo:"Una historia corta con {q} preguntas. Toca cualquier línea para ver la traducción.", testInfo:"10 preguntas de toda la unidad. Acierta 8 para pasar.",
  jumpHere:"Saltar aquí", jumpInfo:"¿Ya lo sabes? Aprueba el examen de unidad (8 de 10) para desbloquear todo hasta aquí.", locked:"Termina el paso anterior para desbloquear este.",
  startTest:"Empezar examen", readStory:"Leer historia", close:"Cerrar", pathPassed:"¡Lección aprobada! Siguiente paso desbloqueado.", pathPerfect:"¡Perfecto! Ganaste una corona 👑",
  pathRetry:"Casi. Necesitas 4 de 6. Inténtalo otra vez.", testPassed:"¡Examen aprobado! Todo hasta aquí está desbloqueado.", testRetry:"Todavía no. Necesitas 8 de 10. Practica algunas lecciones y vuelve a intentarlo.",
  backPath:"Volver a la ruta", stories:"Historias", storiesSub:"Historias cortas en el idioma que aprendes, con preguntas por el camino.",
  storyDone:"¡Historia completa!", storyScore:"{r} de {n} preguntas correctas · +{x} XP", continue:"Continuar", finish:"Terminar", tapTranslate:"Consejo: toca una línea para ver la traducción, o 🔊 para escucharla.",
  questsTitle:"Misiones diarias", questsReset:"Misiones nuevas cada día", questDone:"¡Misión cumplida! +{x} XP", questsAll:"¡Todas las misiones hechas! +{x} XP extra",
  q_correct:"Acierta {g} respuestas", q_xp:"Gana {g} XP", q_combo:"Acierta {g} seguidas", q_lesson:"Termina {g} lecciones de la ruta", q_perfect:"Haz una lección perfecta",
  q_story:"Lee una historia", q_daily:"Juega el reto diario", q_fix:"Corrige {g} de tus errores", q_conj:"Conjuga {g} verbos bien",
  q_tricky:"Acierta {g} pares engañosos", q_vocab:"Acierta {g} palabras en Avalancha de vocabulario", q_listen:"Acierta {g} rondas de escucha",
  islHide:"Escóndela y ponme a prueba", islHideNote:"Primero estudia la frase. Cuando se esconda, respondes de memoria.", b_path10:"Pionero", b_path10_d:"Completa 10 pasos de la ruta", b_story3:"Ratón de biblioteca", b_story3_d:"Termina 3 historias", b_quest10:"Cazador de misiones", b_quest10_d:"Completa 10 misiones diarias",
});
Object.assign(GAME_ICO, {"Word Duel":"⚖️", "Echo Chamber":"🎧", "Match Madness":"🧩", "Verb Forge":"⚒️", "Time Machine":"⏳", "Slip Fixer":"🩹"});
BADGES.push(
  {id:"day3", ico:"📅", test: () => profile.streak >= 3 && profile.last === profile.today},
  {id:"words100", ico:"📖", test: () => bankCount() >= 100},
  {id:"b2", ico:"🎓", test: s => s.level === "B2" && s.mode !== 6},
  {id:"echo10", ico:"🎧", test: () => profile.echo >= 10},
  {id:"match5", ico:"🧩", test: () => profile.match >= 5},
  {id:"conj50", ico:"🏋️", test: () => profile.conj >= 50},
  {id:"daily1", ico:"📅", test: () => profile.dailyCount >= 1},
  {id:"daily10", ico:"💯", test: () => profile.dailyBest >= 10},
  {id:"fixer25", ico:"🩹", test: () => profile.fixed >= 25},
  {id:"path10", ico:"🗺️", test: () => Object.values(profile.path).reduce((n, P) => n + Object.keys(P).length, 0) >= 10},
  {id:"story3", ico:"📚", test: () => Object.keys(profile.stories).length >= 3},
  {id:"quest10", ico:"🎁", test: () => profile.questsDone >= 10}
);

/* ===================== Boot ===================== */
if(window.__PGM_TEST) window.__pgm = {get Q(){ return Q; }, get S(){ return S; }, set S(v){ S = v; }, setup, expand, canon, first, blank, variantsOf, gradeLocal, numChallenge, enNum, esNum, COURSE, VOCAB, VLIST, VMAP, ISLANDS, NUMSYL, runTurn, startNew, sail, norm, canOverride, profile, exportCode, importCode, bankCount, LEVELS, bestVoice, esForm, enForm, CONJ, ESV, ENV, TRICKY, buildDaily, openDaily, openMistakes, STORIES, pathUnits, pathState, pathFlat, lessonItems, startPathNode, openPath, openStory, advanceStory, ensureQuests, questAdd, renderQuests, openQuiz, checkQ, nextQ};
loadProfile();
initMenu();
(() => {
  let pref = null;
  try{ pref = JSON.parse(localStorage.getItem("pgm-ui") || "null"); }catch(e){}
  if(!pref || !I18N[pref.code]){
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    const hit = UI_LANGS.find(l => l.code === nav) || UI_LANGS[0];
    pref = {code:hit.code, name:hit.name};
  }
  setup.native = pref.name; setup.target = otherLang(pref.name);
  Narrator.init();
  $("echoRow").hidden = !Narrator.available(); $("echoChk").checked = echoOn;
  renderVoices();
  setUiLang(pref.code, pref.name);
  renderReadUi();
  const saved = loadSave();
  if(saved){ S = saved; refreshContinue(); }
})();
