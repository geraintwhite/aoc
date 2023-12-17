const fs = require('fs')

const example = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

/* MinHeap minimised - taken from https://stackoverflow.com/a/66511107/5459839 */
const MinHeap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}};

const dirs = [[0,1],[1,0],[0,-1],[-1,0]]

const getShortestPath = (map, min, max) => {
  const heap = [[0, 0, 0, 0, 0]]
  const visited = {}

  while (heap.length) {
    const [h,x,y,px,py] = MinHeap.pop(heap)

    if (x === map.length - 1 && y === map[0].length - 1) return h
    if (visited[[x,y,px,py]]) continue
    visited[[x,y,px,py]] = true

    for (const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]) {
      if ((dx === px && dy === py) || (dx === -px && dy === -py)) continue
      for (let n = 0, i = 1; i <= max; i++) {
        if (!map[x+dx*i]?.[y+dy*i]) continue
        n += Number(map[x+dx*i][y+dy*i])
        if (i >= min) MinHeap.push(heap, [h+n, x+dx*i, y+dy*i, dx, dy])
      }
    }
  }
}

const part1 = (input) => {
  return getShortestPath(input, 1, 3)
}

const part2 = (input) => {
  return getShortestPath(input, 4, 10)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
