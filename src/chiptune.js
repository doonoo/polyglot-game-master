/* ===================== NES-style soundtrack =====================
   Replaces the simple background loops with an 8-bit sound chip in the style of the NES:
   two pulse channels (12.5 / 25 / 50% duty), a 4-bit stepped triangle for bass and kicks,
   and an LFSR noise channel for drums. All tunes are original compositions written for
   this game, one per mode, plus short victory and game-over jingles.

   Track notation: one bar = 16 tokens (16th notes) separated by spaces.
     lead / harm:  "E5" note, "-" hold the previous note, "." rest
     bass:         "R" root, "O" octave, "5" fifth, "3" third, "7" seventh, "-" hold, "." rest
     arp:          "0".."4" = chord tone (4 = root an octave up), "-" hold, "." rest
     drums:        k kick, s snare, h hat, o open hat, x crash, r rim (combine: "kh")
   ch: one chord per bar, or two separated by a space ("C D" = C then D halfway). */
Object.assign(I18N.en, {track:"Soundtrack", trkAuto:"Auto (by mode)", nowPlaying:"Now playing",
  trk_title:"Polyglot Overture", trk_quest:"Sentence Quest", trk_brawl:"Street Grammar Brawl", trk_island:"Island Hopper Calypso",
  trk_boss:"Boss of the Verbs", trk_rush:"Beat the Clock", trk_dungeon:"Tricky Dungeon", trk_story:"Story Time", trk_arcade:"Word Arcade",
  trk_victory:"Victory!", trk_gameover:"Game Over", trk_cafe:"Paris Café", trk_samba:"Rio Samba", trk_lantern:"Lantern Festival", trk_oasis:"Desert Oasis"});
Object.assign(I18N.es, {track:"Banda sonora", trkAuto:"Automática (según el modo)", nowPlaying:"Sonando",
  trk_title:"Obertura Políglota", trk_quest:"La búsqueda de frases", trk_brawl:"Pelea callejera de gramática", trk_island:"Calipso de las islas",
  trk_boss:"El jefe de los verbos", trk_rush:"Contra el reloj", trk_dungeon:"La mazmorra tramposa", trk_story:"Hora del cuento", trk_arcade:"Arcade de palabras",
  trk_victory:"¡Victoria!", trk_gameover:"Fin del juego", trk_cafe:"Café de París", trk_samba:"Samba de Río", trk_lantern:"Festival de los faroles", trk_oasis:"Oasis del desierto"});

