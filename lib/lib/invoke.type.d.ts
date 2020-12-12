import express from "express";
declare type TypeDaprInvoke = (req: express.Request, res: express.Response) => Promise<void>;
export default TypeDaprInvoke;
