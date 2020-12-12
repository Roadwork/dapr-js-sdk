import express from 'express';

type TypeDaprInvoke = (req: express.Request, res: express.Response) => Promise<void>;

export default TypeDaprInvoke;
