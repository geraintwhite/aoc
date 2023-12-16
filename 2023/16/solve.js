const fs = require('fs')

const example = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getNextPos = ({ x, y, d }, map) => {
  const cell = map[y]?.[x]
  if (!cell) return []
  if (d === 1) { // right
    return {
      '.': [{ x: x + 1, y, d }],
      '/': [{ x, y: y - 1, d: 4 }],
      '\\': [{ x, y: y + 1, d: 2 }],
      '|': [{ x, y: y - 1, d: 4 }, { x, y: y + 1, d: 2 }],
      '-': [{ x: x + 1, y, d }]
    }[cell]
  }
  if (d === 2) { // down
    return {
      '.': [{ x, y: y + 1, d }],
      '/': [{ x: x - 1, y, d: 3 }],
      '\\': [{ x: x + 1, y, d: 1 }],
      '|': [{ x, y: y + 1, d }],
      '-': [{ x: x - 1, y, d: 3 }, { x: x + 1, y, d: 1 }]
    }[cell]
  }
  if (d === 3) { // left
    return {
      '.': [{ x: x - 1, y, d }],
      '/': [{ x, y: y + 1, d: 2 }],
      '\\': [{ x, y: y - 1, d: 4 }],
      '|': [{ x, y: y - 1, d: 4 }, { x, y: y + 1, d: 2 }],
      '-': [{ x: x - 1, y, d }]
    }[cell]
  }
  if (d === 4) { // up
    return {
      '.': [{ x, y: y - 1, d }],
      '/': [{ x: x + 1, y, d: 1 }],
      '\\': [{ x: x - 1, y, d: 3 }],
      '|': [{ x, y: y - 1, d }],
      '-': [{ x: x - 1, y, d: 3 }, { x: x + 1, y, d: 1 }]
    }[cell]
  }
}

const unique = (arr) => {
  return arr.filter((x, i) => arr.indexOf(x) === i)
}

const getEnergisedCells = (map, pos, energised) => {
  const nextPos = getNextPos(pos, map)
  if (nextPos.length) energised.push(pos)
  for (const p of nextPos) {
    if (!energised.find(({ x, y, d }) => x === p.x && y === p.y && d === p.d)) {
      getEnergisedCells(map, p, energised)
    }
  }
  return energised
}

const getEnergy = (map, pos) => {
  const energised = getEnergisedCells(map, pos, [])
  return unique(energised.map(({ x, y }) => `${x}-${y}`)).length
}

const getBestEnergy = (map) => {
  let energy = 0
  for (let y = 0; y < map.length; y++) {
    energy = Math.max(energy, getEnergy(map, { x: 0, y, d: 1 }))
    energy = Math.max(energy, getEnergy(map, { x: map[0].length - 1, y, d: 3 }))
  }
  for (let x = 0; x < map[0].length; x++) {
    energy = Math.max(energy, getEnergy(map, { x, y: 0, d: 2 }))
    energy = Math.max(energy, getEnergy(map, { x, y: map.length - 1, d: 4 }))
  }
  return energy
}

const part1 = (input) => {
  return getEnergy(input, { x: 0, y: 0, d: 1 })
}

const part2 = (input) => {
  return getBestEnergy(input)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
