export declare namespace QapiType {
  interface Response {}
}

export interface Options {
  // address of swagger.json
  url?:string

  // address of output file
  dir:true

  // export to language(js | ts)
  language:'javascript'|'typescript'

  // supportd mixed of "{method}{path}"
  methodName?:string

  // prefix value
  prefix?:string

  // suffix value
  ignore?:string[]

  /**
   * dd
   * @default false
   * @author yalda
   */
  methodParamByTag:boolean

  // for generate ract hooks of all APIS
  keepJson?:boolean
}


/**
 * query format 类型
 * @description format 类型
 */
export type QueryFormat = 'indices' | 'brackets' | 'repeat' | 'comma'

/**
 * 可以列举出所有情况（全排列组合）
 * @description
 */
export type Queryify<T extends unknown[]> = T extends []
  ? ''
  : T extends [string]
  ? `${T[0]}=${string}`
  : T extends [infer F, infer S, ...infer U]
  ?
      | `${Queryify<[F, ...U]>}`
      | `${Queryify<[S, ...U]>}`
      | `${F}=${string}&${Queryify<[S, ...U]>}`
      | `${Queryify<[S, ...U]>}&${F}=${string}`
      | `${S}=${string}&${Queryify<[F, ...U]>}`
      | `${Queryify<[F, ...U]>}&${S}=${string}`
  : string
