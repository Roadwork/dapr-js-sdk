import fetch from 'node-fetch';
import express from 'express';
import ResponseUtil from '../utils/Response.util';

export default class DaprInvoker {
  daprUrl: string;
  express: express.Application;

  constructor(express: express.Application, daprUrl: string) {
    this.daprUrl = daprUrl;
    this.express = express;
  }

  async invoke(appId: string, methodName: string, data: object = {}) {
    const res = await fetch(`${this.daprUrl}/invoke/${appId}/method/${methodName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return ResponseUtil.handleResponse(res);
  }
}
