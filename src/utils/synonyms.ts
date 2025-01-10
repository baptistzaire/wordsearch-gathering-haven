interface WordSynonyms {
  [key: string]: string[];
}

// Sample synonyms database - in a real app, this would come from an API
export const wordSynonyms: WordSynonyms = {
  CAT: ['FELINE', 'KITTY', 'TABBY'],
  DOG: ['CANINE', 'POOCH', 'HOUND'],
  RAT: ['RODENT', 'MOUSE', 'VERMIN'],
  BAT: ['CLUB', 'RACKET', 'MALLET'],
  PYTHON: ['SNAKE', 'SERPENT', 'VIPER'],
  JAVA: ['COFFEE', 'BREW', 'MOCHA'],
  RUBY: ['GEM', 'JEWEL', 'STONE'],
  SWIFT: ['QUICK', 'RAPID', 'FAST'],
  RUST: ['OXIDE', 'DECAY', 'PATINA'],
  JAVASCRIPT: ['SCRIPT', 'CODE', 'PROGRAM'],
  TYPESCRIPT: ['DIALECT', 'VARIANT', 'FLAVOR'],
  ASSEMBLY: ['GROUP', 'GATHER', 'CLUSTER'],
  HASKELL: ['LOGIC', 'REASON', 'COMPUTE']
};

export const getRandomSynonym = (word: string): string => {
  const synonyms = wordSynonyms[word];
  if (!synonyms || synonyms.length === 0) return word;
  return synonyms[Math.floor(Math.random() * synonyms.length)];
};

export const isOriginalWord = (word: string): boolean => {
  return Object.keys(wordSynonyms).includes(word);
};