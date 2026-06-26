import { useState } from "react";

function Square({ value, onSquareClick, isDarkMode }) {
  // Symbole X und O bekommen je nach Modus passende Farben
  const colorClass = value === "X"
    ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
    : "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]";

  return (
    <button 
      className={`h-24 w-24 rounded-2xl text-5xl font-black transition-all duration-200 active:scale-95 flex items-center justify-center border ${
        isDarkMode
          ? "bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
          : "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-sm"
      } ${colorClass}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, resetGame, isDarkMode }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(sq => sq !== null);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Unentschieden!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="flex flex-col items-center">
      {/* Status-Pille */}
      <div className={`mb-6 px-6 py-2.5 rounded-full text-lg font-bold border transition-all duration-300 ${
        winner 
          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-bounce" 
          : isDraw
            ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
            : isDarkMode
              ? "bg-slate-800/80 border-slate-700 text-slate-300"
              : "bg-slate-200/80 border-slate-300 text-slate-700"
      }`}>
        {status}
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-3 gap-3 p-4 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/30 border-slate-800/50"
          : "bg-slate-100/55 border-slate-200"
      }`}>
        {squares.map((square, index) => (
          <Square 
            key={index}
            value={square} 
            onSquareClick={() => handleClick(index)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Neustart-Button */}
      <button 
        className="mt-8 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all duration-200 tracking-wide"
        onClick={resetGame}
      >
        NEUSTART
      </button>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true); // Umschalt-State

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // Hier lag der Fehler (jumpTo war vorhin gelöscht)
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const isCurrent = move === currentMove;
    const description = move > 0 ? "Gehe zu Zug #" + move : "Gehe zum Start";
    
    return (
      <li key={move} className="mb-2">
        <button 
          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
            isCurrent 
              ? isDarkMode
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                : "bg-indigo-500/10 text-indigo-700 border-indigo-500/30"
              : isDarkMode
                ? "bg-slate-800/40 text-slate-400 border-slate-850 hover:bg-slate-800/80 hover:border-slate-700"
                : "bg-slate-100 text-slate-650 border-slate-200 hover:bg-slate-200 hover:border-slate-300"
          }`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-300 ${
      isDarkMode 
        ? "bg-black bg-gradient-to-br from-black via-slate-950 to-neutral-900 text-slate-100" 
        : "bg-slate-50 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-950"
    }`}>
      
      {/* Dark Mode Umschalter oben rechts */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-6 right-6 px-4 py-2 rounded-full font-bold text-sm border shadow-sm transition-all active:scale-95 cursor-pointer ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800"
            : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
        }`}
      >
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Haupt-Glaskarte */}
      <div className={`flex flex-col lg:flex-row gap-12 p-10 rounded-[32px] border shadow-2xl backdrop-blur-md max-w-4xl w-full items-center lg:items-start lg:justify-center transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/45 border-slate-800/80"
          : "bg-white/80 border-slate-200"
      }`}>
        
        <div>
          <h1 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent tracking-widest">
            TIC TAC TOE
          </h1>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            resetGame={resetGame}
            isDarkMode={isDarkMode}
          />
        </div>
        
        {/* Historie */}
        <div className="w-full lg:w-64 flex flex-col">
          <h2 className={`text-xl font-bold mb-4 border-b pb-2 transition-colors ${
            isDarkMode ? "text-slate-300 border-slate-800" : "text-slate-700 border-slate-200"
          }`}>
            Spielverlauf
          </h2>
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            <ol>{moves}</ol>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
