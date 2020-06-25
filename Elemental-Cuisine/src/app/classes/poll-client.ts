import { GameRate, WaiterRate } from './enums/Polls';

export class PollClient {
    userId: string;
    userName: string;
    commentary: string;
    satisfactionRate: number = 5;
    gamesRate: GameRate = GameRate.None;
    waiterRate: WaiterRate = WaiterRate.Regular;
    toImprove: Array<string> = new Array<string>();
    photos: Array<string>;
}