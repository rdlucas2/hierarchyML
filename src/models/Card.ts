export enum Rank {
    IMPOSTER = 0,
    ASSASSIN,
    LEPER,
    SERF,
    TOWER,
    SURGEON,
    KNIGHT,
    USURPER,
    SORCERER,
    DRAGON,
    BARONESS,
    HIGH_PRIEST,
    QUEEN,
    KING
}

export enum Color {
    LIGHT,
    DARK
}

export class Card {
    constructor(ability: string, rank: Rank, isRoyalty: boolean = false) {
        this.name = Rank[rank];
        this.ability = ability;
        this.rank = rank;
        this.isRoyalty = isRoyalty;
    }

    name: string;
    isRoyalty: boolean;
    wasImposter: boolean;

    ability: string;
    rank: Rank;
    color: Color;
}

export class Deck {
    cards: Card[] = [
        new Card("Play this as a copy of any card already played by your opponent, except the top card.", Rank.IMPOSTER),
        new Card("May be played atop any card except the Tower and Leper", Rank.ASSASSIN),
        new Card("May be played atop any odd numbered card. Royalty and the Assassin may not be played atop the Leper.", Rank.LEPER),
        new Card("Counts as a 7 while it is the top card.", Rank.SERF),
        new Card("You may discard a card to play this atop any card except the Leper (Requires at least one card in play). Counts as two cards.", Rank.TOWER, true),
        new Card("Return an opponent's card to their hand. Then they return one of your other cards to your hand.", Rank.SURGEON),
        new Card("May be played atop the Dragon.", Rank.KNIGHT),
        new Card("Must be played atop a card with a higher value. A card with a lower value must be played atop this.", Rank.USURPER),
        new Card("Cards in hands have no abilities.", Rank.SORCERER),
        new Card("May be played atop the Baroness.", Rank.DRAGON),
        new Card("May only be played when the line has 7 or fewer cards in it.", Rank.BARONESS, true),
        new Card("May only be played atop the Knight, Serf, or Royalty.", Rank.HIGH_PRIEST),
        new Card("May only be played when the line has the Baroness in it.", Rank.QUEEN, true),
        new Card("May only be played when the line has 7 or more cards in it.", Rank.KING, true)        
    ];

    shuffle(): void {
        var j, x, i;
        for (i = this.cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = x;
        }
    }
}