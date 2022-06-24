import {} from '@qapi/core'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface Adapter<T> {
  new(domain: string,path: string,method: Method):Promise<T>
  new(domain: string,path: string,method: Method,data?: any,data2?: any,data3?: any,):Promise<T>
}

/**
 * 网络请求适配器
 */
export class QApi<U> {
  #instance:QApi<U>

  private name: string // server name
  private adapter: Adapter<unknown> // request 实现
  private errorHandle: (e: Error) => void

  public getInstance(): QAPI<U = unknown> {
    return this.#instance
  }

  public constructor(name: string) {
    this.name = name
  }

  public use(adapter: Adapter): void {
    this.adapter = adapter
  }

  public catch(handle: (e: Error) => void): void {
    this.errorHandle = handle
  }

  /**
   * GET
   */
  public async get<T>(url: string): Promise<T> {
    try {
      return this.adapter<T>(this.name, url, 'GET')
    } catch (e) {
      e.name = this.name
      if (typeof this.errorHandle === 'function') {
        this.errorHandle(e)
      }
      return Promise.reject(e)
    }
  }

  /**
   * Post
   */
   public async post<T>(url: string, data?: any, data2?: any, data3?: any): Promise<T> {
    try {
      return this.adapter<T>(this.name, url, 'POST', data, data2, data3)
    } catch (e) {
      e.name = this.name
      return Promise.reject(e)
    }
  }

  /**
   * Put
   */
   public async put<T>(url: string, data?: any, data2?: any, data3?: any): Promise<T> {
    try {
      return this.adapter<T>(this.name, url, 'PUT', data, data2, data3)
    } catch (e) {
      e.name = this.name
      return Promise.reject(e)
    }
  }

  /**
   * Delete
   */
  public async delete<T>(url: string): Promise<T> {
    try {
      return this.adapter<T>(this.name, url, 'DELETE')
    } catch (e) {
      e.name = this.name
      if (typeof this.errorHandle === 'function') {
        this.errorHandle(e)
      }
      return Promise.reject(e)
    }
  }
}
