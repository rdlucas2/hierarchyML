import { Deck, Card, Color, Rank } from "./models/card";
import { Player } from "./models/Player";
import { Game } from "./models/Game";
import config from './config.json';

let mode = config.mode; // newgame | existing //create a new hand or use an existing

//create players
let player1 = new Player("Light");
let player2 = new Player("Dark");

var players: Player[] = [player1, player2];

//create cards
let deck: Deck = new Deck();
switch(mode) {
    case "newgame":
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

        break;
    case "existing":
        console.log(config);
        console.log(" ");
        config.hands[config.handIndex].lightHand.forEach((cardName: string) => {
            let card = deck.cards.splice(deck.cards.findIndex((c: Card) => { 
                return c.name === cardName;
            }), 1)[0];
            card.color = Color.LIGHT;
            players[0].hand.push(card);
        });
        config.hands[config.handIndex].darkHand.forEach((cardName: string) => {
            let card = deck.cards.splice(deck.cards.findIndex((c: Card) => { 
                return c.name === cardName;
            }), 1)[0];
            card.color = Color.DARK;
            players[1].hand.push(card);
        });
        break;
}

let game: Game = new Game(players);

game.run();