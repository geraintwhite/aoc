const fs = require('fs')

const example = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getNodes = (map) => {
  const nodes = {}
  for (const y in map) {
    for (const x in map[y]) {
      if (map[y][x] !== '.') {
        nodes[map[y][x]] = [...(nodes[map[y][x]] || []), { x: Number(x), y: Number(y) }]
      }
    }
  }
  return nodes
}

const getAntinodesForPoints = (a, b) => {
  const m = (a.y - b.y) / (a.x - b.x)
  const [x1, x2] = [Math.max(a.x, b.x) + Math.abs(a.x - b.x), Math.min(a.x, b.x) - Math.abs(a.x - b.x)]
  const [y1, y2] = [a.y + m * (x1 - a.x), a.y + m * (x2 - a.x)]
  return [{ x: x1, y: y1 }, { x: x2, y: y2 }]
}

const getAntinodesInBounds = (bounds) => (a, b) => {
  const m = (a.y - b.y) / (a.x - b.x)
  const xs = Array(bounds.x).fill(0).map((_, i) => i)
  return xs.map(x => ({ x, y: a.y + m * (x - a.x) }))
}

const getKey = ({ x, y }) => `${x}-${y}`

const getAllAntinodes = (nodes, fn = getAntinodesForPoints) => {
  const antinodes = []
  for (const type in nodes) {
    for (const node of nodes[type]) {
      for (const node2 of nodes[type]) {
        if (node.x === node2.x && node.y === node2.y) continue
        antinodes.push(...fn(node, node2))
      }
    }
  }
  return antinodes
}

const part1 = (input) => {
  const nodes = getNodes(input)
  return new Set(getAllAntinodes(nodes).filter(({x,y}) => input[y]?.[x]).map(getKey)).size
}

const part2 = (input) => {
  const nodes = getNodes(input)
  const bounds = { y: input.length, x: input[0].length }
  return new Set(getAllAntinodes(nodes, getAntinodesInBounds(bounds)).filter(({x,y}) => input[y]?.[x]).map(getKey)).size
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