const CHIP_TRACKS = {
  title:{bpm:126, lead:.25, loop:["A","B","A"], sec:{
    A:{ch:["C","G","Am","F G"],
       lead:["C5 - - - G4 - C5 - E5 - - - G5 - - -", "F5 - E5 - D5 - - - B4 - - - G4 - - -", "A4 - C5 - E5 - A5 - - - G5 - E5 - - -", "F5 - - - E5 - D5 - D5 - - - . . . ."],
       arp:"0 1 2 4 2 1 0 1 0 1 2 4 2 1 0 1", bass:"R . R . O . R . R . R . O . R .",
       drum:["k . h . s . h . k . h k s . h .", "k . h . s . h . k . h k s . s s"]},
    B:{ch:["F","G","Em Am","Dm G"],
       lead:["A5 - - - G5 - F5 - C5 - - - F5 - A5 -", "B5 - - - A5 - G5 - D5 - - - G5 - B5 -", "G5 - - - E5 - B4 - C5 - - - E5 - A5 -", "F5 - - - D5 - A4 - B4 - - - D5 - G5 -"],
       arp:"0 2 4 2 0 2 4 2 0 2 4 2 0 2 4 2", bass:"R . . R . . R . R . . R . R O .",
       drum:["k . h . s . h . k . h k s . h .", "k . h . s . h k k . s . s s s s"]}}},

  quest:{bpm:116, lead:.25, loop:["A","A2","B","A2"], sec:{
    A:{ch:["G","Em","C","D"],
       lead:["B4 - D5 - G5 - - - F#5 - G5 - A5 - B5 -", "G5 - - - E5 - - - B4 - - - E5 - - -", "E5 - - - G5 - E5 - C5 - - - D5 - E5 -", "F#5 - - - - - A5 - - - F#5 - D5 - - -"],
       arp:"0 . 2 . 1 . 2 . 0 . 2 . 1 . 4 .", bass:"R . . . 5 . . . R . . . 5 . O .", drum:["k . h . s . h h k . h . s . h ."]},
    A2:{ch:["G","Em","C","D G"],
       lead:["B4 - D5 - G5 - - - F#5 - G5 - A5 - B5 -", "G5 - - - E5 - - - B4 - - - E5 - - -", "E5 - - - G5 - E5 - C5 - - - D5 - E5 -", "D5 - - - F#5 - A5 - G5 - - - - - . ."],
       arp:"0 . 2 . 1 . 2 . 0 . 2 . 1 . 4 .", bass:"R . . . 5 . . . R . . . 5 . O .", drum:["k . h . s . h h k . h . s . h .", "k . h . s . h h k . s . s s s s"]},
    B:{ch:["C","D","Bm Em","Am D"],
       lead:["G5 - - - E5 - G5 - C6 - - - B5 - A5 -", "A5 - - - F#5 - D5 - - - E5 - F#5 - A5 -", "B5 - - - F#5 - D5 - E5 - - - G5 - B5 -", "C6 - - - A5 - E5 - F#5 - - - D5 - . ."],
       arp:"0 1 2 1 0 1 2 1 0 1 2 1 0 1 2 4", bass:"R . R . 5 . R . R . R . 5 . O .", drum:["k . h . s . h h k . h k s . h ."]}}},

  brawl:{bpm:142, lead:.25, harmDuty:.125, loop:["A","A2","B","A2"], sec:{
    A:{ch:["Em","Em","C D","Em"],
       lead:["E5 - - B4 - - E5 - G5 - F#5 - E5 - D5 -", "E5 - - - - - B4 - D5 - E5 - G5 - A5 -", "G5 - - E5 - - C5 - A5 - - F#5 - - D5 -", "E5 - - - - - - - . . B4 - D5 - D#5 -"],
       arp:"0 2 1 2 0 2 1 2 0 2 1 2 0 2 1 2", bass:"R . R O . R O . R . R O . R O R",
       drum:["k . h . s . h . k . k . s . h h"]},
    A2:{ch:["Em","Em","C D","Em"],
       lead:["E5 - - B4 - - E5 - G5 - F#5 - E5 - D5 -", "E5 - - - - - B4 - D5 - E5 - G5 - A5 -", "G5 - - E5 - - C5 - A5 - - F#5 - - D5 -", "E5 - - - B5 - - - E5 - . . . . . ."],
       arp:"0 2 1 2 0 2 1 2 0 2 1 2 0 2 1 2", bass:"R . R O . R O . R . R O . R O R",
       drum:["k . h . s . h . k . k . s . h h", "k . h . s . h . k . k . s . h h", "k . h . s . h . k . k . s . h h", "k . s . s . k . s s . s s s s s"]},
    B:{ch:["Am","Am","C","B7"],
       lead:["A5 - - - G5 - E5 - . E5 G5 - A5 - C6 -", "B5 - A5 - G5 - E5 - - - - - D5 - E5 -", "G5 - - - E5 - G5 - C6 - - - B5 - G5 -", "F#5 - - - D#5 - F#5 - B5 - - - A5 - F#5 -"],
       arp:"0 1 2 1 0 1 2 1 0 1 2 1 0 1 2 3", bass:"R . R . O . R . R . R . 7 . O .",
       drum:["k . h k s . h . k . k . s . h h", "k . h k s . h . k . k . s . s s"]}}},

  island:{bpm:108, lead:.5, leadVol:.07, loop:["A","B"], sec:{
    A:{ch:["F","Bb","C","F"],
       lead:[". . A5 - C6 - A5 - F5 - - G5 - A5 - .", "Bb5 - - - D6 - Bb5 - F5 - - - D5 - F5 -", "E5 - G5 - C6 - - - Bb5 - A5 - G5 - E5 -", "F5 - - - - - - - C5 - D5 - E5 - . ."],
       arp:"0 . 1 2 . 1 0 . 0 . 1 2 . 1 4 .", bass:"R . . 5 . . R . R . . 5 . . O .", drum:["k . h r . h k . k . h r . h k h"]},
    B:{ch:["Dm","Gm","C","F"],
       lead:["D6 - - - A5 - F5 - D5 - - - F5 - A5 -", "Bb5 - - - G5 - D5 - - - Bb4 - D5 - G5 -", "E5 - - - G5 - - - C6 - - - Bb5 - G5 -", "A5 - - - F5 - - - . . . . C5 - E5 -"],
       arp:"0 . 1 2 . 1 0 . 0 . 1 2 . 1 4 .", bass:"R . . 5 . . R . R . . 5 . . O .", drum:["k . h r . h k . k . h r . h k h", "k . h r . h k . k . r r . r k h"]}}},

  boss:{bpm:156, lead:.25, harmDuty:.125, loop:["A","B"], sec:{
    A:{ch:["Dm","Dm","Bb","A"],
       lead:["D5 - D5 - F5 - D5 - A5 - - - G#5 - A5 -", "C6 - Bb5 - A5 - F5 - D5 - - - E5 - F5 -", "D6 - - - Bb5 - F5 - D5 - F5 - Bb5 - D6 -", "C#6 - - - A5 - E5 - C#5 - - - E5 - G5 -"],
       arp:"0 1 2 1 0 1 2 1 0 1 2 1 0 1 2 1", bass:"R . R R O . R R R . R R O . 5 O", drum:["k . h k s . h k k . h k s . s s"]},
    B:{ch:["Gm","A","Dm Bb","A"],
       lead:["G5 - - Bb5 - - D6 - - C6 - Bb5 - A5 - G5", "A5 - - - - - E5 - A5 - C#6 - E6 - - -", "F6 - E6 - D6 - A5 - Bb5 - D6 - F6 - D6 -", "E6 - - - C#6 - - - A5 - - - . . . ."],
       arp:"0 1 2 3 0 1 2 3 0 1 2 3 0 1 2 3", bass:"R . R R O . R R R . R R O . 5 O",
       drum:["k . h k s . h k k . h k s . s s", "k . h k s . h k k . h k s . s s", "k . h k s . h k k . h k s . s s", "k s k s k s s s k s s s s s s s"]}}},

  rush:{bpm:168, lead:.125, leadVol:.08, harmDuty:.25, loop:["A","B"], sec:{
    A:{ch:["Am","G","F","E"],
       lead:["A5 - E5 - A5 - C6 - B5 - A5 - G5 - E5 -", "D5 - G5 - B5 - D6 - C6 - B5 - G5 - D5 -", "C5 - F5 - A5 - C6 - A5 - F5 - C5 - A4 -", "B4 - E5 - G#5 - B5 - E6 - - - . . . ."],
       arp:"0 2 4 2 0 2 4 2 0 2 4 2 0 2 4 2", bass:"R . O . R . O . R . O . R . O .", drum:["k h h h s h h h k h k h s h h h"]},
    B:{ch:["Am","G","F","E"],
       lead:["E6 - - - C6 - - - A5 - - - C6 - E6 -", "D6 - - - B5 - - - G5 - - - B5 - D6 -", "C6 - - - A5 - - - F5 - - - A5 - C6 -", "B5 - G#5 - E5 - G#5 - B5 - D6 - E6 - - -"],
       arp:"0 2 4 2 0 2 4 2 0 2 4 2 0 2 4 2", bass:"R . O . R . O . R . O . R . O .", drum:["k h h h s h h h k h k h s h h h", "k h h h s h h h k h k h s s s s"]}}},

  dungeon:{bpm:104, lead:.5, leadVol:.065, loop:["A","B"], sec:{
    A:{ch:["Cm","Ab","Fm","G7"],
       lead:["C5 - - - Eb5 - - - G5 - - - - - Ab5 -", "G5 - - - Eb5 - - - C5 - - - - - - -", "F5 - - - Ab5 - - - C6 - - - Bb5 - Ab5 -", "G5 - - - - - - - B4 - - - D5 - F5 -"],
       arp:"0 . 1 . 2 . 1 . 0 . 1 . 2 . 4 .", bass:"R . . . . . . . R . . O . . 5 .", drum:["k . . . h . . . s . . . h . . h"]},
    B:{ch:["Cm","Bb","Ab","G"],
       lead:["Eb6 - - - D6 - C6 - G5 - - - - - - -", "F5 - - - Bb5 - - - D6 - - - C6 - Bb5 -", "C6 - - - Ab5 - Eb5 - C5 - - - Eb5 - Ab5 -", "B5 - - - G5 - - - D5 - - - B4 - - -"],
       arp:"0 . 1 . 2 . 1 . 0 . 1 . 2 . 4 .", bass:"R . . . . . . . R . . O . . 5 .", drum:["k . . . h . . . s . . . h . . h", "k . . . h . . . s . . . s . s s"]}}},

  story:{bpm:84, lead:.5, leadVol:.06, arpVol:.035, drumVol:.6, loop:["A","B"], sec:{
    A:{ch:["D","Bm","G","A"],
       lead:["F#5 - - - - - A5 - - - F#5 - E5 - D5 -", "D5 - - - - - - - B4 - - - C#5 - D5 -", "B4 - - - D5 - - - G5 - - - F#5 - E5 -", "E5 - - - - - - - - - - - . . . ."],
       arp:"0 1 2 4 2 1 0 1 0 1 2 4 2 1 0 1", bass:"R . . . . . . . 5 . . . . . . .", drum:["k . . . . . . . s . . . . . h ."]},
    B:{ch:["G","A","F#m Bm","G A"],
       lead:["D6 - - - B5 - - - G5 - - - A5 - B5 -", "C#6 - - - A5 - - - E5 - - - F#5 - G5 -", "A5 - - - F#5 - C#5 - D5 - - - F#5 - B5 -", "B5 - - - G5 - - - A5 - - - - - - -"],
       arp:"0 1 2 4 2 1 0 1 0 1 2 4 2 1 0 1", bass:"R . . . . . . . 5 . . . . . . .", drum:["k . . . . . . . s . . . . . h ."]}}},

  arcade:{bpm:130, lead:.25, loop:["A","B"], sec:{
    A:{ch:["F","Dm","Bb","C"],
       lead:["C5 - F5 - A5 - F5 - C6 - A5 - F5 - A5 -", "D5 - F5 - A5 - D6 - - - C6 - A5 - - -", "Bb4 - D5 - F5 - Bb5 - - - A5 - G5 - F5 -", "E5 - - - G5 - - - C6 - - - . . . ."],
       arp:"0 . 2 . 4 . 2 . 0 . 2 . 4 . 2 .", bass:"R . O . R . O . R . O . 5 . O .", drum:["k . h . s . h . k . h . s . h h"]},
    B:{ch:["Bb","C","Am Dm","Gm C"],
       lead:["D6 - - - Bb5 - - - F5 - - - Bb5 - D6 -", "E6 - - - C6 - - - G5 - - - C6 - E6 -", "C6 - - - A5 - E5 - D6 - - - A5 - F5 -", "G5 - - - Bb5 - D6 - C6 - - - - - - -"],
       arp:"0 . 2 . 4 . 2 . 0 . 2 . 4 . 2 .", bass:"R . O . R . O . R . O . 5 . O .", drum:["k . h . s . h . k . h . s . h h", "k . h . s . h . k . s . s s s s"]}}},

  cafe:{bpm:120, lead:.5, leadVol:.07, loop:["A","B"], sec:{
    A:{ch:["C","Am","Dm G","C"],
       lead:["E5 - - - G5 - E5 - C5 - - - E5 - D5 -", "C5 - - - A4 - C5 - E5 - - - A5 - G5 -", "F5 - - - E5 - D5 - B4 - - - D5 - G5 -", "E5 - - - - - - - C5 - - - . . . ."],
       arp:". . 1 2 . . 1 2 . . 1 2 . . 1 2", bass:"R . . . 5 . . . R . . . 5 . . .", drum:["k . h . s . h . k . h . s . h ."]},
    B:{ch:["F","C","D7","G7"],
       lead:["A5 - - - G5 - F5 - C5 - - - F5 - A5 -", "G5 - - - E5 - C5 - G4 - - - C5 - E5 -", "F#5 - - - D5 - A4 - C5 - - - D5 - F#5 -", "G5 - - - F5 - D5 - B4 - - - D5 - . ."],
       arp:". . 1 2 . . 1 2 . . 1 2 . . 1 2", bass:"R . . . 5 . . . R . . . 5 . . .", drum:["k . h . s . h . k . h . s . h .", "k . h . s . h . k . s . s s s s"]}}},

  samba:{bpm:132, lead:.25, loop:["A","B"], sec:{
    A:{ch:["C","Am","Dm","G"],
       lead:["E5 . G5 - . E5 . C5 - . D5 - E5 . . .", "C5 . E5 - . C5 . A4 - . B4 - C5 . . .", "D5 . F5 - . A5 . F5 - . E5 - D5 . . .", "B4 - - - D5 - G5 - - - F5 - D5 - . ."],
       arp:". 0 . 2 . 1 . 2 . 0 . 2 . 1 . 4", bass:"R . . R . . 5 . R . . R . . 5 .", drum:["k h r h k h r h k h r h k h r r"]},
    B:{ch:["F","G","Em Am","Dm G"],
       lead:["A5 . C6 - . A5 . F5 - . G5 - A5 . . .", "B5 . D6 - . B5 . G5 - . A5 - B5 . . .", "G5 - E5 - B4 - . . A5 - E5 - C5 - . .", "F5 - - - D5 - A4 - B4 - D5 - G5 - - -"],
       arp:". 0 . 2 . 1 . 2 . 0 . 2 . 1 . 4", bass:"R . . R . . 5 . R . . R . . 5 .", drum:["k h r h k h r h k h r h k h r r", "k h r h k h r h k s k s s s s s"]}}},

  lantern:{bpm:100, lead:.5, leadVol:.07, loop:["A","B"], sec:{
    A:{ch:["D","Bm","G","A"],
       lead:["F#5 - A5 - B5 - - - A5 - F#5 - E5 - - -", "D5 - - - E5 - F#5 - B4 - - - A4 - - -", "B4 - D5 - E5 - - - D5 - B4 - A4 - - -", "E5 - - - F#5 - E5 - D5 - - - . . . ."],
       arp:"0 . 2 . 4 . 2 . 0 . 2 . 4 . 2 .", bass:"R . . . . . 5 . R . . . O . . .", drum:["k . . . r . . . k . r . r . . ."]},
    B:{ch:["G","A","F#m Bm","G A"],
       lead:["D6 - - - B5 - A5 - B5 - - - D6 - E6 -", "E6 - - - D6 - B5 - A5 - - - - - - -", "F#5 - A5 - E5 - - - F#5 - D5 - B4 - - -", "D5 - E5 - D5 - B4 - A4 - - - - - . ."],
       arp:"0 . 2 . 4 . 2 . 0 . 2 . 4 . 2 .", bass:"R . . . . . 5 . R . . . O . . .", drum:["k . . . r . . . k . r . r . . .", "k . . . r . . . k . r . r r r r"]}}},

  oasis:{bpm:112, lead:.25, leadVol:.08, loop:["A","B"], sec:{
    A:{ch:["D","D","Gm","D"],
       lead:["D5 - Eb5 - F#5 - - - G5 - F#5 - Eb5 - D5 -", "A5 - - - Bb5 - A5 - G5 - F#5 - Eb5 - D5 -", "G5 - - - Bb5 - A5 - G5 - - - F#5 - G5 -", "F#5 - Eb5 - D5 - - - - - - - . . . ."],
       arp:"0 . . . 2 . . . 0 . . . 2 . . .", bass:"R . . R . . R . R . . . R . . .", drum:["k . r . . r k . k . r . . r r ."]},
    B:{ch:["Cm","D","Gm","D"],
       lead:["C6 - Bb5 - A5 - G5 - Eb5 - - - G5 - C6 -", "A5 - - - F#5 - - - D5 - Eb5 - F#5 - A5 -", "Bb5 - - - A5 - G5 - D5 - - - G5 - Bb5 -", "A5 - G5 - F#5 - Eb5 - D5 - - - . . . ."],
       arp:"0 . . . 2 . . . 0 . . . 2 . . .", bass:"R . . R . . R . R . . . R . . .", drum:["k . r . . r k . k . r . . r r .", "k . r . . r k . k r k r r r r r"]}}},

  victory:{bpm:150, lead:.25, once:true, next:"title", loop:["A"], sec:{
    A:{ch:["C","G","C"],
       lead:["C5 - E5 - G5 - C6 - - - G5 - C6 - - -", "D6 - - - B5 - - - D6 - - - G6 - - -", "E6 - - - - - - - - - - - . . . ."],
       arp:"0 1 2 4 0 1 2 4 0 1 2 4 0 1 2 4", bass:"R . . . 5 . . . R . . . 5 . O .",
       drum:["k . . . s . . . k . . . s . s s", "k . . . s . . . k . s . s s s s", "x . . . . . . . . . . . . . . ."]}}},

  gameover:{bpm:84, lead:.5, once:true, next:"title", loop:["A"], sec:{
    A:{ch:["Am","E","Am"],
       lead:["E5 - - - D#5 - - - D5 - - - C#5 - - -", "C5 - - - B4 - - - G#4 - - - B4 - - -", "A4 - - - - - - - - - - - . . . ."],
       arp:"0 . . . . . . . . . . . . . . .", bass:"R . . . . . . . R . . . . . . .",
       drum:[". . . . . . . . . . . . . . . .", ". . . . . . . . . . . . . . . .", "k . . . . . . . . . . . . . . ."]}}}
};
const CHIP_JUKEBOX = ["title", "quest", "brawl", "island", "boss", "rush", "dungeon", "story", "arcade", "cafe", "samba", "lantern", "oasis"];

