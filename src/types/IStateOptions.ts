import { EStateConsistency } from "../enum/EStateConsistency";
import { EStateConcurrency } from "../enum/EStateConcurrency";

export type IStateOptions = {
  concurrency: EStateConcurrency;
  consistency: EStateConsistency;
}