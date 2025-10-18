import { Card, Rank, Suit } from '@/types/game';

const suits: Suit[] = ['♠', '♥', '♦', '♣'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({
        suit,
        rank,
        id: `${rank}${suit}${Math.random()}`
      });
    });
  });
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const getCardValue = (card: Card): number => {
  if (card.rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  return parseInt(card.rank);
};

export const calculateHandValue = (hand: Card[]): { value: number; isSoft: boolean } => {
  let value = 0;
  let aces = 0;

  hand.forEach(card => {
    if (card.rank === 'A') {
      aces++;
      value += 11;
    } else if (['J', 'Q', 'K'].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank);
    }
  });

  // Adjust for aces if needed
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return { value, isSoft: aces > 0 };
};

export const isBlackjack = (hand: Card[]): boolean => {
  return hand.length === 2 && calculateHandValue(hand).value === 21;
};
