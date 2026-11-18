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
Object.assign(I18N.en, {
  n_btn:"Reminders", n_master:"Practice reminders", n_masterD:"A nudge each day to keep learning.", n_time:"Reminder time", n_timeD:"When the daily reminder arrives.",
  n_streak:"Streak saver", n_streakD:"An evening warning if your streak is about to end.", n_quests:"Morning quests", n_questsD:"At 8:30 AM, the day's daily quests.",
  n_recap:"Weekly recap", n_recapD:"Sunday at 6 PM: how your week went.", n_comeback:"Come-back nudges", n_comebackD:"A few friendly messages if you take a break.",
  n_test:"Send a test notification", n_testt:"🔔 Reminders are working!", n_testb:"This is how your {lang} reminders will look.", n_testSoon:"Test notification in 5 seconds.",
  n_denied:"Notifications are blocked. Allow them in your phone or browser settings.", n_blocked:"This browser is blocking notifications for this site. Allow them in the site settings (the icon left of the address).",
  n_noSupport:"This browser cannot show notifications.",
  n_whereApp:"Reminders arrive even when the app is closed. Practicing early cancels that day's reminder.",
  n_whereWeb:"On a computer, reminders appear while the app is open or minimized. Installed in Chrome or Edge, they can also arrive when it is closed. On a phone, the Android app is the most reliable.",
  n_next:"Next: {w} · {x}", n_channel:"Practice reminders", n_channelD:"Daily practice, streak and quest reminders",
  n_banner:"Want a daily reminder so you don't lose your streak?", n_bannerYes:"Remind me", n_bannerNo:"Not now", n_onToast:"Reminders on. See you at {x}!",
  n_r1t:"⏰ Time for {lang}!", n_r1b:"Your 5-minute lesson is waiting. Next up: {x}.", n_r1b0:"Your 5-minute lesson is waiting.",
  n_r2t:"🎮 Your Game Master is waiting", n_r2b:"Five minutes of {lang} is all it takes today.",
  n_r3b:"One quick lesson keeps your {lang} growing.",
  n_r4t:"🎯 Today's quests", n_r4b:"{a}, {b} and {c}. +30 XP each.",
  n_r5t:"📅 New daily challenge", n_r5b:"10 questions, same for everyone today. Can you get 10/10?",
  n_r6t:"📚 Story time", n_r6b:"Read “{x}” in {lang} and answer a few questions.",
  n_r7t:"🧠 Use it or lose it", n_r7b:"A little practice every day beats a lot once a week.",
  n_s1t:"🔥 Keep your {n}-day streak going", n_s2t:"🔥 Make it {n} days in a row",
  n_savet:"🔥 Your {n}-day streak ends at midnight!", n_saveb:"One quick lesson saves it. You've got this.",
  n_lostt:"💔 Your streak ended", n_lostb:"You had {n} days in a row. Start a new streak today!",
  n_qt:"🎯 New quests are ready", n_qb:"Today: {a}, {b} and {c}.",
  n_c1t:"👋 We miss you!", n_c1b:"Your {lang} is still in there. A 5-minute lesson brings it back.",
  n_c2t:"🌱 Words fade without practice", n_c2b:"Jump back in with one short {lang} lesson.",
  n_c3t:"🗺️ Your path is waiting", n_c3b:"Pick up your {lang} right where you left off.",
  n_wkt:"📊 Your week in review", n_wkb:"{d} days of practice and {c} right answers. Keep it up!", n_wkb0:"No practice this week. Start fresh tomorrow!",
});
Object.assign(I18N.es, {
  n_btn:"Recordatorios", n_master:"Recordatorios de práctica", n_masterD:"Un aviso cada día para seguir aprendiendo.", n_time:"Hora del recordatorio", n_timeD:"Cuándo llega el recordatorio diario.",
  n_streak:"Salvar la racha", n_streakD:"Un aviso por la noche si tu racha está por terminar.", n_quests:"Misiones por la mañana", n_questsD:"A las 8:30, las misiones del día.",
  n_recap:"Resumen semanal", n_recapD:"Domingo a las 6 PM: cómo te fue la semana.", n_comeback:"Avisos de regreso", n_comebackD:"Unos mensajes amables si te tomas un descanso.",
  n_test:"Enviar una notificación de prueba", n_testt:"🔔 ¡Los recordatorios funcionan!", n_testb:"Así se verán tus recordatorios de {lang}.", n_testSoon:"Notificación de prueba en 5 segundos.",
  n_denied:"Las notificaciones están bloqueadas. Permítelas en los ajustes del teléfono o del navegador.", n_blocked:"Este navegador bloquea las notificaciones de este sitio. Permítelas en la configuración del sitio (el icono a la izquierda de la dirección).",
  n_noSupport:"Este navegador no puede mostrar notificaciones.",
  n_whereApp:"Los recordatorios llegan aunque la app esté cerrada. Si practicas temprano, se cancela el recordatorio de ese día.",
  n_whereWeb:"En la computadora, los recordatorios aparecen mientras la app está abierta o minimizada. Instalada en Chrome o Edge, también pueden llegar con la app cerrada. En el teléfono, la app de Android es la más fiable.",
  n_next:"Próximo: {w} · {x}", n_channel:"Recordatorios de práctica", n_channelD:"Recordatorios de práctica diaria, racha y misiones",
  n_banner:"¿Quieres un recordatorio diario para no perder tu racha?", n_bannerYes:"Recuérdame", n_bannerNo:"Ahora no", n_onToast:"Recordatorios activados. ¡Nos vemos a las {x}!",
  n_r1t:"⏰ ¡Hora de {lang}!", n_r1b:"Tu lección de 5 minutos te espera. Siguiente: {x}.", n_r1b0:"Tu lección de 5 minutos te espera.",
  n_r2t:"🎮 Tu Game Master te espera", n_r2b:"Hoy bastan cinco minutos de {lang}.",
  n_r3b:"Una lección rápida hace crecer tu {lang}.",
  n_r4t:"🎯 Misiones de hoy", n_r4b:"{a}, {b} y {c}. +30 XP cada una.",
  n_r5t:"📅 Nuevo reto diario", n_r5b:"10 preguntas, las mismas para todos hoy. ¿Sacarás 10/10?",
  n_r6t:"📚 Hora del cuento", n_r6b:"Lee “{x}” en {lang} y responde unas preguntas.",
  n_r7t:"🧠 Lo que no se usa, se olvida", n_r7b:"Un poco cada día vale más que mucho una vez por semana.",
  n_s1t:"🔥 Mantén tu racha de {n} días", n_s2t:"🔥 Que sean {n} días seguidos",
  n_savet:"🔥 ¡Tu racha de {n} días termina a medianoche!", n_saveb:"Una lección rápida la salva. ¡Tú puedes!",
  n_lostt:"💔 Tu racha terminó", n_lostb:"Llevabas {n} días seguidos. ¡Empieza una nueva racha hoy!",
  n_qt:"🎯 Nuevas misiones listas", n_qb:"Hoy: {a}, {b} y {c}.",
  n_c1t:"👋 ¡Te extrañamos!", n_c1b:"Tu {lang} sigue ahí. Una lección de 5 minutos lo despierta.",
  n_c2t:"🌱 Las palabras se olvidan sin práctica", n_c2b:"Vuelve con una lección corta de {lang}.",
  n_c3t:"🗺️ Tu ruta te espera", n_c3b:"Retoma tu {lang} justo donde lo dejaste.",
  n_wkt:"📊 Tu semana en resumen", n_wkb:"{d} días de práctica y {c} respuestas correctas. ¡Sigue así!", n_wkb0:"Esta semana no practicaste. ¡Empieza de nuevo mañana!",
});
Object.assign(I18N.en, {
  m1d:"Master a full CEFR level: grammar, everyday topics and real-life communication, with spaced review. Then climb to the next level.",
  m2d:"Stay on one CEFR level and keep practising all of it: grammar, topics and communication.",
  evLvlT:"You mastered all of {prev}. The next level starts now.",
  strand_g:"Grammar", strand_t:"Topics and vocabulary", strand_f:"Communication",
  cefrMastery:"{lvl} mastery: {p}%", cefrHow:"Each lesson is taught once, then you must recall it correctly twice in later rounds. ●●● = mastered.",
  dotsTip:"Taught · recalled once · mastered", mixT:"Mixed review", mixB:"A quick drill from another part of this level.",
  mix_7:"verb forms", mix_8:"tricky pairs", mix_4:"numbers", mixIn:"Every few rounds, a mixed drill: {x}.",
});
Object.assign(I18N.es, {
  m1d:"Domina un nivel completo del MCER: gramática, temas cotidianos y comunicación real, con repaso espaciado. Luego sube al siguiente nivel.",
  m2d:"Quédate en un nivel del MCER y practícalo entero: gramática, temas y comunicación.",
  evLvlT:"Dominaste todo el {prev}. Empieza el siguiente nivel.",
  strand_g:"Gramática", strand_t:"Temas y vocabulario", strand_f:"Comunicación",
  cefrMastery:"Dominio del {lvl}: {p}%", cefrHow:"Cada lección se enseña una vez y luego debes recordarla bien dos veces en rondas posteriores. ●●● = dominada.",
  dotsTip:"Enseñada · recordada una vez · dominada", mixT:"Repaso mixto", mixB:"Un ejercicio rápido de otra parte de este nivel.",
  mix_7:"formas verbales", mix_8:"pares engañosos", mix_4:"números", mixIn:"Cada pocas rondas, un ejercicio mixto: {x}.",
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
if(window.__PGM_TEST) window.__pgm = {get Q(){ return Q; }, get S(){ return S; }, set S(v){ S = v; }, setup, expand, canon, first, blank, variantsOf, gradeLocal, numChallenge, enNum, esNum, COURSE, VOCAB, VLIST, VMAP, ISLANDS, NUMSYL, runTurn, startNew, sail, norm, canOverride, profile, exportCode, importCode, bankCount, LEVELS, bestVoice, esForm, enForm, CONJ, ESV, ENV, TRICKY, buildDaily, openDaily, openMistakes, STORIES, pathUnits, pathState, pathFlat, lessonItems, startPathNode, openPath, openStory, advanceStory, ensureQuests, questAdd, renderQuests, openQuiz, checkQ, nextQ, buildSchedule, reschedule, setNotify, questsForDay, updateNotifyBanner, webTick, sylHtml, cefrOrder};
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
