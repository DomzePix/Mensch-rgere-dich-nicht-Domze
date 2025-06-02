let players = [];
let currentPlayer = 0;

function startGame() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < 121; i++) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.id = "cell-" + i;
    board.appendChild(div);
  }

  const count = parseInt(document.getElementById("player-count").value);
  players = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: ["red", "green", "blue", "yellow"][i],
    position: 10 * (i + 1)
  }));
  currentPlayer = 0;
  drawPieces();
}

function drawPieces() {
  document.querySelectorAll(".piece").forEach(p => p.remove());
  players.forEach(p => {
    const div = document.createElement("div");
    div.className = "piece " + p.color;
    const cell = document.getElementById("cell-" + p.position);
    if (cell) cell.appendChild(div);
  });
}

function rollDice() {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice1").innerText = getDiceSymbol(dice1);
  document.getElementById("dice2").innerText = getDiceSymbol(dice2);
  document.getElementById("dice-total").innerText = "Summe: " + (dice1 + dice2);
  movePlayer(dice1 + dice2);
}

function getDiceSymbol(num) {
  const symbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  return symbols[num - 1];
}

function movePlayer(steps) {
  let player = players[currentPlayer];
  player.position = (player.position + steps) % 121;
  drawPieces();
  currentPlayer = (currentPlayer + 1) % players.length;
}
