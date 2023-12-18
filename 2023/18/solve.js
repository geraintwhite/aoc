const fs = require('fs')

const example = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const dirs = {R:[0,1],D:[1,0],L:[0,-1],U:[-1,0]}

const getCorners = (input, swap) => {
  let corners = [], dist = 0, x = 0, y = 0
  for (const l of input) {
    const [d,n,h] = l.split(' ')
    const [dy,dx] = dirs[swap ? Object.keys(dirs)[Number(h[7])] : d]
    const i = swap ? parseInt(h.slice(2,7), 16) : Number(n)
    corners.push({x,y})
    dist += i, x += dx * i, y += dy * i
  }
  return [corners, dist]
}

// https://en.wikipedia.org/wiki/Shoelace_formula
const measure = (corners, dist) => {
  let area = 0, l = corners.length
  for (let i = 0; i < l; i++) {
    area += (corners[i % l].y + corners[(i+1) % l].y) * (corners[i % l].x - corners[(i+1) % l].x)
  }
  return (area + dist) / 2 + 1
}

const part1 = (input) => {
  const [corners, dist] = getCorners(input)
  return measure(corners, dist)
}

const part2 = (input) => {
  const [corners, dist] = getCorners(input, true)
  return measure(corners, dist)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
