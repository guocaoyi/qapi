import {
  capitalize,
  camelCase,
  getRef,
  parsePath,
  removeAndCamelCase,
  sanitize,
  spacesToUnderscores,
} from './utils'
import { Definition, Definitions, Method, Options, Parameter, Response, Swagger } from './interface'

// Primitives only!
const TYPES: { [index: string]: string } = {
  string: 'string',
  integer: 'number',
  number: 'number',
}

/**
 * parse
 * @param spec Swagger JSON Object 对象
 * @param woptions Options
 */
export const parseDefinitions = (spec: Swagger, options: Options = {}): string => {
  const shouldCamelCase: boolean = options.camelcase || false
  const queue: [string, Definition][] = []
  const output: string[] = []

  const { definitions } = spec
  output.push('declare global {')

  // Returns primitive type, or 'object' or 'any'
  function getType(definition: Definition, nestedName: string): string {
    const { $ref, items, type, ...value } = definition

    const nextInterface = camelCase(nestedName) // if this becomes an interface, it’ll need to be camelCased

    const DEFAULT_TYPE = 'any'

    if ($ref) {
      const [refName, refProperties] = getRef($ref, definitions)
      const convertedRefName = spacesToUnderscores(refName)
      // If a shallow array interface, return that instead
      if (refProperties && refProperties.items && refProperties.items.$ref) {
        return getType(refProperties, refName)
      }
      if (refProperties && refProperties.type && TYPES[refProperties.type]) {
        return TYPES[refProperties.type]
      }
      return convertedRefName || DEFAULT_TYPE
    }

    if (items && items.$ref) {
      const [refName] = getRef(items.$ref, definitions)
      return `${getType(items, refName)}[]`
    }

    if (items && items.type) {
      // if an array, keep nesting
      if (items.type === 'array') {
        return `${getType(items, nestedName)}[]`
      }
      // else if primitive, return type
      if (TYPES[items.type]) {
        return `${TYPES[items.type]}[]`
      }
      // otherwise if this is an array of nested types, return that interface for later
      queue.push([nextInterface, items])
      return `${nextInterface}[]`
    }

    if (Array.isArray(value.oneOf)) {
      return value.oneOf.map((def): string => getType(def, '')).join(' | ')
    }

    if (value.properties) {
      // If this is a nested object, let’s add it to the stack for later
      queue.push([nextInterface, { $ref, items, type, ...value }])
      return nextInterface
    }

    if (type) {
      return TYPES[type] || type || DEFAULT_TYPE
    }

    return DEFAULT_TYPE
  }

  function buildNextInterface(): void {
    const nextObject = queue.pop()
    if (!nextObject) {
      // Geez TypeScript it’s going to be OK
      return
    }
    const [ID, { allOf, properties, required, additionalProperties, type }] = nextObject

    let allProperties = properties || {}
    const includes: string[] = []

    // Include allOf, if specified
    if (Array.isArray(allOf)) {
      allOf.forEach((item): void => {
        // Add “implements“ if this references other items
        if (item.$ref) {
          const [refName] = getRef(item.$ref, definitions)
          includes.push(refName)
        } else if (item.properties) {
          allProperties = { ...allProperties, ...item.properties }
        }
      })
    }

    // If nothing’s here, let’s skip this one.
    if (
      !Object.keys(allProperties).length &&
      additionalProperties !== true &&
      type &&
      TYPES[type]
    ) {
      return
    }
    // Open interface
    const isExtending = includes.length ? ` extends ${includes.join(', ')}` : ''

    output.push(
      `interface ${shouldCamelCase ? camelCase(ID) : spacesToUnderscores(ID)}${isExtending} {`,
    )
    // Populate interface
    Object.entries(allProperties).forEach(([key, value]: [string, Definition]): void => {
      const optional = !Array.isArray(required) || required.indexOf(key) === -1
      const formattedKey = shouldCamelCase ? camelCase(key) : key
      const name = `${sanitize(formattedKey)}${optional ? '?' : ''}`
      const newID = `${ID}${capitalize(formattedKey)}`
      const interfaceType = getType(value, newID)

      if (typeof value.description === 'string') {
        // Print out descriptions as jsdoc comments, but only if there’s something there (.*)
        output.push(`/**\n* ${value.description.replace(/\n$/, '').replace(/\n/g, '\n* ')}\n*/`)
      }

      // Handle enums in the same definition
      if (Array.isArray(value.enum)) {
        output.push(`${name}: ${value.enum.map(option => JSON.stringify(option)).join(' | ')};`)
        return
      }

      output.push(`${name}: ${interfaceType};`)
    })

    if (additionalProperties) {
      if ((additionalProperties as boolean) === true) {
        output.push('[name: string]: any')
      }

      if ((additionalProperties as Definition).type) {
        const interfaceType = getType(additionalProperties as Definition, '')
        output.push(`[name: string]: ${interfaceType}`)
      }
    }

    // Close interface
    output.push('}')
  }

  // Begin parsing top-level entries
  Object.entries(definitions).forEach((entry: any): void => {
    // Ignore top-level array definitions
    if (entry[1].type === 'object') {
      queue.push(entry)
    }
  })

  queue.sort((a: any, b: any): any => a[0].localeCompare(b[0]))
  while (queue.length > 0) {
    buildNextInterface()
  }

  output.push('}') // Close namespace
  output.push('export {}')

  return output.join('\n')
}

