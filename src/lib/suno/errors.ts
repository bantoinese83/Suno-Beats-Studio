export class SunoConfigError extends Error {
  override readonly name = "SunoConfigError";
}

export class SunoRequestError extends Error {
  override readonly name = "SunoRequestError";

  constructor(
    message: string,
    readonly apiCode: number,
    readonly sunoMessage: string,
  ) {
    super(message);
  }
}

export class SunoTransportError extends Error {
  override readonly name = "SunoTransportError";

  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
  }
}
