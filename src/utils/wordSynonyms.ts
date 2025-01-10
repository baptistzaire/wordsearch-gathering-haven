interface WordCategory {
  category: string;
  words: string[];
}

const wordCategories: WordCategory[] = [
  {
    category: 'animals',
    words: ['CAT', 'DOG', 'RAT', 'BAT', 'WOLF', 'LION', 'BEAR', 'DEER']
  },
  {
    category: 'programming',
    words: ['PYTHON', 'JAVA', 'RUBY', 'SWIFT', 'RUST', 'GOLANG', 'KOTLIN', 'SCALA']
  },
  {
    category: 'advanced_programming',
    words: ['JAVASCRIPT', 'TYPESCRIPT', 'ASSEMBLY', 'HASKELL', 'ERLANG', 'CLOJURE', 'FORTRAN', 'PASCAL']
  }
];

export const getWordCategory = (word: string): WordCategory | undefined => {
  return wordCategories.find(category => 
    category.words.includes(word)
  );
};

export const getRandomSynonym = (word: string): string => {
  const category = getWordCategory(word);
  if (!category) return word;

  const availableWords = category.words.filter(w => w !== word);
  if (availableWords.length === 0) return word;

  return availableWords[Math.floor(Math.random() * availableWords.length)];
};