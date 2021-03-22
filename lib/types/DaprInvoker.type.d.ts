import express from 'express';
export declare type TypeDaprInvoke = (req: express.Request, res: express.Response) => Promise<void>;
