const fs = require('fs')

const example = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const replaceAt = (s, i, c) => {
  return s.substring(0, i) + c + s.substring(i + 1)
}

const rotate = (arr) => {
  return arr[0].split('').map((_, i) => arr.map((line) => line[i]).reverse().join(''))
}

const moveRock = (map, { x, y }) => {
  if (y === 0 || map[y][x] !== 'O') return map
  for (let newY = y; newY > 0; newY--) {
    if (map[newY - 1][x] !== '.') return map
    map[newY - 1] = replaceAt(map[newY - 1], x, 'O')
    map[newY] = replaceAt(map[newY], x, '.')
  }
  return map
}

const moveRocks = (map) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map = moveRock(map, { x, y })
    }
  }
  return map
}

const countRocks = (map) => {
  return map.reduce((total, line, index) => {
    return total + ((line.match(/O/g) || []).length * (map.length - index))
  }, 0)
}

const spin = (map) => {
  for (let i = 0; i < 4; i++) {
    map = moveRocks(map)
    map = rotate(map)
  }
  return map
}

const findCycle = (map) => {
  const states = []
  while (!states.includes(map.join('\n'))) {
    states.push(map.join('\n'))
    map = spin(map)
  }
  return { map, states }
}

const part1 = (input) => {
  const map = moveRocks([...input])
  return countRocks(map)
}

const part2 = (input) => {
  let { map, states } = findCycle([...input])
  const cycle = states.length - states.indexOf(map.join('\n'))
  const cycles = (1000000000 - states.length) % cycle
  for (let i = 0; i < cycles; i++) {
    map = spin(map)
  }
  return countRocks(map)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
