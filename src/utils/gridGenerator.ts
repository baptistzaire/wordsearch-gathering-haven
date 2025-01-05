type Direction = 'horizontal' | 'vertical' | 'diagonal';

const getRandomPosition = (size: number, wordLength: number, direction: Direction): [number, number] => {
  let x, y;
  if (direction === 'horizontal') {
    x = Math.floor(Math.random() * (size - wordLength));
    y = Math.floor(Math.random() * size);
  } else if (direction === 'vertical') {
    x = Math.floor(Math.random() * size);
    y = Math.floor(Math.random() * (size - wordLength));
  } else {
    x = Math.floor(Math.random() * (size - wordLength));
    y = Math.floor(Math.random() * (size - wordLength));
  }
  return [x, y];
};

const canPlaceWord = (grid: string[][], word: string, x: number, y: number, direction: Direction): boolean => {
  for (let i = 0; i < word.length; i++) {
    let checkX = x;
    let checkY = y;
    
    if (direction === 'horizontal') checkX += i;
    else if (direction === 'vertical') checkY += i;
    else {
      checkX += i;
      checkY += i;
    }

    if (grid[checkY][checkX] !== '' && grid[checkY][checkX] !== word[i]) {
      return false;
    }
  }
  return true;
};

const placeWord = (grid: string[][], word: string, x: number, y: number, direction: Direction) => {
  for (let i = 0; i < word.length; i++) {
    if (direction === 'horizontal') {
      grid[y][x + i] = word[i];
    } else if (direction === 'vertical') {
      grid[y + i][x] = word[i];
    } else {
      grid[y + i][x + i] = word[i];
    }
  }
};

export const generateGameGrid = (size: number, wordsToPlace: string[]): string[][] => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  const directions: Direction[] = ['horizontal', 'vertical', 'diagonal'];
  
  wordsToPlace.forEach(word => {
    let placed = false;
    while (!placed) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const [x, y] = getRandomPosition(size, word.length, direction);
      if (canPlaceWord(grid, word, x, y, direction)) {
        placeWord(grid, word, x, y, direction);
        placed = true;
      }
    }
  });

  // Fill empty spaces with random letters
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
};