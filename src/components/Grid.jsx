import React from 'react'
import gridStyles from '../css/grid.module.css'
import Title from './Title.jsx'


const gridNums = `
8 4 5 6 3 2 1 7 9
7 3 2 9 1 8 6 5 4
1 9 6 7 4 5 3 2 8
6 8 3 5 7 4 9 1 2
4 5 7 2 9 1 8 3 6
2 1 9 8 6 3 5 4 7
3 6 1 4 2 9 7 8 5
5 7 4 1 8 6 2 9 3
9 2 8 3 5 7 4 6 1
`


const example = `3 0 6 5 0 8 4 0 0
5 2 0 0 0 0 0 0 0
0 8 7 0 0 0 0 3 1
0 0 3 0 1 0 0 8 0
9 0 0 8 6 3 0 0 5
0 5 0 0 9 0 6 0 0
1 3 0 0 0 0 2 5 0
0 0 0 0 0 0 0 7 4
0 0 5 2 0 6 3 0 0`

const placeholder = `
Example Input (0 - empty cell):

${example}
`


let next = []
let colArr = []
let rowArr = []
let subArr = []
let subG = []

class Grid extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            matrix: makeMatrix(gridNums),
            input: null
        }
    }

    createGrid(){
        let len = this.state.matrix.length
        let divs = []
        for(let i=0; i<len; i++){
            for(let j=0; j<this.state.matrix[i].length; j++){
                let clr = this.state.matrix[i][j] === '' ? "bg-gold" : "bg-dark-gray"
                divs.push(<div className={gridStyles[clr]} data-cell={i + '' + j} key={i + " " + j}>{this.state.matrix[i][j]}</div>)
            }
        }
        return divs
    }

    changeDisplay = (row, col, val) => {
        let matrix = this.state.matrix
        let item = [...matrix[row]]
        item[col] = val
        matrix[row] = item
        this.setState({matrix: matrix})
    }

    checkAndPlay = () => {
        let input = this.state.input
        if(input === null || input === undefined || input.length !== 9 || input.some(el => el.length !== 9)){
            alert('invalid input')
            return
        }
        this.sudoku(0)
    }

    sudoku = async(index = 0) => {
        if(index === next.length) return true
        let [row, col] = next[index]
        for(let i=1; i<=9; i++){
            if(! (rowArr[row].has(i) || colArr[col].has(i) || subArr[subG[row][col]].has(i)) ){
                colArr[col].add(i)
                rowArr[row].add(i)
                subArr[subG[row][col]].add(i)
                this.changeDisplay(row, col, i)
                await sleep(10)
    
                if(!await this.sudoku(index+1)){
                    colArr[col].delete(i)
                    rowArr[row].delete(i)
                    subArr[subG[row][col]].delete(i)
                    this.changeDisplay(row, col, '')
                    await sleep(10)
                }
                else return true
            }
        }
        return false
    }

    extractInput = (val) => {
        let vals = makeMatrix(val)
        if(vals.length === 9 && vals.every(el => el.length === 9)){
            this.setState({input: vals, matrix: vals})
        }
        else{
            this.setState(prev => ({...prev, input: vals}) )
        }
    }

    copyExample = () => {
        document.getElementById('input').value = example
        this.extractInput(example)
    }

    render(){
        let textStyle = gridStyles["bg-dark-gray"] + " " + gridStyles["text-gold"] + " " + gridStyles["textarea"]
        return (
            <>
                <Title msg="SUDOKU SOLVER" textClr='text-gold' />
                <div className={gridStyles.container}>
                    <div className={gridStyles.makeGrid}>
                        {this.createGrid()}
                    </div>
                    <div className={gridStyles.forms}>
                        <textarea cols="30" rows="12" placeholder={placeholder.trim()} className={textStyle} onChange={(e) => this.extractInput(e.target.value)} id='input'></textarea>
                        <button onClick={() => this.checkAndPlay()} className={gridStyles["btn"]}>Solve Sudoku</button>
                        <button onClick={() => this.copyExample()} className={gridStyles["btn"]}>Copy Example</button>
                    </div>
                </div>
            </>
        )
    }
}

function makeMatrix(gridNums){
    next = []
    colArr = []
    rowArr = []
    subArr = []
    subG = []
    
    let grid = gridNums.trim().split('\n')    
    let matrix = []
    for(let i=0; i<grid.length; i++){
        matrix[i] = grid[i].trim().split(' ').map(Number)
        matrix[i] = matrix[i].map(x => {
            return x === 0 ? '' : x
        })
    }
    for(let i=0; i<matrix.length; i++){
        subG[i] = []
        rowArr[i] = new Set(matrix[i].filter(x => x !== ''))
        for(let j=0; j<matrix[i].length; j++){
            if(i===0){
                colArr[j] = new Set()
            }
            let subIndex = Math.floor(i/3)*3 + Math.floor(j/3)
            if(subArr[subIndex] === undefined) subArr[subIndex] = new Set()
            
            if(matrix[i][j] !== '') {
                colArr[j].add(matrix[i][j])
                subArr[subIndex].add(matrix[i][j])
            }
            else next.push([i, j])
            
            subG[i][j] = Math.floor(i/3)*3 + Math.floor(j/3)
        }
    }
    return matrix
}

export default Grid


function sleep(time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}