const Chip = (() => {
  const NOTE = {C:0, D:2, E:4, F:5, G:7, A:9, B:11};
  const acc = s => s === "#" ? 1 : s === "b" ? -1 : 0;
  function midi(tok){
    const m = /^([A-G])([#b]?)(\d)$/.exec(tok);
    if(!m) throw new Error("bad note " + tok);
    return 12 * (+m[3] + 1) + NOTE[m[1]] + acc(m[2]);
  }
  const QUAL = {"":[0,4,7], m:[0,3,7], "7":[0,4,7,10], m7:[0,3,7,10], maj7:[0,4,7,11], dim:[0,3,6], sus4:[0,5,7], aug:[0,4,8]};
  function chord(name){
    const m = /^([A-G])([#b]?)(.*)$/.exec(name);
    if(!m || !QUAL[m[3]]) throw new Error("bad chord " + name);
    return {root:(NOTE[m[1]] + acc(m[2]) + 12) % 12, iv:QUAL[m[3]]};
  }
  const bars = s => s.trim().split(/\s+/);
  const pick = (v, i) => Array.isArray(v) ? v[i % v.length] : v;

  /* Turn a track into one list of events per step for a whole pass of the loop */
  function compile(id){
    const tr = CHIP_TRACKS[id], steps = [];
    let lead = [], arp = [], bass = [], drum = [];
    for(const sn of tr.loop){
      const sec = tr.sec[sn];
      sec.ch.forEach((chs, b) => {
        const cs = chs.split(" ").map(chord);
        const lt = bars(sec.lead[b]), at = bars(pick(sec.arp, b)), bt = bars(pick(sec.bass, b)), dt = bars(pick(sec.drum, b));
        for(const arr of [lt, at, bt, dt]) if(arr.length !== 16) throw new Error(`${id}/${sn} bar ${b + 1}: ${arr.length} steps`);
        for(let s = 0; s < 16; s++){
          const c = cs[cs.length > 1 && s >= 8 ? 1 : 0];
          lead.push(lt[s]);
          // arpeggio register around C4, bass around C3
          const tones = c.iv.map(i => i + c.root), ab = c.root >= 7 ? 48 : 60, bb = c.root >= 5 ? 36 : 48;
          const a = at[s];
          arp.push(/^\d$/.test(a) ? String(ab + (+a < tones.length && +a < 4 ? tones[+a] : tones[0] + 12)) : a);
          const k = bt[s], off = {R:0, O:12, "5":7, "3":c.iv[1], "7":c.iv[3] !== undefined ? c.iv[3] : 10}[k];
          bass.push(off !== undefined ? String(bb + c.root + off) : k);
          drum.push(dt[s]);
        }
      });
    }
    const L = lead.length;
    for(let i = 0; i < L; i++) steps.push([]);
    // melodic channels: count how long each note is held
    const melodic = (toks, chn, isNum) => {
      for(let i = 0; i < L; i++){
        const tk = toks[i]; if(tk === "." || tk === "-") continue;
        let len = 1; while(i + len < L && toks[i + len] === "-") len++;
        steps[i].push({ch:chn, m:isNum ? +tk : midi(tk), len});
      }
    };
    melodic(lead, "lead", false); melodic(arp, "arp", true); melodic(bass, "bass", true);
    drum.forEach((d, i) => { if(d !== ".") for(const c of d) steps[i].push({ch:"drum", d:c}); });
    return {id, tr, steps, L, sd:60 / tr.bpm / 4};
  }

  let ctx = null, master = null, duckG = null, waves = {}, noiseBuf = null, built = {};
  let on = true, vol = 0.5, timer = null, cur = null, pos = 0, next = 0, wanted = "title", fixed = "auto", moodPend = false;
  try{
    on = localStorage.getItem("pgm-music") !== "off";
    const v = parseFloat(localStorage.getItem("pgm-music-vol")); if(!isNaN(v)) vol = v;
    fixed = localStorage.getItem("pgm-track") || "auto";
  }catch(e){}
  if(fixed !== "auto" && !CHIP_TRACKS[fixed]) fixed = "auto";
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);

  function ensure(){
    if(ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return false;
    try{ ctx = new AC(); }catch(e){ return false; }
    master = ctx.createGain(); master.gain.value = vol * 0.32;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 9000;   // soften the harsh top like a TV speaker
    duckG = ctx.createGain();
    master.connect(lp).connect(duckG).connect(ctx.destination);
    // pulse waves with NES duty cycles
    const N = 48;
    for(const d of [.125, .25, .5]){
      const re = new Float32Array(N + 1), im = new Float32Array(N + 1);
      for(let n = 1; n <= N; n++) re[n] = 2 / (n * Math.PI) * Math.sin(n * Math.PI * d);
      waves[d] = ctx.createPeriodicWave(re, im);
    }
    // the NES triangle is 32 steps of a 4-bit counter: slightly buzzy, unmistakable
    { const M = 1024, seq = [], re = new Float32Array(N + 1), im = new Float32Array(N + 1);
      for(let i = 15; i >= 0; i--) seq.push(i); for(let i = 0; i < 16; i++) seq.push(i);
      const x = new Float32Array(M); for(let k = 0; k < M; k++) x[k] = seq[Math.floor(k * 32 / M)] / 7.5 - 1;
      for(let n = 1; n <= N; n++){ let a = 0, b = 0; for(let k = 0; k < M; k++){ a += x[k] * Math.cos(2 * Math.PI * n * k / M); b += x[k] * Math.sin(2 * Math.PI * n * k / M); } re[n] = 2 * a / M; im[n] = 2 * b / M; }
      waves.tri = ctx.createPeriodicWave(re, im); }
    // 15-bit LFSR noise, like the real chip
    { const len = ctx.sampleRate; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate); const d = noiseBuf.getChannelData(0); let r = 1;
      for(let i = 0; i < len; i++){ const fb = (r ^ (r >> 1)) & 1; r = (r >> 1) | (fb << 14); d[i] = (r & 1) ? -0.8 : 0.8; } }
    return true;
  }
  function build(id){ return built[id] || (built[id] = compile(id)); }

  function osc(wave, f, t){ const o = ctx.createOscillator(); o.setPeriodicWave(wave); o.frequency.setValueAtTime(f, t); return o; }
  function pulse(m, t, dur, duty, v, vib){
    const o = osc(waves[duty], mf(m), t), g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + 0.006);
    g.gain.linearRampToValueAtTime(v * 0.62, t + Math.min(0.18, dur * 0.6));     // NES-style decay to a held level
    g.gain.setValueAtTime(v * 0.62, t + Math.max(0.02, dur - 0.03));
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    if(vib && dur > 0.32){
      const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.8;
      lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(18, t + 0.3);
      l.connect(lg).connect(o.detune); l.start(t); l.stop(t + dur + 0.02);
    }
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function tri(m, t, dur, v){
    const o = osc(waves.tri, mf(m), t), g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.004);
    g.gain.setValueAtTime(v, t + Math.max(0.01, dur - 0.012)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(t, dur, v, rate, hp){
    const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = noiseBuf; s.playbackRate.value = rate;
    let n = s; if(hp){ const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = hp; s.connect(f); n = f; }
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    n.connect(g).connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }
  function drum(d, t, k){
    if(d === "k"){
      const o = osc(waves.tri, 160, t), g = ctx.createGain();
      o.frequency.exponentialRampToValueAtTime(42, t + 0.11);
      g.gain.setValueAtTime(0.5 * k, t); g.gain.linearRampToValueAtTime(0.0001, t + 0.13);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.15);
      noise(t, 0.02, 0.12 * k, 0.25, 0);
    }
    else if(d === "s"){ noise(t, 0.14, 0.24 * k, 0.45, 0); const o = osc(waves.tri, 220, t), g = ctx.createGain(); o.frequency.exponentialRampToValueAtTime(120, t + 0.06); g.gain.setValueAtTime(0.18 * k, t); g.gain.linearRampToValueAtTime(0.0001, t + 0.07); o.connect(g).connect(master); o.start(t); o.stop(t + 0.09); }
    else if(d === "h") noise(t, 0.035, 0.09 * k, 1, 5000);
    else if(d === "o") noise(t, 0.16, 0.08 * k, 1, 4000);
    else if(d === "x") noise(t, 0.9, 0.16 * k, 0.8, 1500);
    else if(d === "r") pulse(96, t, 0.03, .5, 0.05 * k, false);
  }

  function playStep(i, t){
    const tr = cur.tr, sd = cur.sd;
    for(const e of cur.steps[i]){
      if(e.ch === "lead") pulse(e.m, t, e.len * sd * 0.94, tr.lead || .25, tr.leadVol || .085, true);
      else if(e.ch === "arp") pulse(e.m, t, Math.min(e.len * sd, 0.4) * 0.9, tr.harmDuty || .125, tr.arpVol || .04, false);
      else if(e.ch === "bass") tri(e.m, t, e.len * sd * 0.92, .26);
      else drum(e.d, t, tr.drumVol || 1);
    }
  }
  function beat(t, big){
    const ms = Math.max(0, (t - ctx.currentTime) * 1000);
    setTimeout(() => { if(!document.hidden) document.dispatchEvent(new CustomEvent("pgm-beat", {detail:{big}})); }, ms);
  }
  function schedule(){
    if(!cur) return;
    while(next < ctx.currentTime + 0.12){
      if(pos >= cur.L){
        if(cur.tr.once){ play(fixed !== "auto" ? fixed : cur.tr.next, true); continue; }
        pos = 0;
      }
      playStep(pos, next);
      if(pos % 4 === 0) beat(next, pos % 16 === 0);
      next += cur.sd; pos++;
    }
  }
  function announce(id){
    if(window.__PGM_TEST) return;
    document.dispatchEvent(new CustomEvent("pgm-track", {detail:{id, name:t("trk_" + id)}}));
  }
  function play(id, quiet){
    if(!CHIP_TRACKS[id]) return;
    if(!ctx){ cur = {id}; return; }
    cur = build(id); pos = 0;
    next = Math.max(next, ctx.currentTime + 0.06);
    if(!quiet && timer) announce(id);
  }
  function start(){
    if(!on || !ensure()) return;
    if(ctx.state === "suspended") ctx.resume();
    if(timer) return;
    const first = !cur || !cur.steps;
    cur = build(fixed !== "auto" ? fixed : (cur && cur.id) || wanted);
    if(first) pos = 0;
    next = ctx.currentTime + 0.08;
    timer = setInterval(schedule, 25);
    announce(cur.id);
  }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }
  document.addEventListener("visibilitychange", () => { if(!ctx) return; if(document.hidden) ctx.suspend(); else if(on && timer){ ctx.resume(); next = Math.max(next, ctx.currentTime + 0.05); } });

  return {
    start, stop, compile, isOn: () => on, getVol: () => vol, current: () => cur && cur.id, fixed: () => fixed,
    toggle(){ on = !on; try{ localStorage.setItem("pgm-music", on ? "on" : "off"); }catch(e){} if(on) start(); else stop(); return on; },
    setVol(v){ vol = v; try{ localStorage.setItem("pgm-music-vol", String(v)); }catch(e){} if(master) master.gain.setTargetAtTime(v * 0.32, ctx.currentTime, 0.05); },
    /* syncMood's wrappers can set two moods in one go (the generic one, then the language's own tune),
       so settle on the last one and only restart when it differs from what's already playing */
    setMood(m){
      if(!CHIP_TRACKS[m]) return;
      wanted = m;
      if(fixed !== "auto" || moodPend) return;
      moodPend = true;
      Promise.resolve().then(() => { moodPend = false; if(fixed === "auto" && (!cur || cur.id !== wanted)) play(wanted); });
    },
    setFixed(id){
      fixed = CHIP_TRACKS[id] ? id : "auto";
      try{ localStorage.setItem("pgm-track", fixed); }catch(e){}
      play(fixed !== "auto" ? fixed : wanted);
    },
    duck(d){ if(ctx && duckG) duckG.gain.setTargetAtTime(d ? 0.25 : 1, ctx.currentTime, 0.15); }
  };
})();

/* Swap the old loops out: everything already talks to Music, so it now drives the chip */
Object.assign(Music, {start:Chip.start, isOn:Chip.isOn, getVol:Chip.getVol, toggle:Chip.toggle, setVol:Chip.setVol, setMood:Chip.setMood, duck:Chip.duck});

/* Which tune fits where */
syncMood = function(){
  let m = "title";
  const vis = id => { const el = $(id); return el && !el.hidden; };
  if(vis("over") && S) m = S.status === "gameover" ? "gameover" : "victory";
  else if(vis("storyPage") || vis("storiesPage")) m = "story";
  else if(S && vis("game")){
    if(S.current && S.current.plan && S.current.plan.boss) m = "boss";
    else if(S.clock === "attack") m = "rush";
    else if(S.mode === 3) m = "brawl";
    else if(S.mode === 6) m = "island";
    else if(S.mode === 4 || S.mode === 5) m = "arcade";
    else if(S.mode === 7 || S.mode === 8) m = "dungeon";
    else m = "quest";
  }
  Music.setMood(m);
};
showOnly = wrap("showOnly", "chiptune", showOnly, orig => function(id){ const r = orig.apply(this, arguments); try{ syncMood(); }catch(e){} return r; });

/* Settings: pick a tune, or let the game choose */
(() => {
  const row = document.createElement("label");
  row.className = "srow";
  row.innerHTML = `<span>🎼 <span data-i18n="track">${esc(t("track"))}</span></span><select id="trackSel" class="tracksel"></select>`;
  const sfx = $("sfxChk").closest(".srow");
  $("settingsPanel").insertBefore(row, sfx);
  const fill = () => {
    $("trackSel").innerHTML = `<option value="auto">${esc(t("trkAuto"))}</option>` + CHIP_JUKEBOX.map(id => `<option value="${id}">♪ ${esc(t("trk_" + id))}</option>`).join("");
    $("trackSel").value = Chip.fixed();
  };
  fill();
  $("trackSel").addEventListener("change", () => { Chip.setFixed($("trackSel").value); if(Music.isOn()) Music.start(); });
  applyI18n = wrap("applyI18n", "chiptune", applyI18n, orig => function(){ const r = orig.apply(this, arguments); fill(); return r; });
})();
