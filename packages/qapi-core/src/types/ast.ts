import { JSONSchema4Type } from 'json-schema'

export type AST_TYPE = AST['type']

namespace Types {
  export interface Any extends AbstractAST {
    type: 'ANY'
  }

  export interface Array extends AbstractAST {
    type: 'ARRAY'
    params: AST
  }

  export interface Boolean extends AbstractAST {
    type: 'BOOLEAN'
  }

  export interface Enum extends AbstractAST {
    standaloneName: string
    type: 'ENUM'
    params: EnumParam[]
  }

  export interface EnumParam {
    ast: AST
    keyName: string
  }

  export interface Interface extends AbstractAST {
    type: 'INTERFACE'
    params: InterfaceParam[]
    superTypes: NamedInterface[]
  }

  export interface NamedInterface extends AbstractAST {
    standaloneName: string
    type: 'INTERFACE'
    params: InterfaceParam[]
    superTypes: NamedInterface[]
  }

  export interface InterfaceParam {
    ast: AST
    keyName: string
    isRequired: boolean
    isPatternProperty: boolean
    isUnreachableDefinition: boolean
  }

  export interface Intersection extends AbstractAST {
    type: 'INTERSECTION'
    params: AST[]
  }

  export interface Literal extends AbstractAST {
    params: JSONSchema4Type
    type: 'LITERAL'
  }

  export interface Number extends AbstractAST {
    type: 'NUMBER'
  }

  export interface Null extends AbstractAST {
    type: 'NULL'
  }

  export interface Object extends AbstractAST {
    type: 'OBJECT'
  }

  export interface Reference extends AbstractAST {
    type: 'REFERENCE'
    params: string
  }

  export interface String extends AbstractAST {
    type: 'STRING'
  }

  export interface Tuple extends AbstractAST {
    type: 'TUPLE'
    params: AST[]
    spreadParam?: AST
    minItems: number
    maxItems?: number
  }

  export interface Union extends AbstractAST {
    type: 'UNION'
    params: AST[]
  }

  export interface Unknown extends AbstractAST {
    type: 'UNKNOWN'
  }

  export interface CustomType extends AbstractAST {
    type: 'CUSTOM_TYPE'
    params: string
  }
}

export type AST =
  | Types.Any
  | Types.Array
  | Types.Boolean
  | Types.Enum
  | Types.Interface
  | Types.NamedInterface
  | Types.Intersection
  | Types.Literal
  | Types.Number
  | Types.Null
  | Types.Object
  | Types.Reference
  | Types.String
  | Types.Tuple
  | Types.Union
  | Types.Unknown
  | Types.CustomType

export interface AbstractAST {
  comment?: string
  keyName?: string
  standaloneName?: string
  type: AST_TYPE
}

export type ASTWithComment = AST & { comment: string }
export type ASTWithName = AST & { keyName: string }
export type ASTWithStandaloneName = AST & { standaloneName: string }

export function hasComment(ast: AST): ast is ASTWithComment {
  return 'comment' in ast && ast.comment != null && ast.comment !== ''
}

export function hasStandaloneName(ast: AST): ast is ASTWithStandaloneName {
  return 'standaloneName' in ast && ast.standaloneName != null && ast.standaloneName !== ''
}

////////////////////////////////////////////     literals

export const T_ANY: Types.Any = {
  type: 'ANY',
}

export const T_ANY_ADDITIONAL_PROPERTIES: Types.Any & ASTWithName = {
  keyName: '[k: string]',
  type: 'ANY',
}

export const T_UNKNOWN: Types.Unknown = {
  type: 'UNKNOWN',
}

export const T_UNKNOWN_ADDITIONAL_PROPERTIES: Types.Unknown & ASTWithName = {
  keyName: '[k: string]',
  type: 'UNKNOWN',
}
