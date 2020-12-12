import express from "express";
declare type TypeDaprPubSub = (req: express.Request, res: express.Response) => Promise<void>;
export default TypeDaprPubSub;
