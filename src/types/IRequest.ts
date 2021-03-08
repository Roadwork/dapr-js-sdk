import { IEtag } from "./IEtag";
import { IRequestMetadata } from "./IRequestMetadata";
import { IStateOptions } from "./IStateOptions";

export type IRequest = {
  key: string;
  value: string;
  etag: IEtag;
  metadata: IRequestMetadata;
  options: IStateOptions;
}