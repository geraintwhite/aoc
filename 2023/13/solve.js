const fs = require('fs')

const example = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const lineReflects = (line, pos) => {
  const parts = [line.slice(0, pos), line.slice(pos)]
  const length = Math.min(parts[0].length, parts[1].length)
  return parts[0].slice(-length) === parts[1].slice(0, length).split('').reverse().join('')
}

const findReflections = (frames) => {
  const reflections = []
  for (let i = 0; i < frames[0].length; i++) {
    if (frames.every((line) => lineReflects(line, i))) reflections.push(i)
  }
  return reflections
}

const transpose = (arr) => {
  return arr[0].split('').map((_, i) => arr.map((line) => line[i]).join(''))
}

const getFrames = (input) => {
  return input.reduce((frames, line) => {
    if (line === '') frames.push([])
    else frames[frames.length - 1].push(line)
    return frames
  }, [[]])
}

const getReflectionValue = ([horizontal, vertical]) => {
  return horizontal.reduce((a, b) => a + b, 0) + vertical.reduce((a, b) => a + 100 * b, 0)
}

const sumReflections = (frames, smudges = false) => {
  return frames.reduce((total, frame) => {
    const [horizontal, vertical] = [findReflections(frame), findReflections(transpose(frame))]
    const value = getReflectionValue([horizontal, vertical])
    return smudges ? total + findAltValue(frame, [horizontal, vertical]) : total + value
  }, 0)
}

const replaceAt = (s, i, c) => {
  return s.substring(0, i) + c + s.substring(i + 1)
}

const fixSmudge = (frame) => {
  const frames = []
  for (let j = 0; j < frame.length; j++) {
    for (let i = 0; i < frame[j].length; i++) {
      frames.push(frame.map((line, x) => x === j ? replaceAt(line, i, line[i] === '#' ? '.' : '#') : line))
    }
  }
  return frames
}

const findAltValue = (frame, [horizontal, vertical]) => {
  const frames = fixSmudge(frame)
  for (const newFrame of frames) {
    const newReflections = [
      findReflections(newFrame).filter((x) => !horizontal.includes(x)),
      findReflections(transpose(newFrame)).filter((x) => !vertical.includes(x))
    ]
    const newValue = getReflectionValue(newReflections)
    if (newValue) return newValue
  }
}

const part1 = (input) => {
  const frames = getFrames(input)
  return sumReflections(frames)
}

const part2 = (input) => {
  const frames = getFrames(input)
  return sumReflections(frames, true)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
