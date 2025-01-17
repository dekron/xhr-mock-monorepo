/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Mock, MockFunction, ErrorCallbackEvent} from './types';
import createMockFunction from './createMockFunction';
import MockXMLHttpRequest from './MockXMLHttpRequest';


export class XHRMock {
  RealXMLHttpRequest: {new (): XMLHttpRequest};
  win: any;
  baseUrl: string;

  setup(_win: any, { baseUrl }): XHRMock {
    this.win = _win;
    this.baseUrl = baseUrl;
    
    if(!this.RealXMLHttpRequest) {
      this.RealXMLHttpRequest = _win.XMLHttpRequest
    }
    // @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
    this.win.XMLHttpRequest = MockXMLHttpRequest;
    this.reset();
    return this;
  }

  teardown(): XHRMock {
    this.reset();
    this.win.XMLHttpRequest = this.RealXMLHttpRequest;
    return this;
  }

  reset(): XHRMock {
    MockXMLHttpRequest.removeAllHandlers();
    return this;
  }

  error(callback: (event: ErrorCallbackEvent) => void): XHRMock {
    MockXMLHttpRequest.errorCallback = callback;
    return this;
  }

  mock(fn: MockFunction): XHRMock;
  mock(method: string, url: string | RegExp, mock: Mock): XHRMock;
  mock(
    fnOrMethod: string | MockFunction,
    url?: string | RegExp,
    mock?: Mock
  ): XHRMock {
    console.warn(
      'xhr-mock: XHRMock.mock() has been deprecated. Use XHRMock.use() instead.'
    );
    if (
      typeof fnOrMethod === 'string' &&
      (typeof url === 'string' || url instanceof RegExp) &&
      mock !== undefined
    ) {
      return this.use(fnOrMethod, url, mock);
    } else if (typeof fnOrMethod === 'function') {
      return this.use(fnOrMethod);
    } else {
      throw new Error('xhr-mock: Invalid handler.');
    }
  }

  use(fn: MockFunction): XHRMock;
  use(method: string, url: string | RegExp, mock: Mock): XHRMock;
  use(
    fnOrMethod: string | MockFunction,
    url?: string | RegExp,
    mock?: Mock
  ): XHRMock {
    let fn: MockFunction;
    if (
      typeof fnOrMethod === 'string' &&
      (typeof url === 'string' || url instanceof RegExp) &&
      mock !== undefined
    ) {
      fn = createMockFunction(fnOrMethod, url, mock);
    } else if (typeof fnOrMethod === 'function') {
      fn = fnOrMethod;
    } else {
      throw new Error('xhr-mock: Invalid handler.');
    }
    MockXMLHttpRequest.addHandler(fn);
    return this;
  }

  get(url: string | RegExp, mock: Mock): XHRMock {
    return this.use('GET', url, mock);
  }

  post(url: string | RegExp, mock: Mock): XHRMock {
    return this.use('POST', url, mock);
  }

  put(url: string | RegExp, mock: Mock): XHRMock {
    return this.use('PUT', url, mock);
  }

  patch(url: string | RegExp, mock: Mock): XHRMock {
    return this.use('PATCH', url, mock);
  }

  delete(url: string | RegExp, mock: Mock): XHRMock {
    return this.use('DELETE', url, mock);
  }
}

// I'm only using a class so I can make use make use of TS' method overrides
export default new XHRMock();
