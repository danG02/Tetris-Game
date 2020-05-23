document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const width = 10
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
let nextRandom = 0
let timerId
let score = 0
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
]

//The Shapes
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 +2]
] 

const zTetromino = [
    [0, width, width + 1, width * 2 +1],
    [width + 1, width + 2, width * 2, width * 2 +1],
    [0, width, width + 1, width * 2 +1],
    [width + 1, width + 2, width * 2, width * 2 +1]
]

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
]

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]    
]

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3,],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3,]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPostion = 4
let currentRotation = 0

//selects shape randomly
let random = Math.floor(Math.random() * theTetrominoes.length)

let current = theTetrominoes[random][currentRotation]

//draw which is the rotation of the shape

const draw = () => {
    current.forEach(index => {
        squares[currentPostion + index].classList.add('tetromino')
        squares[currentPostion + index].style.backgroundColor =  colors[random]
    })
}

console.log(theTetrominoes[0][0])

//undraw shape

const undraw = () => {
    current.forEach(index => {
        squares[currentPostion + index].classList.remove('tetromino')
        squares[currentPostion + index].style.backgroundColor = ''
    })
}

//make the shape move down every second


//assigning keycodes to shapes

const control = (e) => {
    if (e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }
}
document.addEventListener('keyup', control)


//move down function
const moveDown = () => {
    undraw()
    currentPostion += width
    draw()
    freeze()
}

//freeze  func

const freeze = () => {
    if (current.some(index => squares[currentPostion + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPostion + index].classList.add('taken'))
        //start a new shape falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPostion = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

//move the shape left and creating the rules and limit

const moveLeft = () => {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPostion + index) % width === 0)

    if (!isAtLeftEdge) currentPostion -= 1

    if (current.some(index => squares[currentPostion + index].classList.contains('taken'))) {
        currentPostion += 1
    }
    draw()
}

//move shape right, setting rules
const moveRight = () => {
    undraw()
    const isAtRightEdge = current.some(index => (currentPostion + index) % width === width -1)

    if (!isAtRightEdge) currentPostion += 1

    if (current.some(index => squares[currentPostion + index].classList.contains('taken'))) {
        currentPostion -= 1
    }
    draw()
}

//rotate the shape
const rotate = () => {
    undraw()
    currentRotation ++
    if (currentRotation === current.length) {
        currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
}

//show up next shape

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0


//the shapes w/o rotations
const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lshape
    [0 ,displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zshape
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tshape
    [0, 1, displayWidth, displayWidth + 1], //oshape
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // ishape
]

//display shape  func

const displayShape = () => {
    displaySquares.forEach(squares => {
        squares.classList.remove('tetromino')
        squares.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetrmino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//start pause button
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
    }
})

//add score

const addScore = () => {
    for (let i = 0; i < 199; i += width) {
         const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

         if (row.every(index => squares[index].classList.contains('taken'))) {
             score += 10
             scoreDisplay.innerHTML = score
             row.forEach(index => {
                 squares[index].classList.remove('taken')
                 squares[index].classList.remove('tetromino')
                 squares[index].style.backgroundColor = ''
             })
             const squaresRemoved = squares.splice(i, width)
             squares = squaresRemoved.concat(squares)
             squares.forEach(cell => grid.appendChild(cell))
         }
    }
}

//gameover func
const gameOver = () => {
    if (current.some(index => squares[currentPostion + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over'
        clearInterval(timerId)
    }
}




})