/**
 * parse
 * @param spec Swagger JSON Object 对象
 */
export const parseMethods = (spec: Swagger): string => {
  const output: string[] = []
  const { info, definitions, paths } = spec

  output.push(`import { QApi } from './qapi';`)
  output.push(`type integer = number;`)
  output.push(`/**
  * request instance
  */
 export const net = new QApi('${info.title}');`)

  const methodOutput: string[] = []
  for (const url in paths) {
    // 方法名
    let methodName = url.replace(/^\//, '')
    methodName = removeAndCamelCase(methodName)

    // result
    methodOutput.push(`/**
    * ${methodName}
    */
   export const ${methodName} = {`)
    Object.keys(paths[url]).forEach((name: string): void => {
      const body: Method = paths[url][name]
      methodOutput.push(parseMethod(url, name, body, definitions))
    })
    methodOutput.push('}')
  }

  output.push(methodOutput.join('\n'))
  return output.join('\n')
}

/**
 * 构造方法
 * @param path path
 * @param method 方法名
 * @param body 方法描述
 */
const parseMethod = (
  path: string,
  method: string,
  body: Method,
  definitions: Definitions,
): string => {
  // arguments
  const methodArgs: string = (body.parameters || [])
    .map((p: Parameter): string => {
      if (p.type) {
        if (p.type === 'array') {
          const gen = p.items
            ? p.items.type
              ? p.items.type
              : getRef(p.items.refs, definitions)[0]
            : ''
          return `${p.name} ${p.required ? '?' : ''}:${gen}[]`
        }
        return `${p.name} ${p.required ? '?' : ''}:${p.type}`
      } else if (p.schema) {
        return `${p.name} ${p.required ? '?' : ''}:${
          p.schema.type ? p.schema.type : getRef(p.schema?.$ref, definitions)[0]
        }`
      } else {
        return `${p.name} ${p.required ? '?' : ''}:any`
      }
    })
    .join(', ')

  // responseBody type
  let methodResult = 'any'
  if (body.responses && body.responses['200']) {
    const res: Response = body.responses['200']
    if (res.schema && res.schema.type) {
      if (res.schema.type === 'array') {
        const gen = res.schema.items?.type ?? getRef(res.schema.items?.$ref, definitions)[0] ?? ''
        methodResult = `${gen}[]`
      } else if (res.schema.type) {
        methodResult = `${res.schema.type}`
      } else if (res.schema.$ref) {
        methodResult = res.schema.$ref.replace('#/definitions/', '')
      } else {
        methodResult = 'any'
      }
    } else if (res.schema) {
      methodResult = getRef(res.schema.$ref, definitions)[0]
    } else {
      methodResult = ''
    }
  }

  let url = path
  let argus: string = ''
  if (path && body.parameters) {
    url = parsePath(path, method, body.parameters, definitions)

    if (method !== 'get') {
      argus = body.parameters
        .filter((p: Parameter) => p.in === 'body')
        .map((p: Parameter) => p.name)
        .join(',')
    }
  }

  return `${method}: (${methodArgs}): Promise<${methodResult}> => net.${method}<${methodResult}>(
    \`${url}\`${argus ? ',' + argus : ''}
  ), `
}
