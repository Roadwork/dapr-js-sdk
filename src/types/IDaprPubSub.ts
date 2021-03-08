import express from 'express';

export type TypeDaprPubSub = (req: express.Request, res: express.Response) => Promise<void>;