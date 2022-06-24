import * as cp from 'child_process'
import * as fs from 'fs'
import * as prettier from 'prettier'
import * as process from 'process'
import Debug from 'debug'

import { Swagger, Options } from './types/interface'
import { parseDefinitions, parseMethods } from './parse'

const debug = Debug('MAIN')

/**
 * main function
 */
export const main = async (swaggerStr: string) => {
  const cwd = process.cwd()
  const swaggerObj: Swagger = JSON.parse(swaggerStr)

  // base dir
  const temDir = `${process.cwd()}/src/template`
  const dir: string = `${process.cwd()}/dist/${swaggerObj.info.title}/${swaggerObj.info.version}`

  // create folders
  fs.mkdirSync(dir, { recursive: true })
  // 缓存 swagger.json 方便后期定位问题
  fs.writeFileSync(`${dir}/swagger.schema.json`, JSON.stringify(swaggerObj, null, 2), {
    encoding: 'utf8',
  })
  // 生成说明文档
  fs.copyFileSync(`${temDir}/README.md`, `${dir}/README.md`)

  // parse definitions
  let definitions = parseDefinitions(swaggerObj, { wrapper: 'string' })
  definitions = prettier.format(definitions, { parser: 'typescript', singleQuote: true })

  // parse methods
  let methods = parseMethods(swaggerObj)
  methods = prettier.format(methods, { parser: 'typescript', singleQuote: true })

  // cope & write files
  fs.copyFileSync(`${temDir}/qapi.ts`, `${dir}/qapi.ts`)
  fs.writeFileSync(`${dir}/type.d.ts`, definitions, { encoding: 'utf8' })
  fs.writeFileSync(`${dir}/${swaggerObj.info.title}.ts`, methods, { encoding: 'utf8' })

  // create & write package.json
  const packStr = fs.readFileSync(`${temDir}/package.yaml`, { encoding: 'utf8' })

  // yaml to json
  // pack 逻辑
  let doc = jsyaml.safeLoad(packStr)
  doc = JSON.stringify(doc, null, 2)
  doc = doc.replace(/\{\{name\}\}/m, swaggerObj.info.title || '')
  doc = doc.replace(/\{\{version\}\}/m, swaggerObj.info.version || '')
  doc = doc.replace(/\{\{description\}\}/m, (swaggerObj.tags || []).map(t => t.name).join(','))
  fs.writeFileSync(`${dir}/package.json`, doc, { encoding: 'utf8' })
  // 修改路径
  process.chdir(dir)

  // npm publish
  try {
    cp.execSync('npm publish')
  } catch (e) {
    debug('ERR', e)
  }

  // 修改路径
  process.chdir(cwd)
}

/**
 * parse 接口定义
 * @param spec Swagger 对象（JSON Object）
 * @param options Options 转译参数
 */
export const parse = (spec: Swagger, options?: Options): string => {
  if (spec.swagger !== 2) {
    throw new Error(`Swagger version ${spec.swagger} is not supported`)
  }
  return parseDefinitions(spec, options)
}

interface Opts {
  registry: string
  scope: `@${string}`
}

/**
 * npm 包封装（e.g. pika）
 */
export const pack = (opt: Opts): void => {
  try {
    cp.execSync(`npm publish --registry=${opt.registry} --scope=@${opt.scope}`)
  } catch (e) {
    debug('ERR', e)
  }
}
