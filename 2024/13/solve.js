const fs = require('fs')

const example = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const process = (input, offset = 0) => {
  const equations = []
  let equation = {}
  for (const line of input) {
    if (line.startsWith('Button A:')) {
      const matches = line.match(/X\+(\d+), Y\+(\d+)/)
      equation.ax = Number(matches[1])
      equation.ay = Number(matches[2])
    } else
    if (line.startsWith('Button B:')) {
      const matches = line.match(/X\+(\d+), Y\+(\d+)/)
      equation.bx = Number(matches[1])
      equation.by = Number(matches[2])
    } else
    if (line.startsWith('Prize:')) {
      const matches = line.match(/X=(\d+), Y=(\d+)/)
      equation.tx = Number(matches[1]) + offset
      equation.ty = Number(matches[2]) + offset
      equation.cost = calculate(equation)
      equations.push(equation)
      equation = {}
    }
  }
  return equations
}

const calculate = (equation) => {
  const { ax, ay, bx, by, tx, ty } = equation
  const b = (ay * tx - ax * ty) / (ay * bx - ax * by)
  const a = (tx - bx * b) / ax
  return (a % 1 || b % 1) ? 0 : (3 * a + b)
}

const part1 = (input) => {
  const equations = process(input)
  return equations.reduce((sum, { cost }) => sum + cost, 0)
}

const part2 = (input) => {
  const equations = process(input, 10000000000000)
  return equations.reduce((sum, { cost }) => sum + cost, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
