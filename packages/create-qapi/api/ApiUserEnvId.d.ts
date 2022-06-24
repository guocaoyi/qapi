import type { Queryify } from './types'

declare namespace Qapi {
  namespace xxx {
    namespace ApiUserEnvId {
      export type URL = '/api/user/env'
    }
  }
}

export const s: Qapi.xxx.ApiUserEnvId.URL = '/api/user/env'

/**
 * 查询所有用户
 * @description 正在运行的营销互动
 * @summary 正在运行的营销互动
 * @tag o2o-查询正在运行的营销互动
 * @path /api/user/env/{id}
 * @version 1.0.1-beta.1
 * @generator qapi(1.1.0)
 */
declare namespace ApiUserEnvId {
  type Path$Id = number
  type Path$Code = string
  /**
   * 该方案可以使用
   * @type {[Path$Id,Path$Code]} [string,string]
   */
  export interface Path {
    /**
     * 环境编号
     * @name id
     */
    0: Path$Id

    /**
     * 环境编码
     * @name code
     */
    1: Path$Code
  }

  /**
   * @interface
   */
  export interface Query {
    /** 自编号 */
    pk?: string
    /** 父编号 */
    pid?: string
    /** 查询乐队名称 */
    query?: string
  }

  /**
   * Request
   */
  export interface Body {
    /**
     * 父编号
     */
    pid: number
    /**
     * 自编号
     */
    pk: number
    /**
     * 查询乐队名称
     */
    query: string
  }

  export type URL = `/api/user/env/${Path[0]}`

  export type URL$Path = `/api/user/env/${Path[1]}`

  export type URL$Path1 = `/api/user/env/${Path[1]}`

  export type Search = Queryify<['pid', 'pk', 'query']> | ''

  /**
   * Response
   * successful operation
   */
  export interface Response {
    /**
     * 总数据量
     */
    totle: number
    /**
     * 页码
     */
    pageSize: number
    /**
     * 页数
     */
    pageNum: number
    /**
     * 返回信息
     */
    message: string
    /**
     * BodyData
     */
    data: {
      /**
       * 环境名称
       */
      name: string
      /**
       * 环境信息
       */
      remark: string
      /**
       * ossKey
       */
      ossKey: string
      /**
       * oss密码
       */
      ossPass: string
      /**
       * oss地址
       */
      ossAddress: string
      /**
       * 环境Id
       */
      envId: number
    }[]
  }

  /**
   * 查询所有用户
   * @method Get
   * @param {URL} url
   * @returns {Promise<Response> | Response}
   */
  export interface Get<Async extends boolean = false> {
    (url: URL): Async extends false ? Response : Promise<Response>
  }

  /**
   * 查询所有用户
   * @method Post
   * @param {URL} url
   * @param {EmptyObject} body
   * @returns {Response}
   */
  export interface Post<Async extends boolean = false> {
    (url: URL, body: Body): Async extends false ? Response : Promise<Response>
  }
}

/**
 * @interface
 */
declare namespace ApiUserEnvId {
  // UNSAFE_* 具有相同的结构类型；开发时正常使用，生产时谨慎使用；

  /**
   * unsafe oss
   */
  export interface UNSAFE_OSS {
    /**
     * 环境名称
     */
    name: string
    /**
     * 环境信息
     */
    remark: string
    /**
     * ossKey
     */
    ossKey: string
    /**
     * oss密码
     */
    ossPass: string
    /**
     * oss地址
     */
    ossAddress: string
    /**
     * 环境Id
     */
    envId: number
  }

  /**
   * unsafe shape for structural types
   */
  export interface UNSAFE_Response {
    /**
     * 总数据量
     */
    totle: number
    /**
     * 页码
     */
    pageSize: number
    /**
     * 页数
     */
    pageNum: number
    /**
     * 返回信息
     */
    message: string
    /**
     * BodyData
     */
    data: UNSAFE_OSS[]
  }
}
