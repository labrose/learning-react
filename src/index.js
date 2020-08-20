import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

    function Square(props) {
        const winSquare = props.winSquare;
        return (
            <button className={winSquare ? "square-win" :"square"} onClick={props.onClick}>
                {props.value}
            </button>
        )
    }
  
  class Board extends React.Component {

    renderSquare(i) {
        const winLine = this.props.winLine;

      return (
        <Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
            winSquare={winLine && winLine.includes(i)}
        />)
      ;
    }
  
    render() {  
        let gameBoard = [];
        const boardSize = 3;
        for (let r = 0; r < boardSize; r++) {
            let row = [];
            for (let c = 0; c < boardSize; c++) {
                row.push(this.renderSquare(r * boardSize + c))
            }
        gameBoard.push(<div className="board-row">{row}</div>);
        }
      return (
        
        gameBoard
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            listIsDesc: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                latestMove: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            listIsDesc: this.state.listIsDesc,
        });
    }

    toggleList() {
        this.setState({
            history: this.state.history,
            stepNumber: this.state.stepNumber,
            xIsNext: this.state.xIsNext,
            listIsDesc: !this.state.listIsDesc,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winInfo = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const latestMove = step.latestMove;
            const col = latestMove % 3;
            const row = Math.floor(latestMove / 3);
            const desc = move ?
                `Go to move #${move} (${col}, ${row})`:
                'Go to game start';
            return (
                <li key={move}>
                    <button 
                        className={move === this.state.stepNumber ? 'list-selected' : ''}
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            );
        });

        const sortMsg = this.state.listIsDesc ? 'Sort Descending': 'Sort Ascending';
        const isListDesc = this.state.listIsDesc;
        if (isListDesc) {
            moves.reverse();
        }

        let status;
        if (winInfo) {
            status = 'Winner: ' + winInfo.winner;
            
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    winLine = {winInfo ? winInfo.winLine : ''}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div>
                    <button onClick={() => this.toggleList()}>
                        {sortMsg}
                    </button>
                </div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
        }
  }

  function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return {
              winner: squares[a],
              winLine: lines[i],
          }
        }
      }
      return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  