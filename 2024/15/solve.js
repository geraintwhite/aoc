const fs = require('fs')

const example1 = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`.split('\n')

const example1b = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`.split('\n')

const example2 = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const directions = {
  '<': { dx: -1, dy: 0 },
  '^': { dx: 0, dy: -1 },
  '>': { dx: 1, dy: 0 },
  'v': { dx: 0, dy: 1 },
}

const getKey = ({ x, y }) => `${y},${x}`

const process = (input, wide) => {
  const instructions = [], boxes = [], walls = [], robots = []
  const height = input.indexOf(''), width = input[0].length
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (input[y][x] === '@') robots.push({ x: wide ? x * 2 : x, y })
      if (input[y][x] === '#') walls.push(...(wide ? [getKey({ x: x * 2, y }), getKey({ x: x * 2 + 1, y })] : [getKey({ x, y })]))
      if (input[y][x] === 'O') boxes.push(getKey({ x: wide ? x * 2 : x, y }))
    }
  }
  for (let y = height + 1; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      instructions.push(directions[input[y][x]])
    }
  }
  return { width, height, instructions, boxes, walls, robots }
}

const move = ({ x, y }, { dx, dy }, boxes, walls, wide) => {
  const newPos = { x: x + dx, y: y + dy }
  const newPosWide = { x: x + dx * 2, y: y + dy }
  if (walls.includes(getKey(newPos))) return { x, y }
  if (boxes.includes(getKey(wide ? newPosWide : newPos))) {
    const boxPos = { ...newPosWide }
    while (boxes.includes(getKey(boxPos))) {
      boxPos.x += wide ? dx * 2 : dx
      boxPos.y += dy
    }
    if (walls.includes(getKey(boxPos))) return { x, y }
    boxes[boxes.indexOf(getKey(newPosWide))] = getKey(boxPos)
  }
  return newPos
}

const gps = (key) => {
  const [y, x] = key.split(',').map(Number)
  return y * 100 + x
}

const print = (width, height, boxes, walls, robot) => {
  let output = ''
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width * 2; x++) {
      if (walls.includes(getKey({ x, y }))) output += '#'
      else if (boxes.includes(getKey({ x, y }))) output += '['
      else if (boxes.includes(getKey({ x: x - 1, y }))) output += ']'
      else if (boxes.includes(getKey({ x: x - 1, y }))) output += ']'
      else if (robot.x === x && robot.y === y) output += '@'
      else output += '.'
    }
    output += '\n'
  }
  console.log(output)
}

const part1 = (input) => {
  const { instructions, boxes, walls, robots } = process(input)
  let [robot] = robots
  for (const instruction of instructions) {
    robot = move(robot, instruction, boxes, walls)
  }
  return boxes.reduce((total, key) => total + gps(key), 0)
}

const part2 = (input) => {
  const { width, height, instructions, boxes, walls, robots } = process(input, true)
  let [robot] = robots
  print(width, height, boxes, walls, robot)
  for (const instruction of instructions) {
    robot = move(robot, instruction, boxes, walls, true)
    print(width, height, boxes, walls, robot)
  }
  return boxes.reduce((total, key) => total + gps(key), 0)
}

console.log('\nPart 1\n')

console.log(part1(example1))
console.log(part1(example2))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example1b))
//console.log(part2(example2))
//console.log(part2(getInput()))
