import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;

class Figures {
  name: string;
  x: number;
  y: number;
  color: string;

  constructor(name: string, x: number, y: number, color: string) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

class Pawn extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-pawn', x, y, color);
  }

  checkRules(destX: number, destY: number) {

    if (this.color === 'white') {
      console.log(this.y - destY === 1);
      if (
        this.y === destY &&
        this.x === 6 &&
        (this.x - destX === 1 || this.x - destX === 2)
      ) {
        return true;
      } else if (this.x - destX === 1 && this.y === destY) {
        return true;
      }
    } else if (this.color === 'black') {
      if (
        this.y === destY &&
        this.x === 1 &&
        (destX - this.x === 1 || destX - this.x === 2)
      ) {
        return true;
      } else if (destX - this.x === 1 && this.y === destY) {
        return true;
      }
    }
  }
}

class Rook extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-rook', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    if (destX === this.x || destY === this.y) {
      return true;
    }
    return false;
  }
}

class Knight extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-knight', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    // Check if the move follows the L-shaped pattern of a knight.
    const deltaX = Math.abs(destX - this.x);
    const deltaY = Math.abs(destY - this.y);

    return (deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1);
  }
}

class Bishop extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-bishop', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    const checkX = Math.abs(destX - this.x);
    const checkY = Math.abs(destY - this.y);

    return checkX === checkY;
  }
}

class Queen extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-queen', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    if (
      Bishop.prototype.checkRules.bind(this)(destX, destY) ||
      Rook.prototype.checkRules.bind(this)(destX, destY)
    ) {
      return true;
    }
    return false;
  }
}

class King extends Figures {
  constructor(x: number, y: number, color: string) {
    super('chess-king', x, y, color);
  }

  checkRules(destX: number, destY: number) {
    const deltaX = Math.abs(destX - this.x);
    const deltaY = Math.abs(destY - this.y);

    return (
      (deltaX === 1 && deltaY === 0) ||
      (deltaX === 0 && deltaY === 1) ||
      (deltaX === 1 && deltaY === 1)
    );
  }
}

const initialChessboard = [
  // Rank 1 (the first row from White's perspective)
  [
    new Rook(0, 0, 'black'),
    new Knight(0, 1, 'black'),
    new Bishop(0, 2, 'black'),
    new King(0, 3, 'black'),
    new Queen(0, 4, 'black'),
    new Bishop(0, 5, 'black'),
    new Knight(0, 6, 'black'),
    new Rook(0, 7, 'black'),
  ],
  // Rank 2 (pawns in the second row)
  [...Array.from({length: 8}, (_, colIndex) => new Pawn(1, colIndex, 'black'))],
  // Rank 3 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 4 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 5 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 6 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 7 (pawns in the seventh row)
  [...Array.from({length: 8}, (_, colIndex) => new Pawn(6, colIndex, 'white'))],

  // Rank 8 (the eighth row from Black's perspective)
  [
    new Rook(7, 0, 'white'),
    new Knight(7, 1, 'white'),
    new Bishop(7, 2, 'white'),
    new King(7, 3, 'white'),
    new Queen(7, 4, 'white'),
    new Bishop(7, 5, 'white'),
    new Knight(7, 6, 'white'),
    new Rook(7, 7, 'white'),
  ],
];

let move = 0;
let selectedFigure: any;

const App = () => {
  const [chessBoard, setChessBoard] = useState(initialChessboard);
  const [moveOrder, setMoveOrder] = useState('white');

  const figureMoveHandler = (rowIndex: number, colIndex: number) => {
    if (move === 0) {
      console.log('0');
      selectedFigure = initialChessboard[rowIndex][colIndex];
      console.log('selectedFigure', selectedFigure);

      if (selectedFigure && moveOrder === selectedFigure.color) {
        move++;
      }
    } else {
      console.log('1');
      const newChessBoard = [...chessBoard];

      const selectedDestination = newChessBoard[rowIndex][colIndex];
      if (
        selectedDestination === null ||
        selectedDestination.color !== selectedFigure.color
      ) {
        // if (selectedFigure.name === "chess-bishop" || selectedFigure.name === "chess-rook" || selectedFigure.name === "chess-queen") {
        // console.log("hey")
        const isValid = selectedFigure.checkRules(rowIndex, colIndex);
        if (!isValid) {
          return;
        }
        // }

        newChessBoard[rowIndex][colIndex] = selectedFigure;
        newChessBoard[selectedFigure.x][selectedFigure.y] = null;
        setChessBoard(() => newChessBoard);
        selectedFigure.x = rowIndex;
        selectedFigure.y = colIndex;
        setMoveOrder(moveOrder === 'white' ? 'black' : 'white');
      }

      move = 0;
    }
  };

  return (
    <View style={styles.container}>

      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {chessBoard.map((row, rowIndex) => (
          <View key={rowIndex} style={{flexDirection: 'row'}}>
            {row.map((square, colIndex) => (
              <TouchableWithoutFeedback
                onPress={() => figureMoveHandler(rowIndex, colIndex)}
                key={colIndex.toString()}>
                <View
                  style={{
                    ...styles.card,
                    backgroundColor:
                      (rowIndex + colIndex) % 2 === 0 ? '#6c523b' : '#90826d',
                  }}>
                  {square && (
                    <MaterialCommunityIcons
                      name={square.name}
                      size={40}
                      color={square.color}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  card: {
    width: screenWidth / 8,
    height: screenWidth / 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
