let players = [];
let currentPlayer = 0;
let rolledNumber = 0;
const colors = ['red', 'green', 'blue', 'yellow'];
const maxSteps = 40;

function startGame() {
  createBoard();
  const count = parseInt(document.getElementById("player-count").value);
  players = [];

  for (let i = 0; i < count; i++) {
    let figs = [];
    for (let j = 0; j < 6; j++) {
      figs.push({ id: j, position: -1, finished: false }); // -1 = im Haus
    }
    players.push({ id: i, color: colors[i], figures: figs, finishedCount: 0 });
  }

  currentPlayer = 0;
  rolledNumber = 0;
  updateTurnIndicator();
  drawFigures();
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = '';
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
      const id = row * 11 + col;
      const div = document.createElement("div");
      div.className = 'cell';

      if (row < 4 && col < 4) div.classList.add("home-red");
      else if (row < 4 && col > 6) div.classList.add("home-green");
      else if (row > 6 && col < 4) div.classList.add("home-blue");
      else if (row > 6 && col > 6) div.classList.add("home-yellow");
      else if (row === 5 || col === 5) div.classList.add("path");
      else div.classList.add("goal");

      div.id = `cell-${id}`;
      board.appendChild(div);
    }
  }
}

function drawFigures() {
  document.querySelectorAll(".figure").forEach(f => f.remove());

  players.forEach((player, pIdx) => {
    player.figures.forEach((fig, fIdx) => {
      if (fig.finished) return;
      const el = document.createElement("div");
      el.className = `figure ${player.color}`;
      el.onclick = () => tryMoveFigure(pIdx, fIdx);

      let row = pIdx < 2 ? 1 : 9;
      let col = pIdx % 2 === 0 ? 1 + fIdx % 3 : 9 - (fIdx % 3);
      if (fig.position >= 0) {
        row = 5;
        col = (5 + fig.position) % 11;
        if (fig.position >= maxSteps) {
          row = pIdx * 3;
          col = 5;
        }
      }

      const target = document.getElementById(`cell-${row * 11 + col}`);
      if (target) target.appendChild(el);
    });
  });
}

function rollDice() {
  rolledNumber = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice").innerText = getDiceSymbol(rolledNumber);
  document.getElementById("dice-output").innerText = "Ergebnis: " + rolledNumber;
}

function getDiceSymbol(n) {
  return ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][n - 1];
}

function updateTurnIndicator() {
  const player = players[currentPlayer];
  document.getElementById("turn-indicator").innerText = "Spieler: " + player.color;
}

function tryMoveFigure(pIdx, fIdx) {
  if (pIdx !== currentPlayer || rolledNumber === 0) return;

  const fig = players[pIdx].figures[fIdx];

  // Figur rausbringen
  if (fig.position === -1 && rolledNumber === 6) {
    fig.position = 0;
  } else if (fig.position >= 0 && fig.position + rolledNumber <= maxSteps) {
    fig.position += rolledNumber;

    // Rauswerfen
    players.forEach((opponent, oIdx) => {
      if (oIdx === pIdx) return;
      opponent.figures.forEach(opFig => {
        if (opFig.position === fig.position) {
          opFig.position = -1;
        }
      });
    });

    // Ziel erreicht?
    if (fig.position === maxSteps) {
      fig.finished = true;
      players[pIdx].finishedCount++;
    }

    // Sieg prüfen
    if (players[pIdx].finishedCount === 6) {
      document.getElementById("turn-indicator").innerHTML =
        `<div class="winner">🎉 Spieler ${players[pIdx].color} hat gewonnen!</div>`;
      return;
    }
  } else {
    return; // Ungültiger Zug
  }

  drawFigures();

  // Nur bei 6 darf man nochmal
  if (rolledNumber !== 6) {
    currentPlayer = (currentPlayer + 1) % players.length;
  }

  rolledNumber = 0;
  updateTurnIndicator();
}