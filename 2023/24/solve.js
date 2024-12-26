const fs = require('fs')

const example = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const parse = (input) => {
  return input.map(line => {
    const [px, py, pz, vx, vy, vz] = line.match(/(-?\d+)/g).map(Number)
    return { px, py, pz, vx, vy, vz }
  })
}

const findIntersections = (stones, lower, upper) => {
  let intersections = 0
  for (let i = 0; i < stones.length; i++) {
    for (let j = i; j < stones.length; j++) {
      if (i === j) continue
      const s1 = stones[i], s2 = stones[j]
      const m1 = s1.vy/s1.vx, m2 = s2.vy/s2.vx
      if (m1 === m2) continue
      const c1 = s1.py-m1*s1.px, c2 = s2.py-m2*s2.px
      const x = (c2-c1)/(m1-m2), y = m1*x+c1
      if ((x < s1.px && s1.vx > 0) || (x > s1.px && s1.vx < 0) || (x < s2.px && s2.vx > 0) || (x > s2.px && s2.vx < 0))
       continue
      if (x < lower || x > upper || y < lower || y > upper) continue
      intersections++
    }
  }
  return intersections
}

const part1 = (input, lower, upper) => {
  return findIntersections(parse(input), lower, upper)
}

const part2 = (input) => {
}

console.log('\nPart 1\n')

console.log(part1(example, 7, 27))
console.log(part1(getInput(), 200000000000000, 400000000000000))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
