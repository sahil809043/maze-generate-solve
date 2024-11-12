from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

WIDTH, HEIGHT = 20, 20 
maze = []

def initialize_maze():
    global maze
    maze = [[{'top': True, 'right': True, 'bottom': True, 'left': True} for _ in range(WIDTH)] for _ in range(HEIGHT)]

def generate_maze_dfs(x, y, visited):
    directions = [(0, -1, 'top', 'bottom'), (0, 1, 'bottom', 'top'), (-1, 0, 'left', 'right'), (1, 0, 'right', 'left')]
    random.shuffle(directions) 

    for dx, dy, wall_curr, wall_next in directions:
        nx, ny = x + dx, y + dy
        if 0 <= nx < WIDTH and 0 <= ny < HEIGHT and (nx, ny) not in visited:
            maze[y][x][wall_curr] = False
            maze[ny][nx][wall_next] = False
            visited.add((nx, ny))
            generate_maze_dfs(nx, ny, visited)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['GET'])
def generate():
    initialize_maze()
    generate_maze_dfs(0, 0, {(0, 0)})
    return jsonify({'maze': maze})

@app.route('/solve', methods=['POST'])
def solve():
    data = request.get_json()
    start = tuple(data['start'])
    end = tuple(data['end'])
    path = find_shortest_path(start, end)
    return jsonify({'path': path})

def find_shortest_path(start, end):
    queue = [(start, [start])]
    visited = set()

    while queue:
        (x, y), path = queue.pop(0)
        if (x, y) == end:
            return path

        visited.add((x, y))
        neighbors = get_neighbors(x, y)

        for nx, ny in neighbors:
            if (nx, ny) not in visited:
                queue.append(((nx, ny), path + [(nx, ny)]))

    return []

def get_neighbors(x, y):
    directions = {'top': (0, -1), 'bottom': (0, 1), 'left': (-1, 0), 'right': (1, 0)}
    neighbors = []

    for direction, (dx, dy) in directions.items():
        nx, ny = x + dx, y + dy
        if 0 <= nx < WIDTH and 0 <= ny < HEIGHT and not maze[y][x][direction]:
            neighbors.append((nx, ny))

    return neighbors


if __name__ == '__main__':
    app.run(debug=True)
