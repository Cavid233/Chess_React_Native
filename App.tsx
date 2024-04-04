/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Rook, Knight, Bishop, King, Queen, Pawn} from './models/ChessFigure';
import HeroPawnCard from './components/HeroPawnCard';
const screenWidth = Dimensions.get('window').width;

const initialChessboard = [
  // Rank 1 (the first row from White's perspective)
  [
    new Rook(0, 0, 'black'),
    new Knight(1, 0, 'black'),
    new Bishop(2, 0, 'black'),
    new King(3, 0, 'black'),
    new Queen(4, 0, 'black'),
    new Bishop(5, 0, 'black'),
    new Knight(6, 0, 'black'),
    new Rook(7, 0, 'black'),
  ],
  // Rank 2 (pawns in the second row)
  [...Array.from({length: 8}, (_, rowIndex) => new Pawn(rowIndex, 1, 'black'))],
  // Rank 3 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 4 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 5 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 6 (empty)
  [null, null, null, null, null, null, null, null],
  // Rank 7 (pawns in the seventh row)
  [...Array.from({length: 8}, (_, rowIndex) => new Pawn(rowIndex, 6, 'white'))],

  // Rank 8 (the eighth row from Black's perspective)
  [
    new Rook(0, 7, 'white'),
    new Knight(1, 7, 'white'),
    new Bishop(2, 7, 'white'),
    new King(3, 7, 'white'),
    new Queen(4, 7, 'white'),
    new Bishop(5, 7, 'white'),
    new Knight(6, 7, 'white'),
    new Rook(7, 7, 'white'),
  ],
];

const listOfHeroPawn = [
  'chess-rook',
  'chess-queen',
  'chess-bishop',
  'chess-knight',
];

let move = 0;
let selectedFigure: any;

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

let successPawn: any;

const App = () => {
  const [chessBoard, setChessBoard] = useState(initialChessboard);
  const [moveOrder, setMoveOrder] = useState<string>('white');

  const [highlightedFigureId, setHighlightedFigureId] = useState<number>(-1);

  const [isHeroPawnListVisible, setIsHeroPawnListVisible] =
    useState<Boolean>(false);

  const figureMoveHandler = (
    rowIndex: number,
    colIndex: number,
    figureId: number = -1,
    figureColor: string = '',
  ) => {
    if (selectedFigure?.color === figureColor) {
      move = 0;
    }

    if (move === 0) {
      selectedFigure = chessBoard[rowIndex][colIndex];

      if (selectedFigure && moveOrder === selectedFigure.color) {
        setHighlightedFigureId(figureId);
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
        const isValid = selectedFigure.checkRules(
          colIndex,
          rowIndex,
          selectedDestination,
        );

        if (!isValid) {
          return;
        }

        newChessBoard[rowIndex][colIndex] = selectedFigure;
        newChessBoard[selectedFigure.y][selectedFigure.x] = null;
        setChessBoard(() => newChessBoard);
        selectedFigure.x = colIndex;
        selectedFigure.y = rowIndex;
        setMoveOrder(moveOrder === 'white' ? 'black' : 'white');

        if (
          (selectedFigure.color === 'white' &&
            selectedFigure.name === 'chess-pawn' &&
            selectedFigure.y === 0) ||
          // write the same thing for black figure
          (selectedFigure.color === 'black' &&
            selectedFigure.name === 'chess-pawn' &&
            selectedFigure.y === 7)
        ) {
          setIsHeroPawnListVisible(true);
          successPawn = selectedFigure;
        }

        setHighlightedFigureId(-1);
      }

      move = 0;
    }
  };

  const replacePawnHandler = (item: string) => {
    const newChessBoard: any = [...chessBoard];
    const xPosition = successPawn.x;
    const yPosition = successPawn.y;
    let selectedArea;
    switch (item) {
      case 'chess-rook':
        selectedArea = new Rook(xPosition, yPosition, successPawn.color);
        break;
      case 'chess-queen':
        selectedArea = new Queen(xPosition, yPosition, successPawn.color);

        break;
      case 'chess-bishop':
        selectedArea = new Bishop(xPosition, yPosition, successPawn.color);
        break;
      case 'chess-knight':
        selectedArea = new Knight(xPosition, yPosition, successPawn.color);
        break;
    }
    newChessBoard[yPosition][xPosition] = selectedArea;
    setChessBoard(() => newChessBoard);
    setIsHeroPawnListVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          position: 'absolute',
          zIndex: 99,
          top: '15%',
          width: '100%',
        }}>
        {isHeroPawnListVisible &&
          listOfHeroPawn.map((item, index) => (
            <HeroPawnCard
              index={index}
              item={item}
              replacePawnHandler={replacePawnHandler}
            />
          ))}
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {chessBoard.map((row, rowIndex) => (
          <View key={rowIndex} style={{flexDirection: 'row'}}>
            {row.map((square, colIndex) => (
              <TouchableWithoutFeedback
                onPress={() =>
                  figureMoveHandler(
                    rowIndex,
                    colIndex,
                    square?.id,
                    square?.color,
                  )
                }
                key={Math.random().toString()}>
                <View
                  style={{
                    ...styles.card,
                    backgroundColor:
                      square && highlightedFigureId === square.id
                        ? '#8ba832'
                        : (rowIndex + colIndex) % 2 === 0
                        ? '#6c523b'
                        : '#90826d',
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: screenWidth / 8,
    height: screenWidth / 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
