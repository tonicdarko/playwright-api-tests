import { expect as baseExpect } from '@playwright/test';
import { APIlogger } from './logger';

let apiLogger: APIlogger

export const setCustomExpectLogger = (logger: APIlogger) => {
    apiLogger = logger;
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T>{
            shouldEqual(expected: T): R;
        }
    }
}
export const expect = baseExpect.extend({
shouldEqual(received: any, expected: any){
    let pass: boolean;
    let logs: string = "";
    try {
      baseExpect(received).toEqual(expected)
      pass = true;
      if(this.isNot){
        logs = apiLogger.getRecentLogs();
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getRecentLogs();
    }

    const hint = this.isNot ? 'not':''   
    const message =  this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}\n\n` +
          `Recent API Activity: \n${logs}`

    return {
      message: () => message,
      pass
    };
}
})