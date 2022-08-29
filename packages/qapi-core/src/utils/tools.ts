declare namespace Tools {
  type Whitespace = ' ' | '\n' | '\t' | '\r'

  type TrimStart<S extends string, P extends string = Whitespace> = S extends `${P}${infer R}`
    ? TrimStart<R, P>
    : S

  type EventName<T extends string> = `${T}=${string}`
  type Queries<Q extends string> = `${Q}=${string}`
}

export type QueryFormat = 'indices' | 'brackets' | 'repeat' | 'comma'
export type QueryStringify<T extends unknown[]> = T extends []
  ? ''
  : T extends [string]
  ? `${T[0]}=${string}`
  : T extends [infer F, infer S, ...infer U]
  ?
      | `${QueryStringify<[F, ...U]>}` //
      | `${QueryStringify<[S, ...U]>}` //
      | `${F}=${string}&${QueryStringify<[S, ...U]>}` //
      | `${S}=${string}&${QueryStringify<[F, ...U]>}` //
  : string

// 以下方式成功
export type Queryify<T extends unknown[]> = T extends []
  ? ''
  : T extends [string]
  ? `${T[0]}=${string}`
  : T extends [infer F, infer S, ...infer U]
  ?
      | `${Queryify<[F, ...U]>}` // 全排列组合
      | `${Queryify<[S, ...U]>}`
      | `${F}=${string}&${Queryify<[S, ...U]>}`
      | `${Queryify<[S, ...U]>}&${F}=${string}`
      | `${S}=${string}&${Queryify<[F, ...U]>}`
      | `${Queryify<[F, ...U]>}&${S}=${string}`
  : string
