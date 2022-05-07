
import './index.less'
import { getRGB, imageOnload, imageReader } from './utils'

const svg = document.getElementById('svg')
const deep = 10  // start 0
let colors = Array(deep)

for (let i = 0; i < deep; i++) {
    let size =  1 << i
    colors[i] = Array(size)
    for (let j = 0; j < size; j++) {
        colors[i][j] = Array(size)
    }
}

function createCircle (d, i, j) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg',"circle")
    const r = 1 << (deep - d - 2)
    circle.setAttribute('cx', r * j * 2 + r)
    circle.setAttribute('cy', r * i * 2 + r)
    circle.setAttribute('r', r)
    const [red, green, blue] = colors[d][i][j]
    circle.setAttribute('fill', `rgb(${red}, ${green}, ${blue})`)
    circle.setAttribute('data-index', d + '-' + i + '-' + j)
    return circle    
}


svg.addEventListener('mouseover', (e) =>{
    setTimeout(() =>{
        const dataIndex = e.target.getAttribute('data-index')
        if(dataIndex){
            const [d, i, j] = dataIndex.split('-')
            if (d < deep) {
                svg.removeChild(e.target)
                svg.appendChild(createCircle(Number(d) + 1, i * 2, j * 2))
                svg.appendChild(createCircle(Number(d) + 1, i * 2 + 1, j * 2))
                svg.appendChild(createCircle(Number(d) + 1, i * 2, j * 2 + 1))
                svg.appendChild(createCircle(Number(d) + 1, i * 2 + 1, j * 2 + 1))
            }
        }
    }, 100)
})

const ipt = document.getElementById('ipt')
const { floor } = Math
ipt.addEventListener('change', async () => {
    try {
        let c = deep - 1
        let size = 1 << c
        let src = await imageReader(ipt)
        const image = new Image()
        image.src = src
        await imageOnload(image)
        const reat = getRGB(image, size, size)
    
        for (let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                let current = i * 4 * size + j * 4 
                colors[c][i][j] = [reat[current], reat[current + 1], reat[current + 2]]
            }
        }
        size = size >> 1
        c--
    
        while (size){
            for (let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    const [
                        [r1, g1, b1],
                        [r2, g2, b2],
                        [r3, g3, b3],
                        [r4, g4, b4]
                    ] = [
                        colors[c + 1][i * 2][j * 2],
                        colors[c + 1][i * 2 + 1][j * 2],
                        colors[c + 1][i * 2][j * 2 + 1],
                        colors[c + 1][i * 2 + 1][j * 2 + 1]
                    ]
                    colors[c][i][j] = [
                        floor((r1 + r2 + r3 + r4) / 4),
                        floor((g1 + g2 + g3 + g4) / 4),
                        floor((b1 + b2 + b3 + b4) / 4),
                    ]
                }
            }
            c--
            size = size >> 1
        }
        svg.innerHTML = ''
        console.log(colors)
        svg.appendChild(createCircle(0, 0, 0))
    } catch (error) {
        alert(error.message)
    }
})