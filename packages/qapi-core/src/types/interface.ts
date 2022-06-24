// param
export interface Parameter {
  in: 'body' | 'query' | 'path'
  name: string
  description: string
  required: boolean
  schema?: { $ref?: string; type?: string }
  type?: 'string' | 'array'
  pattern?: string
  items?: {
    type?: string
    refs?: string
  }
}

export interface Method {
  tags: string[]
  summary?: string
  description?: string
  operationId: string
  parameters?: Parameter[]
  responses: {
    [Code in 200 | 302]: Response
  }
}

/**
 * response
 */
export interface Response {
  description: string
  schema?: {
    type?: string
    $ref?: string
    items?: {
      type?: string
      $ref?: string
    }
  }
}

export interface Rule {
  message: string
  required: boolean
  max?: number
  min?: number
  pattern?: string
}

export interface Definitions {
  [bean: string]: Definition
}

export interface Definition {
  $ref?: string
  allOf?: Definition[]
  description?: string
  enum?: string[]
  format?: string
  items?: Definition
  oneOf?: Definition[]
  properties?: { [index: string]: Definition }
  additionalProperties?: boolean | Definition
  required?: string[]
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'

  maxLength: number
  minLength: number
  'x-rules'?: {
    [field: string]: Rule
  }
}

export interface Options {
  camelcase?: boolean
  wrapper?: string | false
  injectWarning?: boolean
}

/**
 * swagger json object 对象
 * swagger version2.0
 */
export interface Swagger {
  swagger: string | number
  info: {
    description: string
    version: string // jar version
    title: string // maven artifactId id
  }
  tags?: {
    name: string
  }[]
  definitions?: Definitions
  paths?: {
    [path: string]: {
      GET: Method
      POST?: Method
      PUT?: Method
      DELETE?: Method
      CONNCET?: Method
    }
  }
}
