const fs = require('fs')

const example = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split('\n')

const total = { red: 12, green: 13, blue: 14 }

const getInput = () => {
  const input = fs.readFileSync('./input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const convert = (cubes) => {
  return cubes.reduce((output, cube) => {
    const [n, colour] = cube.split(' ')
    return { ...output, [colour]: Number(n) }
  }, {})
}

const part1 = (input) => {
  return input.reduce((output, line) => {
    const [game, games] = line.split(': ')
    const parsed = games.split('; ').map((part) => convert(part.split(', ')))
    const possible = parsed.every(({ red = 0, green = 0, blue = 0 }) => {
      return red <= total.red && green <= total.green && blue <= total.blue
    })
    return possible ? output + Number(game.split(' ')[1]) : output
  }, 0)
}

const part2 = (input) => {
  return input.reduce((output, line) => {
    const [game, games] = line.split(': ')
    const parsed = games.split('; ').map((part) => convert(part.split(', ')))
    const power = parsed.reduce((max, round) => {
      return {
        red: Math.max(max.red, round.red || 0),
        green: Math.max(max.green, round.green || 0),
        blue: Math.max(max.blue, round.blue || 0),
      }
    }, { red: 0, green: 0, blue: 0 })
    return output + power.red * power.green * power.blue
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
