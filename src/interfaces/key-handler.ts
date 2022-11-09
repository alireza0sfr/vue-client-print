export interface IShortcut {
  keyCode: number
  altKey?: boolean
  shiftKey: boolean
  ctrlKey?: boolean
}

export interface IRequest {
  name: string,
  shortcut: IShortcut
  handler(instance: IKeyboardHandler, e: any): any
  test?(instance: IKeyboardHandler, e: any): boolean
  occurance?: Occurances
}

export interface IKeyboardHandler {
  requests: IRequest[]

  defaultTestMethod(): boolean
  createStack(): void
  removeRequest(name: string): void
  handler(e: any, occurance: Occurances): void
  prepareRequests(requests: IRequest[]): IRequest[]
}

export enum Occurances {
  BEFORE = 'before',
  AFTER = 'after'
}