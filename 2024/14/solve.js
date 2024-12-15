const fs = require('fs')

const example = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getRobots = (input) => {
  return input.map((row) => {
    const [x, y, vx, vy] = row.match(/-?\d+/g).map(Number)
    return { x, y, vx, vy }
  })
}

const simulate = (robots, width, height, seconds) => {
  return robots.map(({ x, y, vx, vy }) => {
    const newX = x + vx * seconds
    const newY = y + vy * seconds
    return { x: ((newX % width) + width) % width, y: ((newY % height) + height) % height }
  })
}

const countRobots = (positions, width, height) => {
  const midX = (width - 1) / 2
  const midY = (height - 1) / 2
  const quadrants = [0, 0, 0, 0]
  for (const { x, y } of positions) {
    if (x < midX && y < midY) quadrants[0]++
    if (x > midX && y < midY) quadrants[1]++
    if (x > midX && y > midY) quadrants[2]++
    if (x < midX && y > midY) quadrants[3]++
  }
  return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3]
}

const draw = (positions, width, height) => {
  let grid = ''
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid += positions.filter((pos) => pos.x === x && pos.y == y).length || '.'
    }
    grid += '\n'
  }
  console.log(grid)
}

const findTree = (robots, width, height) => {
  let found = 0
  for (let i = 0; !found; i++) {
    const positions = simulate(robots, width, height, i)
    if (i > 1000 && new Set(positions.map(({ x, y }) => `${y}-${x}`)).size === positions.length) {
      found = i
      draw(positions, width, height)
    }
  }
  return found
}

const part1 = (input, width, height) => {
  const robots = getRobots(input)
  const positions = simulate(robots, width, height, 100)
  return countRobots(positions, width, height)
}

const part2 = (input, width, height) => {
  const robots = getRobots(input)
  return findTree(robots, width, height)
}

console.log('\nPart 1\n')

console.log(part1(example, 11, 7))
console.log(part1(getInput(), 101, 103))

console.log('\nPart 2\n')

console.log(part2(example, 11, 7))
console.log(part2(getInput(), 101, 103))
