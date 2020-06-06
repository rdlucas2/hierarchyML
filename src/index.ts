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
    //return playerHand;
    let cards: Card[] = [];

    let lastCard = line[line.length - 1];
    let lineLengthIncludingTowerIfPresent = line.length + 1;

    playerHand.forEach((c: Card) => {
        switch(c.rank) {
            case Rank.ASSASSIN:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.SORCERER &&
                    lastCard.rank != Rank.LEPER && 
                    lastCard.rank != Rank.TOWER
                ) {
                    cards.push(c);
                }
                break;
            case Rank.LEPER:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.SORCERER &&
                    lastCard.rank % 2 != 0
                ) {
                    cards.push(c);
                }
                break;
            case Rank.SERF:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.SORCERER &&
                    (lastCard.rank < Rank.SERF ||
                    lastCard.rank === Rank.USURPER)
                ) {
                    cards.push(c);
                }
                break;
            case Rank.TOWER:
                if(!lastCard) {
                    break;
                }
                if(
                    (lastCard.rank != Rank.SORCERER &&
                    lastCard.rank != Rank.LEPER &&
                    (lastCard.rank < Rank.TOWER ||
                    playerHand.length > 1
                    ))
                ) {
                    cards.push(c);
                }
                break;
            case Rank.SURGEON:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.SORCERER &&
                    lastCard.rank != Rank.SERF &&
                    (lastCard.rank < Rank.SURGEON ||
                    lastCard.rank === Rank.USURPER)
                ) {
                    cards.push(c);
                }
                break;
            case Rank.KNIGHT:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.SORCERER &&
                    lastCard.rank != Rank.SERF &&
                    (lastCard.rank < Rank.KNIGHT ||
                    lastCard.rank === Rank.DRAGON)
                ) {
                    cards.push(c);
                }
                break;
            case Rank.USURPER:
                if(!lastCard) {
                    break;
                }
                if(
                    lastCard.rank != Rank.SORCERER &&
                    lastCard.rank > Rank.USURPER                 
                ) {
                    cards.push(c);
                }
                break;
            case Rank.SORCERER:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.USURPER &&
                    lastCard.rank < Rank.SORCERER
                ) {
                    cards.push(c);
                }
                break;
            case Rank.DRAGON:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.USURPER &&
                    (lastCard.rank < Rank.DRAGON ||
                    lastCard.rank === Rank.BARONESS)
                ) {
                    cards.push(c);
                }
                break;
            case Rank.BARONESS:
                if(!lastCard) {
                    cards.push(c);
                    break;
                }
                if(
                    lastCard.rank != Rank.USURPER &&
                    lastCard.rank != Rank.LEPER &&
                    lineLengthIncludingTowerIfPresent <= 7 &&
                    lastCard.rank < Rank.BARONESS
                ) {
                    cards.push(c);
                }
                break;
            case Rank.HIGH_PRIEST:
                if(!lastCard) {
                    break;
                }
                if(
                    lastCard.rank != Rank.USURPER &&
                    (lastCard.rank === Rank.SERF ||
                    lastCard.rank === Rank.KNIGHT ||
                    lastCard.isRoyalty === true)
                ) {
                    cards.push(c);
                }
                break;
            case Rank.QUEEN:
                if(!lastCard) {
                    break;
                }
                if(
                    lastCard.rank != Rank.USURPER &&
                    lastCard.rank != Rank.LEPER &&
                    lastCard.rank < Rank.QUEEN &&
                    line.findIndex((c: Card) => { return c.rank === Rank.BARONESS;}) >= 0
                ) {
                    cards.push(c);
                }
                break;
            case Rank.KING:
                if(!lastCard) {
                    break;
                }
                if(
                    lastCard.rank != Rank.USURPER &&
                    lastCard.rank != Rank.LEPER &&
                    lineLengthIncludingTowerIfPresent >= 7 &&
                    lastCard.rank < Rank.KING
                ) {
                    cards.push(c);
                }
                break;
            case Rank.IMPOSTER:
                if(!lastCard) {
                    break;
                } else {
                    let lineHand = line.filter((c: Card) => { return c.rank !== lastCard.rank; });
                    let validImpersonateCards = validate(line, lineHand);
                    if(validImpersonateCards.length > 0) {
                        cards.push(c);
                    }
                }
                break;
        }
    });

    return cards;
}

