import express from 'express';

export type TypeDaprInvokerCallback = (req: express.Request, res: express.Response) => Promise<any>;