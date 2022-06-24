# QAPI

QAPI 通过解析 BFF 项目接口编译生成的的 Swagger.json ，直接生成业务 API（方法名、Http Method、URL、Params、Query、Body）；

## Features

```bash
.
├── README.md
├── packages
│   ├── create-qapi #
│   ├── qapi-core # core 核心代码
│   ├── qapi-playground # qapi 在线转换器
│   └── yapi-plugin-typegen # yapi 插件
├── CONTRIBUTING.md # for contribution
└── tsconfig.json
```

## QAPI Core

## QAPI CLI

```bash
Generate API from Swagger OpenAPI specs

  Usage
    $ qapi [input] [options]

  Options
    --help                help inofs

    --parse
    --publish
    --push

    --npmServer           npm register
    --npmScope            npm Scope e.g. @xxx/pack
    --npmUser             npm user
    --npmPassword         npm password

    --docPublish
    --docisGroupExist
```

- json | yaml -> api source
- api source -> npm package

## QAPI Server

```bash
npm start
npm stop
```
