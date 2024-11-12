let mazeGenerated = false;
document.getElementById('solveBtn').disabled = true;

document.getElementById('generateBtn').addEventListener('click', function () {
    fetch('/generate')
        .then(response => response.json())
        .then(data => {
            drawMaze(data.maze);
            mazeGenerated = true;
            var start = document.getElementById("start");
            start.style.display = "block"; 
            var end = document.getElementById("end");
            end.style.display = "block";
            document.getElementById('solveBtn').disabled = false;
        });
});

document.getElementById('solveBtn').addEventListener('click', function () {
    const start = [0, 0];
    const end = [19, 19];

    fetch('/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end })
    })
        .then(response => response.json())
        .then(data => {
            drawPath(data.path);
        });
});

function drawMaze(maze) {
    const canvas = document.getElementById('mazeBoard');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const cell = maze[y][x];
            const xPos = x * 20;
            const yPos = y * 20;

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;

            if (cell.top) {
                ctx.beginPath();
                ctx.moveTo(xPos, yPos);
                ctx.lineTo(xPos + 20, yPos);
                ctx.stroke();
            }
            if (cell.right) {
                ctx.beginPath();
                ctx.moveTo(xPos + 20, yPos);
                ctx.lineTo(xPos + 20, yPos + 20);
                ctx.stroke();
            }
            if (cell.bottom) {
                ctx.beginPath();
                ctx.moveTo(xPos, yPos + 20);
                ctx.lineTo(xPos + 20, yPos + 20);
                ctx.stroke();
            }
            if (cell.left) {
                ctx.beginPath();
                ctx.moveTo(xPos, yPos);
                ctx.lineTo(xPos, yPos + 20);
                ctx.stroke();
            }
        }
    }
}

function drawPath(path) {
    const canvas = document.getElementById('mazeBoard');
    const ctx = canvas.getContext('2d');
    const lineColor = 'rgba(77, 77, 255, 0.7)';
    const lineWidth = 4;

    let i = 0;
    const delay = 50;

    function animatePath() {
        if (i >= path.length - 1) return;

        const [x1, y1] = path[i];
        const [x2, y2] = path[i + 1];

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(x1 * 20 + 10, y1 * 20 + 10);
        ctx.lineTo(x2 * 20 + 10, y2 * 20 + 10);
        ctx.stroke();

        i++;

        setTimeout(() => {
            requestAnimationFrame(animatePath);
        }, delay);
    }

    animatePath();
}

