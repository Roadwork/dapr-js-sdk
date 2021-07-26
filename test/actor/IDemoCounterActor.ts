import { IActor } from "../../src";

export default interface IDemoCounterActor extends IActor {
    increment(amount: number): void;
}