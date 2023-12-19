const fs = require('fs')

const example = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getWorkflows = (lines) => {
  const workflows = {}
  let line = lines.shift()
  while (line.length) {
    const [n,r] = line.split('{')
    workflows[n] = r.slice(0,-1).split(',').map((i) => {
      if (!i.includes(':')) return {d:i}
      const [c,d] = i.split(':')
      const [x,v] = c.split(/[<>]/)
      return {o:c.includes('>')?'>':'<',x,v:Number(v),d}
    })
    line = lines.shift()
  }
  const items = lines.map((l) => {
    return l.slice(1,-1).split(',').reduce((o, x) => {
      const [k,v] = x.split('=')
      return {...o, [k]: Number(v)}
    }, {})
  })
  return [workflows,items]
}

const runWorkflow = ({o,x,v,d}, item) => {
  if (o === '<') return item[x] < v ? d : null
  if (o === '>') return item[x] > v ? d : null
  return d
}

const processItem = (workflows, item) => {
  let r = 'in'
  while (!'AR'.includes(r)) {
    const workflow = workflows[r]
    for (const w of workflow) {
      r = runWorkflow(w,item)
      if (r) break
    }
  }
  return r
}

const part1 = (input) => {
  const [workflows,items] = getWorkflows([...input])
  return items.reduce((total, item) => {
    return processItem(workflows, item) === 'A' ? total + Object.values(item).reduce((a,b)=>a+b) : total
  }, 0)
}

const inRange = ({x,m,a,s}) => {
  return x[1] >= x[0] && m[1] >= m[0] && a[1] >= a[0] && s[1] >= s[0]
}

const countRange = ({x,m,a,s}) => {
  return (x[1]-x[0]+1) * (m[1]-m[0]+1) * (a[1]-a[0]+1) * (s[1]-s[0]+1)
}

const copyRange = ({x,m,a,s}) => {
  return {x:[...x],m:[...m],a:[...a],s:[...s]}
}

const findCombinations = (workflows, outcome = 'A', ranges = {x:[1,4000],m:[1,4000],a:[1,4000],s:[1,4000]}) => {
  let total = 0
  for (const [k,w] of Object.entries(workflows)) {
    for (let i = 0; i < w.length; i++) {
      if (w[i].d !== outcome) continue
      const newRanges = copyRange(ranges)
      for (let j = i; j >= 0; j--) {
        const {o,x,v} = w[j]
        if (!o) continue
        if (j === i) {
          if (o === '>' &&  newRanges[x][0] <= v) newRanges[x][0] = v+1
          if (o === '<' &&  newRanges[x][1] >= v) newRanges[x][1] = v-1
        } else {
          if (o === '>' &&  newRanges[x][1] > v) newRanges[x][1] = v
          if (o === '<' &&  newRanges[x][0] < v) newRanges[x][0] = v
        }
      }
      if (k === 'in' && inRange(newRanges)) total += countRange(newRanges)
      if (k !== 'in') total += findCombinations(workflows, k, newRanges)
    }
  }
  return total
}

const part2 = (input) => {
  const [workflows,items] = getWorkflows([...input])
  return findCombinations(workflows)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
