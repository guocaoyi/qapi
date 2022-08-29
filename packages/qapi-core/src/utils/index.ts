import Debug from 'debug'

import { Parameter, Definition, Definitions } from './src/interface'

const debug = Debug('UTIL')

/**
 * 特殊符号去除:- _ . {}
 */
export const removeAndCamelCase = (path: string): string => {
  if (!path) {
    return '_'
  }
  return path
    .split('/')
    .map((c, i) => {
      c = c.replace(/{|}/g, '')
      return i === 0 ? c : c.charAt(0).toUpperCase() + c.substr(1)
    })
    .join('')
    .replace(/(\})/g, '')
    .replace(/(\?|\&|\#|\{|-|_|\.|\s)+\w/g, (letter): string =>
      letter.toUpperCase().replace(/[^0-9a-z]/gi, ''),
    )
}

/**
 * 大写
 */
export const camelCase = (name: string): string => {
  return name.replace(/(\{|\}|\[|\]|-|_|\.|\s)+\w/g, (letter): string =>
    letter.toUpperCase().replace(/[^0-9a-z]/gi, ''),
  )
}

/**
 * capitalize
 */
export const capitalize = (str: string): string => {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

/**
 * sanitize
 */
export const sanitize = (name: string): string => {
  return name.includes('-') ? `'${name}'` : name
}

/**
 * clear space
 */
export const spacesToUnderscores = (name: string): string => {
  return name.replace(/\s/g, '_').replace(/\[\]/gi, '')
}

/**
 * get ref
 * @param lookup %refs
 * @param definitions Definitions
 */
export const getRef = (lookup: string, definitions: Definitions): [string, Definition] => {
  const ID: string = lookup.replace('#/definitions/', '')
  const ref = definitions[ID]
  return [ID, ref]
}

/**
 * 处理 path & query
 */
export const parsePath = (
  path: string,
  method: string,
  params: Parameter[],
  definitions: Definitions,
): string => {
  params.forEach((p: Parameter): void => {
    if (p.in === 'body' && method === 'get') {
      // body -> query
      if (p.schema && p.schema.type) {
        path += `${/\?/g.test(path) ? '&' : '?'}${p.name}=\${${p.name}}`
      } else if (p.schema.$ref) {
        const [_, ref] = getRef(p.schema.$ref, definitions)
        Object.keys(ref.properties).map((field: string) => {
          path += `${/\?/g.test(path) ? '&' : '?'}${field}=\${${p.name}.${field}}`
        })
      }
    }

    if (p.in === 'query') {
      if (p.type && p.type === 'string') {
        path += `${/\?/g.test(path) ? '&' : '?'}${p.name}=\${${p.name}}`
      } else {
        debug(
          'ERR',
          `Qapi can't support query !== string; is[ ${p.type} ]if you wanna more types, feedback!`,
        )
      }
    }

    if (p.in === 'path') {
      const reg = new RegExp(`\{${p.name}\}`, 'g')
      path = path.replace(reg, `\${${p.name}}`)
    }
  })
  return path
}
