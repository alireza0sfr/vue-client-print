import { useGeneralStore } from '~/stores/general'
import { ILogger } from '~/interfaces/general'
import { LoggerBase, LoggerLevels } from '~/enums/general'

const generalStore = useGeneralStore()
class Logger implements ILogger {

  isDevBuild: boolean
  level: LoggerLevels
  levels: typeof LoggerLevels = LoggerLevels
  logOnBuild: boolean
  readonly DISPATCHELEMENTID: string

  constructor(level = LoggerLevels.LOG, logOnBuild = false) {

    //@ts-ignore
    this.isDevBuild = import.meta.env.DEV
    this.level = level
    this.logOnBuild = logOnBuild
    this.DISPATCHELEMENTID = 'VCP'
  }

  validate(level: LoggerLevels, force?: boolean) {

    if (force)
      return true

    if (!this.isDevBuild && !this.logOnBuild)
      return false

    if (level < this.level)
      return false

    return true
  }

  alert(message: any, level?: LoggerLevels, forceAlert?: boolean): void {

    if (this.level !== LoggerLevels.OFF) {

      if (generalStore.getByKey('configurations').useAlert || forceAlert)
        alert(message)

      else if (level === LoggerLevels.ERROR) {
        this.error(message)
        this.dispatchEvent('vcp-error', message)
      }

      else
        this.log(message)
    }

  }

  time(func: () => any): void {
    console.time()
    func()
    console.timeEnd()
  }

  debug(...messages: any[]): void {
    if (this.validate(LoggerLevels.DEBUG))
      console.log(LoggerBase.DEBUG, ...messages)
  }

  log(...messages: any[]): void {
    if (this.validate(LoggerLevels.LOG))
      console.log(LoggerBase.LOG, ...messages)
  }

  force(...messages: any[]): void {
    console.log(LoggerBase.FORCE, ...messages)
  }

  warn(...messages: any[]): void {
    if (this.validate(LoggerLevels.WARN))
      console.warn(LoggerBase.WARN, ...messages)
  }

  error(...messages: any[]): void {
    if (this.validate(LoggerLevels.ERROR))
      console.error(LoggerBase.ERROR, ...messages)
  }

  info(...messages: any[]): void {
    if (this.validate(LoggerLevels.INFO))
      console.log(LoggerBase.INFO, ...messages)
  }

  getCurrentLevel(): LoggerLevels {
    return this.level
  }

  setLevel(level: LoggerLevels): void {
    this.level = level
  }

  clear() {
    console.clear()
  }

  customHandler(func: () => any, level = LoggerLevels.LOG): void {
    if (this.validate(level))
      func()
  }

  dispatchEvent(type: string, message: string) {
    const element = document.getElementById(this.DISPATCHELEMENTID)

    if (element) {
      element.dispatchEvent(new CustomEvent(type, {
        detail: {
          error: message
        }
      }))
    }
  }
}

const globalLogger = new Logger()
export { Logger as LoggerInstance }
export default globalLogger