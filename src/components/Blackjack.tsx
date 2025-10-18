import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PlayingCard from './PlayingCard';
import { Card, GamePhase } from '@/types/game';
import { createDeck, calculateHandValue, isBlackjack } from '@/utils/cardUtils';
import { toast } from 'sonner';

const Blackjack = () => {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [phase, setPhase] = useState<GamePhase>('betting');
  const [message, setMessage] = useState('Click Deal to start!');

  const dealCards = () => {
    const newDeck = createDeck();
    const player = [newDeck.pop()!, newDeck.pop()!];
    const dealer = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setPhase('playing');
    setMessage('Hit or Stand?');

    // Check for immediate blackjack
    if (isBlackjack(player)) {
      setPhase('dealer');
      setTimeout(() => checkWinner(player, dealer), 500);
    }
  };

  const hit = () => {
    if (phase !== 'playing') return;

    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];
    
    setDeck(newDeck);
    setPlayerHand(newHand);

    const handValue = calculateHandValue(newHand).value;
    
    if (handValue > 21) {
      setPhase('finished');
      setMessage('Bust! You lose.');
      toast.error('Bust! You went over 21.');
    } else if (handValue === 21) {
      stand(newHand);
    }
  };

  const stand = (hand = playerHand) => {
    if (phase !== 'playing') return;
    
    setPhase('dealer');
    setMessage('Dealer\'s turn...');
    
    setTimeout(() => {
      dealerPlay(hand);
    }, 500);
  };

  const dealerPlay = (playerFinalHand: Card[]) => {
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    const dealerInterval = setInterval(() => {
      const dealerValue = calculateHandValue(currentDealerHand).value;
      
      if (dealerValue < 17) {
        const newCard = currentDeck.pop()!;
        currentDealerHand = [...currentDealerHand, newCard];
        setDealerHand(currentDealerHand);
        setDeck(currentDeck);
      } else {
        clearInterval(dealerInterval);
        checkWinner(playerFinalHand, currentDealerHand);
      }
    }, 800);
  };

  const checkWinner = (playerFinalHand: Card[], dealerFinalHand: Card[]) => {
    const playerValue = calculateHandValue(playerFinalHand).value;
    const dealerValue = calculateHandValue(dealerFinalHand).value;
    const playerBJ = isBlackjack(playerFinalHand);
    const dealerBJ = isBlackjack(dealerFinalHand);

    setPhase('finished');

    if (playerBJ && !dealerBJ) {
      setMessage('Blackjack! You win!');
      toast.success('Blackjack! 🎉');
    } else if (dealerBJ && !playerBJ) {
      setMessage('Dealer has Blackjack. You lose.');
      toast.error('Dealer has Blackjack.');
    } else if (playerBJ && dealerBJ) {
      setMessage('Both have Blackjack. Push.');
      toast('Push - It\'s a tie!');
    } else if (dealerValue > 21) {
      setMessage('Dealer busts! You win!');
      toast.success('Dealer busts! You win! 🎉');
    } else if (playerValue > dealerValue) {
      setMessage('You win!');
      toast.success('You win! 🎉');
    } else if (dealerValue > playerValue) {
      setMessage('Dealer wins.');
      toast.error('Dealer wins.');
    } else {
      setMessage('Push - It\'s a tie!');
      toast('Push - It\'s a tie!');
    }
  };

  const newGame = () => {
    setDeck(createDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setPhase('betting');
    setMessage('Click Deal to start!');
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  const showDealerCard = phase === 'dealer' || phase === 'finished';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-primary rounded-3xl shadow-2xl p-8 border-4 border-accent/20">
          <h1 className="text-5xl font-bold text-center mb-8 text-accent">
            Blackjack
          </h1>

          {/* Dealer Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-primary-foreground">Dealer</h2>
              <div className="text-xl font-bold text-accent">
                {showDealerCard ? dealerValue.value : '?'}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap justify-center min-h-32 items-center">
              {dealerHand.map((card, index) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  faceDown={index === 1 && !showDealerCard}
                  className="animate-in slide-in-from-top duration-300"
                />
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="text-center py-6">
            <p className="text-2xl font-bold text-accent">
              {message}
            </p>
          </div>

          {/* Player Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-primary-foreground">You</h2>
              <div className="text-xl font-bold text-accent">
                {playerHand.length > 0 ? playerValue.value : '0'}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap justify-center min-h-32 items-center">
              {playerHand.map((card) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  className="animate-in slide-in-from-bottom duration-300"
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center flex-wrap">
            {phase === 'betting' && (
              <Button
                onClick={dealCards}
                size="lg"
                variant="default"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-6 text-xl"
              >
                Deal Cards
              </Button>
            )}
            
            {phase === 'playing' && (
              <>
                <Button
                  onClick={hit}
                  size="lg"
                  variant="default"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-6 text-xl"
                >
                  Hit
                </Button>
                <Button
                  onClick={() => stand()}
                  size="lg"
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-6 text-xl"
                >
                  Stand
                </Button>
              </>
            )}

            {phase === 'finished' && (
              <Button
                onClick={newGame}
                size="lg"
                variant="default"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-6 text-xl"
              >
                New Game
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
