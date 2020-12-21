export function serializeError(msg: any) {
  if (typeof msg === "string") {
    throw new Error(msg);
  } else {
    throw new Error(JSON.stringify(msg));
  }
}