function evaluateImpersonation(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
    // TODO: implement
    //must choose a valid card to impersonate to beat the last card on the line
    let card = validate(line, line)[0];
    //take into consideration cards you and opponent have left
    return card;
}

function evaluateDiscard(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
    // TODO: implement
    let lastCard = line[line.length - 1];
    if(lastCard.rank != Rank.LEPER && lastCard.rank != Rank.SERF && lastCard.rank < Rank.TOWER ) {
        return null;
    }
    let card = playerHand[0];
    //take into consideration cards you and opponent have left - and maybe even what's been played already?
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
    console.log(getActivePlayer(players).name, "Cards In Hand:", JSON.stringify(getActivePlayer(players).hand.map((c: Card) => { return c.name; })))
    console.log(getInactivePlayer(players).name, "Cards In Hand:", JSON.stringify(getInactivePlayer(players).hand.map((c: Card) => { return c.name; })))
    console.log(" ");

    //determine valid plays (if player has no valid moves, other player wins)
    validCards = validate(line, getActivePlayer(players).hand);

    if(validCards.length > 0) {
        console.log(getActivePlayer(players).name, "Valid Cards:", JSON.stringify(validCards.map((c: Card) => {return c.name;})));
        console.log(" ");
    } else {
        win = !win;
        console.log(getInactivePlayer(players).name + " wins!");
        console.log(" ");
        break;
    }
    
    //select card to play (determine card to impersonate, discard, or bounce)
    let moveData: MoveData = evaluateMove(line, validCards, getActivePlayer(players).hand, getInactivePlayer(players).hand);
    console.log(getActivePlayer(players).name, "Choosing Card:", JSON.stringify(moveData.selectedCard.name));
    console.log(" ");

    //place card in line
    line.push(removeCard(getActivePlayer(players).hand, moveData.selectedCard));
    console.log("Line:", JSON.stringify(line.map((c: Card) => { return c.name; })));
    console.log(" ");

    //determine if any actions need taken (assign imposter, discard for tower, bounce cards for surgeon)
    switch(moveData.selectedCard.rank) {
        case Rank.IMPOSTER:
            console.log(getActivePlayer(players).name, "Impersonating:", JSON.stringify(moveData.cardToImpersonate.name));
            moveData.cardToImpersonate.wasImposter = true;
            line[line.length - 1] = moveData.cardToImpersonate;
            break;
        case Rank.TOWER:
            if(moveData.cardToDiscard) {
                console.log(getActivePlayer(players).name, "Discarding:", JSON.stringify(moveData.cardToDiscard.name));
                removeCard(getActivePlayer(players).hand, moveData.cardToDiscard);
            }
            break;
        case Rank.SURGEON:
            //player using surgeon returns opponent card
            //other player determines card to return and returns it
            if(moveData.cardToBounce) {
                console.log(getActivePlayer(players).name, "Bouncing:", JSON.stringify(moveData.cardToBounce.name));
                getInactivePlayer(players).hand.push(removeCard(line, moveData.cardToBounce));
                let opponentCardToBounce = evaluateBounce(line, getInactivePlayer(players).hand, getActivePlayer(players).hand);
                console.log(getInactivePlayer(players).name, "Bouncing:", JSON.stringify(opponentCardToBounce.name));
                getActivePlayer(players).hand.push(removeCard(line, opponentCardToBounce));
            }
            break;
    }

    //next players turn
    players.forEach((p: Player) => {
        p.isActive = !p.isActive;
    });

    validCards = [];
    console.log(" ");
    console.log("======================================");
}

//ML?

//reset game
