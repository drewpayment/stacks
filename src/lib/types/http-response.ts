

export interface HttpResponse<T> extends Response {
  json(): Promise<T>;
}