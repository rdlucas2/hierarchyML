import { Player } from "./Player";
import { Card, Rank, Color } from "./card";
import { MoveData } from "./MoveData";
import config from "../config.json";

export class Game {
    players: Player[];

    constructor(players: Player[]) {
        this.players = players;
        //player with imposter goes first
        this.players[this.players.findIndex((p: Player) => {
            return p.hand.findIndex((c: Card) => {
                return c.rank === Rank.IMPOSTER
            }) >= 0;
        })].isActive = true;
    }


    getActivePlayer(players: Player[]): Player {
        return players[players.findIndex((p: Player) => { return p.isActive; })];
    }

    getInactivePlayer(players: Player[]): Player {
        return players[players.findIndex((p: Player) => { return !p.isActive; })];
    }

    validate(line: Card[], playerHand: Card[]): Card[] {
        //return playerHand;
        let cards: Card[] = [];

        let lastCard = line[line.length - 1];
        let lineLengthIncludingTowerIfPresent = line.length + 1;

        playerHand.forEach((c: Card) => {
            switch (c.rank) {
                case Rank.ASSASSIN:
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.SORCERER &&
                        lastCard.rank != Rank.LEPER &&
                        lastCard.rank != Rank.TOWER
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.LEPER:
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.SORCERER &&
                        lastCard.rank % 2 != 0
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.SERF:
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.SORCERER &&
                        (lastCard.rank < Rank.SERF ||
                            lastCard.rank === Rank.USURPER)
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.TOWER:
                    if (!lastCard) {
                        break;
                    }
                    if (
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
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.SORCERER &&
                        lastCard.rank != Rank.SERF &&
                        (lastCard.rank < Rank.SURGEON ||
                            lastCard.rank === Rank.USURPER)
                    ) {
                        //not valid if only card to bounce is tower
                        cards.push(c);
                    }
                    break;
                case Rank.KNIGHT:
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.SORCERER &&
                        lastCard.rank != Rank.SERF &&
                        (lastCard.rank < Rank.KNIGHT ||
                            lastCard.rank === Rank.DRAGON ||
                            lastCard.rank === Rank.USURPER)
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.USURPER:
                    if (!lastCard) {
                        break;
                    }
                    if (
                        lastCard.rank != Rank.SORCERER &&
                        lastCard.rank > Rank.USURPER
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.SORCERER:
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.USURPER &&
                        lastCard.rank < Rank.SORCERER
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.DRAGON:
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.USURPER &&
                        (lastCard.rank < Rank.DRAGON ||
                            lastCard.rank === Rank.BARONESS)
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.BARONESS:
                    if (!lastCard) {
                        cards.push(c);
                        break;
                    }
                    if (
                        lastCard.rank != Rank.USURPER &&
                        lastCard.rank != Rank.LEPER &&
                        lineLengthIncludingTowerIfPresent <= 7 &&
                        lastCard.rank < Rank.BARONESS
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.HIGH_PRIEST:
                    if (!lastCard) {
                        break;
                    }
                    if (
                        lastCard.rank != Rank.USURPER &&
                        (lastCard.rank === Rank.SERF ||
                            lastCard.rank === Rank.KNIGHT ||
                            lastCard.isRoyalty === true)
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.QUEEN:
                    if (!lastCard) {
                        break;
                    }
                    if (
                        lastCard.rank != Rank.USURPER &&
                        lastCard.rank != Rank.LEPER &&
                        lastCard.rank < Rank.QUEEN &&
                        line.findIndex((b: Card) => { return b.rank === Rank.BARONESS; }) >= 0
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.KING:
                    if (!lastCard) {
                        break;
                    }
                    if (
                        lastCard.rank != Rank.USURPER &&
                        lastCard.rank != Rank.LEPER &&
                        lineLengthIncludingTowerIfPresent >= 7 &&
                        lastCard.rank < Rank.KING
                    ) {
                        cards.push(c);
                    }
                    break;
                case Rank.IMPOSTER:
                    if (!lastCard) {
                        break;
                    } else if (lastCard.rank === Rank.SORCERER) {
                        break;
                    } else {
                        let lineHand: Card[];
                        if (config.canImpersonateTower) {
                            lineHand = line.filter((b: Card) => { return b.rank !== lastCard.rank && b.color !== c.color; });
                        } else {
                            lineHand = line.filter((b: Card) => { return b.rank !== lastCard.rank && b.color !== c.color && b.rank !== Rank.TOWER; });
                        }
                        let validImpersonateCards = this.validate(line, lineHand);
                        if (validImpersonateCards.length > 0) {
                            cards.push(c);
                        }
                    }
                    break;
            }
        });

        return cards;
    }

    //TODO: instead of just returning the first card that comes back ([0]) - try "looking into the future" and running validate recursively?
    evaluateImpersonation(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
        // TODO: implement
        //must choose a valid card to impersonate to beat the last card on the line
        let opponentColor: Color = opponentHand.map((c: Card) => { return c.color; })[0];
        let card: Card = <Card>{};
        if (config.canImpersonateTower) {
            let validCard = this.validate(line, line.filter((c: Card) => { return c.color === opponentColor }))[0];
            if (!validCard) {
                return null;
            }
            Object.assign(card, validCard);
            card.color = playerHand.map((c: Card) => { return c.color; })[0];
            card.name = card.name + " ?";
        } else {
            let validCard = this.validate(line, line.filter((c: Card) => { return c.color === opponentColor && c.rank !== Rank.TOWER }))[0];
            if (!validCard) {
                return null;
            }
            Object.assign(card, validCard);
            card.color = playerHand.map((c: Card) => { return c.color; })[0];
            card.name = card.name + " ?";
        }
        //take into consideration cards you and opponent have left
        return card;
    }

    evaluateDiscard(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
        // TODO: implement
        let lastCard = line[line.length - 1];
        if (lastCard.rank != Rank.LEPER && lastCard.rank != Rank.SERF && lastCard.rank < Rank.TOWER) {
            return null;
        }
        //if the tower isn't in the player hand, then it's the imposter causing the discard
        let card: Card;
        if (playerHand.findIndex((c: Card) => { return c.rank === Rank.TOWER; }) < 0) {
            card = playerHand.filter((c: Card) => { return c.rank !== Rank.IMPOSTER })[0];
        } else {
            card = playerHand.filter((c: Card) => { return c.rank !== Rank.TOWER })[0];
        }
        //take into consideration cards you and opponent have left - and maybe even what's been played already?
        return card;
    }

    evaluateBounce(line: Card[], playerHand: Card[], opponentHand: Card[]): Card {
        // TODO: implement
        if (line.length < 1) {
            return null;
        }

        //cannot bounce tower because it is 2 cards
        let opponentColor: Color = opponentHand.map((c: Card) => { return c.color; })[0];
        let card = line.filter((c: Card) => { return c.rank !== Rank.TOWER && c.color === opponentColor })[0];
        return card;
    }

    evaluateMove(line: Card[], validMoveCards: Card[], playerHand: Card[], opponentHand: Card[]): MoveData {
        // TODO: implement
        let moveData = new MoveData();
        moveData.selectedCard = validMoveCards[0];

        switch (moveData.selectedCard.rank) {
            case Rank.IMPOSTER:
                moveData.cardToImpersonate = this.evaluateImpersonation(line, playerHand, opponentHand);
                if (!moveData.cardToImpersonate) {
                    break;
                }
                switch (moveData.cardToImpersonate.rank) {
                    case Rank.TOWER:
                        //this.removeCard(playerHand, moveData.selectedCard);
                        moveData.cardToDiscard = this.evaluateDiscard(line, playerHand, opponentHand);
                        break;
                    case Rank.SURGEON:
                        //this.removeCard(playerHand, moveData.selectedCard);
                        moveData.cardToBounce = this.evaluateBounce(line, playerHand, opponentHand);
                        break;
                }
                break;
            case Rank.TOWER:
                moveData.cardToDiscard = this.evaluateDiscard(line, playerHand, opponentHand);
                break;
            case Rank.SURGEON:
                moveData.cardToBounce = this.evaluateBounce(line, playerHand, opponentHand);
                break;
        }

        return moveData;
    }

    removeCard(cards: Card[], card: Card): Card {
        return cards.splice(cards.findIndex((c: Card) => { return c.rank === card.rank; }), 1)[0];
    }

    towerAction(moveData: MoveData): void {
        if (moveData.cardToDiscard) {
            console.log(this.getActivePlayer(this.players).name, "Discarding:", JSON.stringify(moveData.cardToDiscard.name));
            this.removeCard(this.getActivePlayer(this.players).hand, moveData.cardToDiscard);
        }
    }

    surgeonAction(moveData: MoveData, line: Card[]): void {
        //player using surgeon returns opponent card
        //other player determines card to return and returns it
        if (moveData.cardToBounce) {
            console.log(this.getActivePlayer(this.players).name, "Bouncing:", JSON.stringify(moveData.cardToBounce.name));
            if (moveData.cardToBounce.wasImposter) {
                moveData.cardToBounce = new Card("Play this as a copy of any card already played by your opponent, except the top card.", Rank.IMPOSTER);
                moveData.cardToBounce.color = this.getActivePlayer(this.players).hand.map((c: Card) => { return c.color })[0];
                moveData.cardToBounce.wasImposter = false;
            }
            this.getInactivePlayer(this.players).hand.push(this.removeCard(line, moveData.cardToBounce));

            let opponentCardToBounce = this.evaluateBounce(line, this.getInactivePlayer(this.players).hand, this.getActivePlayer(this.players).hand);
            console.log(this.getInactivePlayer(this.players).name, "Bouncing:", JSON.stringify(opponentCardToBounce.name));
            if (opponentCardToBounce.wasImposter) {
                opponentCardToBounce = new Card("Play this as a copy of any card already played by your opponent, except the top card.", Rank.IMPOSTER);
                moveData.cardToBounce.color = this.getInactivePlayer(this.players).hand.map((c: Card) => { return c.color })[0];
                opponentCardToBounce.wasImposter = false;
            }
            this.getActivePlayer(this.players).hand.push(this.removeCard(line, opponentCardToBounce));
        }
    }

    run(): void {
        //while no winner...
        let win: boolean = false;
        let validCards: Card[] = [];
        let line: Card[] = [];
        while (!win) {
            console.log(this.getActivePlayer(this.players).name, "Cards In Hand:", this.getActivePlayer(this.players).hand.length, JSON.stringify(this.getActivePlayer(this.players).hand.map((c: Card) => { return c.name; })))
            console.log(this.getInactivePlayer(this.players).name, "Cards In Hand:", this.getInactivePlayer(this.players).hand.length, JSON.stringify(this.getInactivePlayer(this.players).hand.map((c: Card) => { return c.name; })))
            console.log(" ");

            //determine valid plays (if player has no valid moves, other player wins)
            validCards = this.validate(line, this.getActivePlayer(this.players).hand);

            if (validCards.length > 0) {
                console.log(this.getActivePlayer(this.players).name, "Valid Cards:", validCards.length, JSON.stringify(validCards.map((c: Card) => { return c.name; })));
                console.log(" ");
            } else {
                win = !win;
                console.log(this.getInactivePlayer(this.players).name, "Validation", "wins!");
                console.log(" ");
                break;
            }

            //select card to play (determine card to impersonate, discard, or bounce)
            let moveData: MoveData = this.evaluateMove(line, validCards, this.getActivePlayer(this.players).hand, this.getInactivePlayer(this.players).hand);
            //maybe there's a case where while it looks like there's a valid move, on evaulation no card is returned, which means there was no true valid play
            if (!moveData.selectedCard) {
                win = !win;
                console.log(this.getInactivePlayer(this.players).name, "Evaluation", "wins!");
                console.log(" ");
                break;
            } else {
                console.log(this.getActivePlayer(this.players).name, "Choosing Card:", JSON.stringify(moveData.selectedCard.name));
                console.log(" ");
            }

            //place card in line
            line.push(this.removeCard(this.getActivePlayer(this.players).hand, moveData.selectedCard));
            console.log("Line:", line.findIndex((c: Card) => { return c.rank === Rank.TOWER; }) >= 0 ? line.length + 1 : line.length, JSON.stringify(line.map((c: Card) => { return Color[c.color] + " " + c.name; })));
            console.log(" ");

            //determine if any actions need taken (assign imposter, discard for tower, bounce cards for surgeon)
            switch (moveData.selectedCard.rank) {
                case Rank.IMPOSTER:
                    console.log(this.getActivePlayer(this.players).name, "Impersonating:", JSON.stringify(moveData.cardToImpersonate.name));
                    moveData.cardToImpersonate.wasImposter = true;
                    line[line.length - 1] = moveData.cardToImpersonate;
                    switch (moveData.cardToImpersonate.rank) {
                        case Rank.TOWER:
                            this.towerAction(moveData);
                            break;
                        case Rank.SURGEON:
                            this.surgeonAction(moveData, line);
                            break;
                    }
                    break;
                case Rank.TOWER:
                    this.towerAction(moveData);
                    break;
                case Rank.SURGEON:
                    this.surgeonAction(moveData, line);
                    break;
            }

            //next this.players turn
            this.players.forEach((p: Player) => {
                p.isActive = !p.isActive;
            });

            validCards = [];
            console.log(" ");
            console.log("======================================");
        }
    }
}