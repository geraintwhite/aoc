const fs = require('fs')

const example = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getMap = (input) => {
  const guard = { x: 0, y: 0 }
  const map = input.map((line, y) => {
    const row = line.split('')
    const x = row.indexOf('^')
    if (x > -1) {
      guard.x = x
      guard.y = y
      row[x] = '.'
    }
    return row
  })
  return { guard, map }
}

const directions = {
  '^': { y: -1, x: 0 },
  '>': { y: 0, x: 1 },
  'v': { y: 1, x: 0 },
  '<': { y: 0, x: -1 },
}

const getNextPos = (guard, direction) => {
  return { 
    x: guard.x + directions[direction].x,
    y: guard.y + directions[direction].y,
  }
}

const getKey = (guard) => {
  return `${guard.y}-${guard.x}`
}

const moveIterative = (map, guard, direction) => {
  const pos = {...guard, d: direction}
  const visited = {}
  while (true) {
    const nextPos = getNextPos(pos, pos.d)
    if (visited[getKey(nextPos)]?.includes(pos.d)) {
      return { visited, loop: true }
    }
    const nextCell = map[nextPos.y]?.[nextPos.x]
    if (!nextCell) {
      return { visited, loop: false }
    }
    if (nextCell === '.') {
      visited[getKey(nextPos)] = [...visited[getKey(nextPos)] || [], pos.d]
      pos.x = nextPos.x
      pos.y = nextPos.y
    } else {
      const ds = Object.keys(directions)
      pos.d = ds[(ds.indexOf(pos.d) + 1) % ds.length]
    }
  }
}

const part1 = (input) => {
  const { guard, map } = getMap(input)
  const { visited } = moveIterative(map, guard, '^')
  return Object.keys(visited).length 
}

const part2 = (input) => {
  const { guard, map } = getMap(input)
  const { visited } = moveIterative(map, guard, '^')
  let loops = 0
  for (const pos in visited) {
    const newMap = map.map((row, y) => row.map((c, x) => getKey({ x, y }) === pos ? '#' : c))
    const { loop } = moveIterative(newMap, guard, '^')
    if (loop) loops++
  }
  return loops
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
