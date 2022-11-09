import { IKeyboardHandler, IRequest, IShortcut, Occurances } from '~/interfaces/key-handler'

export default class KeyboardHandler implements IKeyboardHandler {

  requests: IRequest[]

  constructor(requests: IRequest[]) {

    this.requests = (this.prepareRequests(requests))
    this.createStack()
  }

  defaultTestMethod(): boolean {
    return true
  }

  createStack(): void {
    document.addEventListener('keydown', e => this.handler(e, Occurances.BEFORE), false)
    document.addEventListener('keyup', e => this.handler(e, Occurances.AFTER), false)
  }

  removeRequest(name: string): void {
    var index = this.requests.findIndex(x => x.name === name)

    if (index > -1)
      this.requests.splice(index, 1)
  }

  handler(e: any, occurance: Occurances): void {
    var request = this.requests.find(x =>
      (x.test!(this, e)) &&
      (x.occurance === occurance) &&
      (x.shortcut.keyCode === e.keyCode) &&
      (typeof x.shortcut.ctrlKey === 'undefined' || x.shortcut.ctrlKey === e.ctrlKey) &&
      (typeof x.shortcut.altKey === 'undefined' || x.shortcut.altKey === e.altKey) &&
      (typeof x.shortcut.shiftKey === 'undefined' || x.shortcut.shiftKey === e.shiftKey))
      
      if (request) {
      e.preventDefault()
      request.handler(e, this)
    }
  }


  prepareRequests(requests: IRequest[]): IRequest[] {

    for (var req of requests) {

      if (!req.name)
        throw new Error('the name of key handler must have a value')

      if (!req.test || typeof req.test !== 'function')
        req.test = this.defaultTestMethod

      if (!req.occurance)
        req.occurance = Occurances.BEFORE

    }

    return requests
  }
}