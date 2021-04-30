import express from "express";
import http from "http";
import { AddressInfo } from "net";

export default class WebServerSingleton {
  private static instance: WebServerSingleton;
  isInitialized: boolean;
  express: express.Application | null;
  expressListener: http.Server | null;

  private constructor() {
    this.isInitialized = false;    
    this.expressListener = null;
    this.express = null;
  }

  static getInstance(): WebServerSingleton {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }
  
  async getServer(): Promise<express.Application> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // throw new Error(JSON.stringify({
    //   code: 'WEB_SERVER_NOT_INITIALIZED',
    //   message: "The WebServerSingleton instance was not initialized, did you run `await myClass.getInstance().initialize()`?"
    // }));

    return this.express as express.Application;
  }
  
  async getServerListener(): Promise<http.Server> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.expressListener as http.Server;
  }
  
  async getServerListenerAddress(): Promise<AddressInfo> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.expressListener?.address() as AddressInfo;
  }
  
  async getServerListenerUrl(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const address = this.expressListener?.address() as AddressInfo;
    // return `http://${address.address}:${address.port}`;
    return `http://127.0.0.1:${address.port}`;
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.expressListener?.close();
      this.isInitialized = false;
      return resolve();
    })
  }

  async initialize(): Promise<void> {
    const appPort = process.env.DAPR_APP_PORT || 0;

    await (new Promise<void>(async (resolve, reject) => {
      this.express = express();
      this.express.use(express.json({ type: 'application/*+json' })); // Required for application/cloudevents+json
      this.express.use(express.json());
      this.expressListener = this.express.listen(appPort, resolve);
    }));

    const expressListenerAddress = this.expressListener?.address() as AddressInfo;
    console.log(`Listening on ${expressListenerAddress.address}${expressListenerAddress.port}`);

    this.isInitialized = true;
  }
}