import express from 'express';

export type TypeDaprInvoke = (req: express.Request, res: express.Response) => Promise<void>;