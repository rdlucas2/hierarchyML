import { Card } from "./card";

export class Player {
    constructor(name: string) {
        this.name = name;
    }
    name: string;
    hand: Card[] = [];
    isActive: boolean = false;
}