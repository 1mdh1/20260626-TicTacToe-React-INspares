import { useState } from "react"; // useState ist ein React Hook, der es ermöglicht, den Zustand in funktionalen Komponenten zu verwalten

function Square({ value, onSquareClick, isDarkMode }) {
  const colorClass = (() => {
    switch (value) { // je nachdem, ob das Feld X, O oder leer ist, wird die Farbe angepasst
      case "X":
        return "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"; //wenn X, dann cyan
      case "O":
        return "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]"; //wenn O, dann rose
      default:
        return isDarkMode ? "text-slate-100" : "text-slate-800";// Standardfarbe für leere Felder
    }
  })();

  return (
    <button 
      className={`h-24 w-24 rounded-2xl text-5xl font-black transition-all duration-200 active:scale-95 flex items-center justify-center border ${
        isDarkMode
          ? "bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800" // button aussehen im Dark Mode
          : "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-sm"// button aussehen im Light Mode
      } ${colorClass}`} 
      onClick={onSquareClick} // onClick event, das die Funktion onSquareClick aufruft, wenn der Button geklickt wird
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, resetGame, isDarkMode }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) { //  Wenn es bereits einen Gewinner gibt oder das Feld schon besetzt ist, wird kein weiterer Zug erlaubt
      return;
    }
    const nextSquares = squares.slice();// "Kopie" des aktuellen Spielfelds erstellen
    if (xIsNext) {
      nextSquares[i] = "X"; // wenn X am zug ist, wird das Feld mit "X" markiert
    } else {
      nextSquares[i] = "O"; // wenn O am zug ist, wird das Feld mit "O" markiert
    }
    onPlay(nextSquares); // das "neue" spielfeld wird weitergegeben
  }

  const winner = calculateWinner(squares); // Gewinner wird festgestellt, falls vorhanden (s.u.)(l.202)
  const isDraw = !winner && squares.every(sq => sq !== null); // Überprüfung auf Unentschieden: Wenn es keinen Gewinner gibt und alle Felder besetzt sind, ist es ein Unentschieden

  let status; // statusanzeige, die je nach spielstand angepasst wird
  if (winner) {
    status = "Winner: " + winner; // gewinner wird angezeigt
  } else if (isDraw) {
    status = "Unentschieden!"; // unentschieden wird angezeigt
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O"); // anzeige, wer als nächstes dran ist (wenn kein gewinner und kein unentschieden)
  }

  return (
    <div className="flex flex-col items-center"> 
      {/* Status-Pille */}
      <div className={`mb-6 px-6 py-2.5 rounded-full text-lg font-bold border transition-all duration-300 ${
        winner 
          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-bounce" // wenn es einen gewinner gibt, wird die anzeige grün
          : isDraw
            ? "bg-amber-500/20 border-amber-500/40 text-amber-400" // wenn es ein unentschieden gibt, wird die anzeige gelb
            : isDarkMode
              ? "bg-slate-800/80 border-slate-700 text-slate-300" // im dark mode, wird die anzeige dunkel
              : "bg-slate-200/80 border-slate-300 text-slate-700" // im light mode, wird die anzeige hell
      }`}>
        {status}
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-3 gap-3 p-4 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/30 border-slate-800/50" // im dark mode, wird das grid (der hintergrund vom spielfeld) dunkel
          : "bg-slate-100/55 border-slate-200" // im light mode, wird das grid hell
      }`}>
        {squares.map((square, index) => ( // für jedes feld im spielfeld wird ein square component erstellt
          <Square 
            key={index} // key ist wichtig für die performance, damit react weiß, welches element sich geändert hat
            value={square} // value ist entweder "X", "O" oder null
            onSquareClick={() => handleClick(index)} // onSquareClick ist die funktion, die aufgerufen wird, wenn das feld angeklickt wird
            isDarkMode={isDarkMode} // isDarkMode wird an das Square component weitergegeben, damit es weiß, ob es im Dark Mode oder Light Mode ist
          />
        ))}
      </div>

      {/* Neustart-Button */}
      <button 
        className="mt-8 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all duration-200 tracking-wide"
        onClick={resetGame} // neustart button mit design
      >
        NEUSTART
      </button>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // historie des Spiels, initialisiert mit einem leeren Spielfeld
  const [currentMove, setCurrentMove] = useState(0); // aktueller Zug, initialisiert mit 0 (Start des Spiels)
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark Mode, initialisiert mit true (Dark Mode ist standardmäßig aktiviert)

  const xIsNext = currentMove % 2 === 0; // Überprüfung, ob X am Zug ist (wenn currentMove gerade ist, ist X am Zug)
  const currentSquares = history[currentMove]; // aktuelles Spielfeld, das dem aktuellen Zug entspricht

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // neue Historie wird erstellt, indem die Historie bis zum aktuellen Zug genommen wird und das neue Spielfeld hinzugefügt wird
    setHistory(nextHistory); // Historie wird aktualisiert
    setCurrentMove(nextHistory.length - 1); // aktueller Zug wird auf den letzten Zug der neuen Historie gesetzt
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]); // Historie wird auf ein leeres Spielfeld zurückgesetzt
    setCurrentMove(0); // aktueller Zug wird auf 0 zurückgesetzt
  }

  function jumpTo(nextMove) { 
    setCurrentMove(nextMove); // aktueller Zug wird auf den gewünschten Zug gesetzt
  }

  const moves = history.map((squares, move) => {
    const isCurrent = move === currentMove; // Überprüfung, ob der Zug der aktuelle Zug ist
    const description = move > 0 ? "Gehe zu Zug #" + move : "Gehe zum Start"; // Beschreibung des Zuges, entweder "Gehe zu Zug #X" oder "Gehe zum Start", je nachdem, ob es der erste Zug ist oder nicht
    
    return (
      <li key={move} className="mb-2">
        <button 
          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
            isCurrent // ist es der aktuelle Zug 
              ? isDarkMode
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" // Er bekommt einen dunkel-violetten Hintergrund mit hellblauer Schrift
                : "bg-indigo-500/10 text-indigo-700 border-indigo-500/30" // Er bekommt einen hell-violetten Hintergrund mit dunkelblauer Schrift
              : isDarkMode
                ? "bg-slate-800/40 text-slate-400 border-slate-850 hover:bg-slate-800/80 hover:border-slate-700" // Er bekommt ein dunkles Grau, das beim Hovern leicht aufleuchtet
                : "bg-slate-100 text-slate-650 border-slate-200 hover:bg-slate-200 hover:border-slate-300" // Er bekommt ein helles Grau, das beim Hovern etwas dunkler wird
          }`}
          onClick={() => jumpTo(move)} // springt zu dem Zug, der angeklickt wurde
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-300 ${
      isDarkMode 
        ? "bg-black bg-gradient-to-br from-black via-slate-950 to-neutral-900 text-slate-100" // Hintergrundfarbe im Dark Mode
        : "bg-slate-50 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-950" // Hintergrundfarbe im Light Mode
    }`}>
      
      <button
        onClick={() => setIsDarkMode(!isDarkMode)} // button zum umschalten zwischen dark mode und light mode
        className={`absolute top-6 right-6 px-4 py-2 rounded-full font-bold text-sm border shadow-sm transition-all active:scale-95 cursor-pointer ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800" // button aussehen im dark mode
            : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100" // button aussehen im light mode
        }`}
      >
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"} {/*text, welcher im button steht */}
      </button>

      {/* Haupt-Glaskarte */}
      <div className={`flex flex-col lg:flex-row gap-12 p-10 rounded-[32px] border shadow-2xl backdrop-blur-md max-w-4xl w-full items-center lg:items-start lg:justify-center transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/45 border-slate-800/80" // im dark mode wird die glaskarte dunkel
          : "bg-white/80 border-slate-200" // im light mode wird die glaskarte hell
      }`}>
        
        <div>{/*überschrift*/}
          <h1 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent tracking-widest"> 
            TIC TAC TOE
          </h1>
          <Board //Board component wird hier eingebunden und alle notwendigen Komponenten werden übergeben
            xIsNext={xIsNext} // gibt an, ob X am Zug ist
            squares={currentSquares} // aktuelles Spielfeld wird übergeben
            onPlay={handlePlay} // gibt die Funktion handlePlay weiter, die aufgerufen wird, wenn ein Spieler einen Zug macht
            resetGame={resetGame} // gibt die Funktion resetGame weiter, die aufgerufen wird, wenn das Spiel zurückgesetzt wird
            isDarkMode={isDarkMode} // gibt an, ob der Dark Mode aktiviert ist, damit das Board entsprechend gestylt werden kann
          />
        </div>
        
        {/* Historie */}
        <div className="w-full lg:w-64 flex flex-col">
          <h2 className={`text-xl font-bold mb-4 border-b pb-2 transition-colors ${
            isDarkMode ? "text-slate-300 border-slate-800" : "text-slate-700 border-slate-200" // Überschrift für die Historie, die je nach Modus angepasst wird
          }`}>
            Spielverlauf
          </h2>
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar"> {/* Container für die Historie, der eine maximale Höhe hat und bei Überlauf scrollt*/}
            <ol>{moves}</ol>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function calculateWinner(squares) { // Funktion zur Berechnung des Gewinners
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //alle möglichen Gewinnkombinationen (Reihen, Spalten, Diagonalen)
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) { //for schleife, die alle Gewinnkombinationen durchgeht
    const [a, b, c] = lines[i]; // a, b und c sind die platzhalter der Felder, die überprüft werden
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //wenn das Feld a nicht leer ist und die Felder a, b und c gleich sind, dann gibt es einen Gewinner
      return squares[a]; // gibt den Gewinner zurück (entweder "X" oder "O")
    }
  }
  return null; // wenn es keinen Gewinner gibt, wird null zurückgegeben
}