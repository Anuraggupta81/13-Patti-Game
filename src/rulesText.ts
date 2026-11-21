/**
 * In-app rules summary. This describes the variant implemented in the engine.
 * Replace with the final rules text once the rules source is confirmed.
 */
export const RULES_TEXT = `GOAL
Score the most points over the match.

SETUP
Each round uses a standard 52-card deck. Each of the 4 players (you and 3 computer rivals) gets 13 cards.

ARRANGE
Split your 13 cards into four 3-card hands plus one spare card. You have a time limit to arrange them. Tap a card, then tap another to swap them. Suggest arranges your cards for you. Show cards locks your arrangement in.

HAND RANKINGS (strongest first)
1. Trail: three of a kind
2. Pure sequence: three consecutive cards of the same suit
3. Sequence: three consecutive cards (Q-K-A is the highest; A-2-3 is the lowest)
4. Color: three cards of the same suit
5. Pair: two cards of the same rank
6. High card: otherwise, compared card by card from the top

REVEAL
Hands are revealed one at a time, from Hand 1 to Hand 4. The strongest hand in each position wins a point. If two hands are exactly equal, the spare card breaks the tie.

SWEEP BONUS
If you win all 4 hands in a round, you get the sweep bonus set in House rules.

WINNING
Play the number of rounds set in House rules. The player with the most total points wins the match.

STARS
Win a match to earn stars: Easy 1, Medium 2, Hard 3. Stars unlock new avatars.`;
