let currentPlayer = 0;
let players = [];
let diceResult = 0;

function startGame() {
    const count = parseInt(document.getElementById("player-count").value);
    players = Array.from({length: count}, (_, i) => ({
        id: i,
        isCPU: i > 0, // Spieler 1 = Mensch, Rest = CPU
        position: 0
    }));
    currentPlayer = 0;
    document.getElementById("game-board").innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.className = 'cell';
        div.id = 'cell-' + i;
        document.getElementById("game-board").appendChild(div);
    }
    updateBoard();
}

function rollDice() {
    diceResult = Math.floor(Math.random() * 6) + 1;
    document.getElementById("dice-result").innerText = diceResult;
    makeMove();
}

function makeMove() {
    let player = players[currentPlayer];
    player.position = (player.position + diceResult) % 100;
    updateBoard();
    currentPlayer = (currentPlayer + 1) % players.length;
}

function updateBoard() {
    document.querySelectorAll(".piece").forEach(p => p.remove());
    players.forEach(p => {
        const piece = document.createElement("div");
        piece.className = "piece " + ["red", "green", "blue", "yellow"][p.id];
        const cell = document.getElementById("cell-" + p.position);
        if (cell) cell.appendChild(piece);
    });
}
