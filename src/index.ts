import { Deck, Card, Color, Rank } from "./models/card";
import { Player } from "./models/Player";
import { MoveData } from "./models/MoveData";

//create players
let player1 = new Player("p1");
let player2 = new Player("p2");

let players: Player[] = [player1, player2];

//create cards
let deck = new Deck();

//shuffle cards
deck.shuffle();

//change color of cards
deck.cards.forEach((c: Card, i: number) => {
    c.color = i < 7 ? Color.LIGHT : Color.DARK;
});

//distribute cards to players
player1.hand = deck.cards.filter((c: Card) => {
    return c.color === Color.LIGHT;
});

player2.hand = deck.cards.filter((c: Card) => {
    return c.color === Color.DARK;
});

//player with imposter goes first
players[players.findIndex((p: Player) => { return p.hand.findIndex((c: Card) => { return c.rank === Rank.IMPOSTER }) >= 0; })].isActive = true;

function getActivePlayer(players: Player[]): Player {
    return players[players.findIndex((p: Player) => { return p.isActive; })];
}

function getInactivePlayer(players: Player[]): Player {
    return players[players.findIndex((p: Player) => { return !p.isActive; })];
}

function validate(line: Card[], playerHand: Card[]): Card[] {
    // TODO: implement
    return playerHand;
    let cards: Card[] = [];
    return cards;
}

function evaluateImpersonation(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
    // TODO: implement
    let card = line[0];
    return card;
}

function evaluateDiscard(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
    // TODO: implement
    let card = line[0];
    return card;
}

function evaluateBounce(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
    // TODO: implement
    if(line.length < 1) {
        return null;
    }
    let card = line[0];
    return card;
}

function evaluateMove(line: Card[], validMoveCards: Card[], playerHand: Card[], opponentHand: Card[]): MoveData {
    // TODO: implement
    let moveData = new MoveData();
    moveData.selectedCard = validMoveCards[0];

    switch(moveData.selectedCard.rank) {
        case Rank.IMPOSTER:
            moveData.cardToImpersonate = evaluateImpersonation(line, playerHand, opponentHand);
            break;
        case Rank.TOWER:
            moveData.cardToDiscard = evaluateDiscard(line, playerHand, opponentHand);
            break;
        case Rank.SURGEON:
            moveData.cardToBounce = evaluateBounce(line, playerHand, opponentHand);
            break;
    }

    return moveData;
}

function removeCard(cards: Card[], card: Card): Card {
    return cards.splice(cards.findIndex((c: Card) => { return c.rank === card.rank; }), 1)[0];
}

//while no winner...
let win: boolean = false;
let line: Card[] = [];
let validCards: Card[] = [];
while(!win) {
    //determine valid plays (if player has no valid moves, other player wins)
    validCards = validate(line, getActivePlayer(players).hand);

    if(validCards.length === 0) {
        win = !win;
        console.log(getInactivePlayer(players).name + " wins!");
        break;
    }

    //select card to play (determine card to impersonate, discard, or bounce)
    let moveData: MoveData = evaluateMove(line, validCards, getActivePlayer(players).hand, getInactivePlayer(players).hand);

    //place card in line
    line.push(removeCard(getActivePlayer(players).hand, moveData.selectedCard));

    //determine if any actions need taken (assign imposter, discard for tower, bounce cards for surgeon)
    switch(moveData.selectedCard.rank) {
        case Rank.IMPOSTER:
            line[line.length - 1] = moveData.cardToImpersonate;
            break;
        case Rank.TOWER:
            if(moveData.cardToDiscard) {
                removeCard(getActivePlayer(players).hand, moveData.cardToDiscard);
            }
            break;
        case Rank.SURGEON:
            //player using surgeon returns opponent card
            //other player determines card to return and returns it
            if(moveData.cardToBounce) {
                getInactivePlayer(players).hand.push(removeCard(line, moveData.cardToBounce));
                getActivePlayer(players).hand.push(removeCard(line, evaluateBounce(line, getInactivePlayer(players).hand, getActivePlayer(players).hand)));
            }
            break;
    }

    //next players turn
    players.forEach((p: Player) => {
        p.isActive = !p.isActive;
    });

    validCards = [];
}

//ML?

//reset game
