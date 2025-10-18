import { Card } from '@/types/game';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  className?: string;
}

const PlayingCard = ({ card, faceDown = false, className }: PlayingCardProps) => {
  const isRed = card && (card.suit === '♥' || card.suit === '♦');

  if (faceDown) {
    return (
      <div className={cn(
        "w-20 h-28 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800",
        "border-2 border-blue-400 shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-300",
        className
      )}>
        <div className="text-4xl text-blue-300 opacity-50">🂠</div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className={cn(
        "w-20 h-28 rounded-lg border-2 border-dashed border-muted",
        "opacity-30",
        className
      )} />
    );
  }

  return (
    <div className={cn(
      "w-20 h-28 rounded-lg bg-card border-2 border-card-foreground/10",
      "shadow-xl flex flex-col items-center justify-between p-2",
      "transition-all duration-300 hover:scale-105",
      className
    )}>
      <div className={cn(
        "text-2xl font-bold",
        isRed ? "text-red-600" : "text-card-foreground"
      )}>
        {card.rank}
      </div>
      <div className={cn(
        "text-4xl",
        isRed ? "text-red-600" : "text-card-foreground"
      )}>
        {card.suit}
      </div>
      <div className={cn(
        "text-2xl font-bold",
        isRed ? "text-red-600" : "text-card-foreground"
      )}>
        {card.rank}
      </div>
    </div>
  );
};

export default PlayingCard;
