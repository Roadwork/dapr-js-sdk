export interface ResActorDeactivateDto {
    entities?: string[];
    actorIdleTimeout?: string;
    actorScanInterval?: string;
    drainOngoingCallTimeout?: string;
    drainRebalancedActors?: boolean;
}
