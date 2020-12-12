import express from "express";

type TypeDaprPubSub = (req: express.Request, res: express.Response) => Promise<void>;

export default TypeDaprPubSub;