import React from "react";
import ReactDom from "react-dom";
import "./index.css";

function Square(props) {
  let style;
  if (props.pos && props.pos.indexOf(props.currentPos) > -1) {
    style = { border: "3px  solid green" };
  }
  return (
    <button className="square" onClick={props.onClick} style={style}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [1, 4, 7],
    [0, 3, 6],
    [2, 5, 8],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], pos: [a, b, c] };
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.handleClick(i)}
        pos={this.props.pos}
        currentPos={i}
      />
    );
  }
  render() {
    let items = [];
    for (let j = 3, z = 0; z < 3; z++) {
      let content = [];
      for (let i = 0; i < 3; i++) {
        content.push(this.renderSquare(i + j * z));
      }
      items.push(
        <div className="board-row" key={z + 2}>
          {content}
        </div>
      );
    }
    return <div>{items}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      XIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winnerResult = calculateWinner(squares);
    if (winnerResult?.winner || squares[i]) {
      return;
    }
    squares[i] = this.state.XIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      XIsNext: !this.state.XIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      XIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerResult = calculateWinner(current.squares);
    let status;
    if (winnerResult?.winner) {
      status = "Winner is " + winnerResult.winner;
    } else {
      status =
        current.squares.indexOf(null) === -1
          ? "Sorry the game is over"
          : "Next Player :" + (this.state.XIsNext ? "X" : "O");
    }
    const moves = history.map((step, move) => {
      let style;
      if (move === this.state.stepNumber) {
        style = { border: "3px solid green" };
      }
      const desc = move ? "Got to # " + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={style}>
            {" "}
            {desc}
          </button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            handleClick={(i) => this.handleClick(i)}
            pos={winnerResult?.pos}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDom.render(<Game />, document.getElementById("root"));
