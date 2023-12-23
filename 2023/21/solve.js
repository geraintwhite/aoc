const fs = require('fs')

const example = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getAdjacent = (pos, map) => {
  const diff = [[0,1],[0,-1],[1,0],[-1,0]]
  const {x,y} = JSON.parse(pos)
  return diff
    .map(([dy,dx]) => ({x:x+dx,y:y+dy}))
    .filter((p) => 'S.'.includes(map[(p.y+map.length)%map.length]?.[(p.x+map.length)%map.length]))
    .map((p) => JSON.stringify(p))
}

const findLocations = (map, start, steps) => {
  const locations = new Set([JSON.stringify(start)])
  for (let x = 0; x < steps; x++) {
    const newLocations = new Set()
    for (const pos of locations.keys()) {
      getAdjacent(pos, map).forEach(i => newLocations.add(i))
    }
    locations.clear()
    newLocations.forEach(i => locations.add(i))
  }
  return locations
}

const findStart = (map, ch) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === ch) return { x, y }
    }
  }
}

const key = (y,x) => {
  return `${y},${x}`
}

const mod = (y,x,l) => {
  y %= l, x %= l
  return { y: y >= 0 ? y : y + l, x: x >= 0 ? x : x + l }
}

const parse = (map) => {
  const w = {}, p = {}, s = {}, l = map.length
  for (let y = 0; y < l; y++) {
    for (let x = 0; x < l; x++) {
      if (map[y][x] === 'S') s.y = y, s.x = x
      if (map[y][x] === '#') w[key(y,x)] = true
    }
  }
  p[key(s.y,s.x)] = -1
  return { w, p, s, l }
}

const getSteps = ({ w, p, s, l }, { y, x, r }) => {
  const m = mod(y,x,l)
  if (w[key(m.y,m.x)] || p[key(y,x)] >= r) return []
  p[key(y,x)] = r
  return r ? [{y:y+1,x,r:r-1},{y:y-1,x,r:r-1},{y,x:x+1,r:r-1},{y,x:x-1,r:r-1}] : []
}

const solve = ({ w, p, s, l }, steps) => {
  const q = [{y:s.y,x:s.x,r:steps}]
  while (q.length) {
    const {y,x,r} = q.shift()
    q.push(...getSteps({ w, p, s, l }, { y, x, r }))
  }
  return Object.values(p).filter(x => x % 2 === 0).length
}

const lagrange = ([x,y,z]) => {
  return {
    a: x / 2 - y + z / 2,
    b: -3 * (x / 2) + 2 * y - z / 2,
    c: x
  }
}

const part1 = (input, steps) => {
  const start = findStart(input, 'S')
  const locations = findLocations(input, start, steps)
  return locations.size 
}

const part2 = (input, steps) => {
  const { w, p, s, l } = parse(input)
  const size = input.length, mod = steps % size
  const counts = [
    solve({ w, p, s, l }, mod),
    solve({ w, p, s, l }, mod + size),
    solve({ w, p, s, l }, mod + size * 2)
  ]
  const {a,b,c} = lagrange(counts)
  const target = (steps - mod) / size
  return a * target * target + b * target + c;
}

console.log('\nPart 1\n')

console.log(part1(example, 6))
console.log(part1(getInput(), 64))

console.log('\nPart 2\n')

console.log(part2(example, 6))
console.log(part2(example, 10))
console.log(part2(example, 50))
console.log(part2(example, 100))
console.log(part2(example, 500))
console.log(part2(example, 1000))
console.log(part2(example, 5000))
console.log(part2(getInput(), 26501365))
