const fs = require('fs')

const example = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getBricks = (input) => {
  return input.map(line => {
    return line.split('~').map(x => x.split(',').map(Number))
  })
}

const key = ({x,y}) => `${x}-${y}`

const move = (brick, heights) => {
  let max = 0
  for (let x = brick[0][0]; x <= brick[1][0]; x++) {
    for (let y = brick[0][1]; y <= brick[1][1]; y++) {
      max = Math.max(max, heights[key({x,y})] ?? 0)
    }
  }
  const dz = Math.max(brick[0][2] - max - 1, 0)
  return [[brick[0][0],brick[0][1],brick[0][2]-dz],[brick[1][0],brick[1][1],brick[1][2]-dz]]
}

const drop = (bricks) => {
  const heights = {}, stack = []
  let num = 0
  for (const brick of bricks) {
    const moved = move(brick, heights)
    if (brick[0][2] !== moved[0][2]) num++
    stack.push(moved)
    for (let x = brick[0][0]; x <= brick[1][0]; x++) {
      for (let y = brick[0][1]; y <= brick[1][1]; y++) {
        heights[key({x,y})] = moved[1][2]
      }
    }
  }
  return { stack, num }
}

const solve = (input) => {
  const bricks = getBricks(input).sort((a, b) => a[0][2] - b[0][2])
  const { stack } = drop(bricks)
  let fall = 0, stay = 0
  for (let i = 0; i < stack.length; i++) {
    const { num } = drop([...stack.slice(0, i), ...stack.slice(i + 1)])
    if (num) fall += num
    else stay++
  }
  return { fall, stay }
}

const part1 = (input) => {
  return solve(input).stay
}

const part2 = (input) => {
  return solve(input).fall
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
