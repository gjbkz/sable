# Changelog

## v0.5.19 (2026-02-27)

### New Features

- add CLI flags for file operations: `-F`/`--fileOperations` to enable all file operations at once, and individual `--allowFileUpload`, `--allowDelete`, `--allowTextUpload` flags for fine-grained control ([c1b905f](https://github.com/gjbkz/sable/commit/c1b905f93a157df2dc672bb0009644ec70b27070))

### Dependency Upgrades

- @biomejs/biome:2.2.4→2.4.4 @types/node:24.4.0→25.3.2 commander:14.0.2→14.0.3 esbuild:0.25.12→0.27.3 middleware-static-livereload:1.5.2→1.5.3 typescript:5.9.2→5.9.3 ([56239aa](https://github.com/gjbkz/sable/commit/56239aa))


## v0.5.18 (2026-02-22)

### Documentation

- update readme ([94c1c80](https://github.com/gjbkz/sable/commit/94c1c808703d91b3ac644000b899a1429e9a5a67))
- align CLI option wording with middleware-static-livereload ([9f38d30](https://github.com/gjbkz/sable/commit/9f38d302521e87cda29ae138468f20ec413e6477))

### Dependency Upgrades

- upgrade middleware-static-livereload ([41b2800](https://github.com/gjbkz/sable/commit/41b28007c0dece430719c7ea8c5ae3d7c25816a4))


## v0.5.17 (2025-09-16)

### Code Refactoring

- reorganize middleware type definitions for clarity ([f25d90c](https://github.com/gjbkz/sable/commit/f25d90c92eb3ded6970a47460aa40ee9752ffc40))


## v0.5.16 (2025-09-16)

### Bug Fixes

- update artifact names and paths in CI workflow ([cfdea7f](https://github.com/gjbkz/sable/commit/cfdea7f8ff3b5574f0e2f2dfac578a4998f318fc))
- biome errors ([9654356](https://github.com/gjbkz/sable/commit/96543563912d7fe5a425c2d8404de7f5a2e7beb7))

### Dependency Upgrades

- update changelog command to use npx and remove unused devDependencies ([268f2ef](https://github.com/gjbkz/sable/commit/268f2ef8d55d05e1588581a9ade3eb5688f3497f))
- upgrade dependencies ([e3fcf70](https://github.com/gjbkz/sable/commit/e3fcf700e9a23d4dd3c2a0f866fcb0bd71a122a7))
- @biomejs/biome:1.8.3→2.2.4 @nlib/changelog:0.3.1→0.3.2 @types/node:22.5.4→24.4.0 commander:12.1.0→14.0.1 middleware-static-livereload:1.3.0→1.4.0 typescript:5.5.4→5.9.2 ([02690b1](https://github.com/gjbkz/sable/commit/02690b146d9da9e33d3290b5eae381258ecf19d2))


## v0.5.15 (2024-09-08)

### Tests

- fix eslint errors ([0dc28df](https://github.com/gjbkz/sable/commit/0dc28dfb75af8fa9b25bb40caca01bb069944112))

### Code Refactoring

- type:module ([a3539a4](https://github.com/gjbkz/sable/commit/a3539a4c077ad540d185c1b2f664a53fc0f59557))

### Continuous Integration

- skip test on push ([c67e288](https://github.com/gjbkz/sable/commit/c67e288672cf86d946502ea7036829c1cc58aa0c))
- use v18 ([b20cc9b](https://github.com/gjbkz/sable/commit/b20cc9b7bd71604105183ec5f5642d45001a4b92))

### Dependency Upgrades

- upgrade dependencies (#691) ([960ea89](https://github.com/gjbkz/sable/commit/960ea89521727f6ae7bc06312058365114808cee))
- npm update ([b6d976c](https://github.com/gjbkz/sable/commit/b6d976c0f20ff8c0c939cb72d6475190245203a8))
- install @nlib/changelog ([816ae0f](https://github.com/gjbkz/sable/commit/816ae0fbbdb9c3f7f2f1b15b77d23f09a12747ea))
- uninstall @nlib/nodetool ([2f2ee62](https://github.com/gjbkz/sable/commit/2f2ee6291532aa699f45227230fe574de777c252))
- @nlib/eslint-config:3.17.30→3.19.4 @typescript-eslint/eslint-plugin:5.7.0→5.33.1 @typescript-eslint/parser:5.7.0→5.33.1 eslint:8.5.0→8.22.0 ([9b7082a](https://github.com/gjbkz/sable/commit/9b7082af3e691002b87c6c1d977eea2afceaafbf))
- node-fetch:2.6.6→3.2.10 @types/node-fetch:2.5.12→2.6.2 ([50bb491](https://github.com/gjbkz/sable/commit/50bb4916d907ed04aaf35c22523496646ee7a80d))
- @types/node:17.0.0→18.7.8 ([d556feb](https://github.com/gjbkz/sable/commit/d556feb9653a487f0f2eb8c5d05643c54a82857d))
- ava:3.15.0→4.3.1 ([99bf069](https://github.com/gjbkz/sable/commit/99bf069589d293faba5cb64e98a62f9073ad01b1))
- commander:8.3.0→9.4.0 ([5d7f422](https://github.com/gjbkz/sable/commit/5d7f422fb6111471604fc58438538854cecfc467))
- lint-staged:12.1.3→13.0.3 ([3621d4b](https://github.com/gjbkz/sable/commit/3621d4bd41faa279fe3462ab05a5e2b5d4436085))
- add @nlib/lint-commit ([760d1c2](https://github.com/gjbkz/sable/commit/760d1c2b44159c24cfb6ca68d4b4e12a717f2952))


## v0.5.14 (2021-12-18)

### Bug Fixes

- update links ([f613493](https://github.com/gjbkz/sable/commit/f61349311dd7c4e11517691632e43b46270dc19e))

### Dependency Upgrades

- add @types/node-fetch ([ad5b26e](https://github.com/gjbkz/sable/commit/ad5b26e4ce9bb3eec30145d42b36c4c350b9c65e))
- @nlib/eslint-config:3.17.29→3.17.30 @types/node:16.11.12→17.0.0 eslint:8.4.1→8.5.0 lint-staged:11.2.6→12.1.3 ([e511394](https://github.com/gjbkz/sable/commit/e5113942cd8c5d64ad109e8f7b4382e492db2010))


## v0.5.13 (2021-11-05)

### Bug Fixes

- commander api calls ([4dbe2ff](https://github.com/gjbkz/sable/commit/4dbe2ffdf8a3fd099c145678f8a45aaa711b2232))

### Dependency Upgrades

- downgrade node-fetch and embed eslint and ava configurations ([76a0709](https://github.com/gjbkz/sable/commit/76a07099a2a051f7d79a3bf87e597c710f838e52))
- @nlib/nodetool:0.4.2→1.0.0 @types/node-fetch:2.5.12→3.0.3 @typescript-eslint/eslint-plugin:4.33.0→5.3.0 @typescript-eslint/parser:4.33.0→5.3.0 commander:8.1.0→8.3.0 eslint:7.32.0→8.1.0 middleware-static-livereload:1.2.20→1.2.21 node-fetch:2.6.6→3.0.0 typescript:4.4.2→4.4.4 ([785e60f](https://github.com/gjbkz/sable/commit/785e60f86377e73ccc8c4074c87142425ec1b479))
- remove some packages ([d890849](https://github.com/gjbkz/sable/commit/d8908497915f9c8264b68863786bea341995311c))


## v0.5.12 (2021-09-04)

### Bug Fixes

- type errors ([543c589](https://github.com/gjbkz/sable/commit/543c58944096c07465d7bad69c335cc5e88ed104))

### Documentation

- update a badge ([406263b](https://github.com/gjbkz/sable/commit/406263b0cacdd1816d4a791fe6352c616a1f44d2))
- rename README ([5972925](https://github.com/gjbkz/sable/commit/597292585a280a37387bbb63af01131f4018cc91))

### Continuous Integration

- fix command ([301ff20](https://github.com/gjbkz/sable/commit/301ff20626799161e8ab8bec3d9f995ff26447b7))
- update workflows ([fe7adbf](https://github.com/gjbkz/sable/commit/fe7adbf390535fc156db3030ddafeb685a980438))

### Dependency Upgrades

- downgrade node-fetch ([2f9e4f4](https://github.com/gjbkz/sable/commit/2f9e4f4199422ee15107e8916f29196e71828c7f))
- @nlib/changelog:0.1.9→0.1.10 @types/node:15.14.9→16.7.10 @types/node-fetch:2.5.12→3.0.3 commander:7.2.0→8.1.0 lint-staged:10.5.4→11.1.2 middleware-static-livereload:1.2.19→1.2.20 node-fetch:2.6.1→3.0.0 ts-node:9.1.1→10.2.1 typescript:4.3.5→4.4.2 ([4cd99b0](https://github.com/gjbkz/sable/commit/4cd99b022e482abff5ec0e0e1e5d444afac6acac))


## v0.5.11 (2021-05-03)

### Tests

- run npm install with --no-save ([ec805d3](https://github.com/gjbkz/sable/commit/ec805d37999f73b2acfd74ecadc5831419416353))
- move ava config ([0d39986](https://github.com/gjbkz/sable/commit/0d39986ea33065b8a5445c4ea3eddd38669d7170))

### Styles

- fix eslint errors ([c5eca94](https://github.com/gjbkz/sable/commit/c5eca948d8e521619dd50435ff0516f891ad7224))

### Documentation

- update badges ([1252439](https://github.com/gjbkz/sable/commit/1252439b79216630c489ccb7dfbedd13d18d494d))

### Continuous Integration

- run the Publish job in the deployment environment ([1dc6b5f](https://github.com/gjbkz/sable/commit/1dc6b5ff6d5e723fccbffee4861bc9dfe3f3bb33))

### Dependency Upgrades

- @types/node:14.14.37→15.0.1 commander:6.2.1→7.2.0 middleware-static-livereload:1.2.18→1.2.19 typescript:4.2.3→4.2.4 ([8b1d930](https://github.com/gjbkz/sable/commit/8b1d9300269bb25efb2f051f6f9c2aa30d14b17a))


## v0.5.10 (2020-12-20)

### Dependency Upgrades

- upgrade dependencies (#229) ([be5fbaf](https://github.com/gjbkz/sable/commit/be5fbaf93171dc4edbe353f608f66297f7a4b9f5))


## v0.5.9 (2020-06-26)


## v0.5.8 (2020-06-22)


## v0.5.7 (2019-12-09)


## v0.5.6 (2019-12-09)


## v0.5.5 (2019-12-08)


## v0.5.4 (2019-11-15)


## v0.5.3 (2019-08-23)

### Code Refactoring

- fix an eslint error ([b5dd2ec](https://github.com/gjbkz/sable/commit/b5dd2ec19ea13e58464377454398aa829e50a463))


## v0.5.2 (2019-06-27)

### Features

- add middlewares ([30874fb](https://github.com/gjbkz/sable/commit/30874fbb0479e536775bc79acaf74fcc8b476196))


## v0.5.1 (2019-06-27)

### Features

- support all options ([8a6abf7](https://github.com/gjbkz/sable/commit/8a6abf7c7ea7dc6f1be458a0914ebe600a83c5b1))

### Documentation

- update README ([bab63ee](https://github.com/gjbkz/sable/commit/bab63ee7b3f9d5c31b00f22eab67e53010d19cd3))


## v0.5.0 (2019-06-11)

### Features

- use connect (#42) ([95c2e9a](https://github.com/gjbkz/sable/commit/95c2e9a3b81cc487dce3d8cc7d612d1958742819))

### Documentation

- update README ([7eda663](https://github.com/gjbkz/sable/commit/7eda6631cc95bcd8f14af826611d409c3459ec26))
- change some badges ([e21ef1e](https://github.com/gjbkz/sable/commit/e21ef1ebc996cd400c3aef997a49195536d53381))


## v0.4.6 (2018-11-28)


## v0.4.5 (2018-10-19)


## v0.4.4 (2018-10-18)


## v0.4.3 (2018-08-22)


## v0.4.2 (2018-08-22)


## v0.4.1 (2018-08-16)


## v0.4.0 (2018-08-09)


## v0.3.1 (2018-07-18)


## v0.3.0 (2018-07-18)


## v0.2.15 (2018-04-03)


## v0.2.14 (2018-03-15)


## v0.2.13 (2018-01-22)


## v0.2.12 (2018-01-22)


## v0.2.11 (2018-01-09)


## v0.2.10 (2017-12-27)


## v0.2.9 (2017-12-22)


## v0.2.8 (2017-12-22)


## v0.2.7 (2017-12-22)


## v0.2.6 (2017-12-22)


## v0.2.5 (2017-12-22)


## v0.2.4 (2017-12-21)


## v0.2.3 (2017-12-12)


## v0.2.2 (2017-12-07)


## v0.2.1 (2017-12-07)


## v0.2.0 (2017-12-06)


## v0.1.7 (2017-07-28)


## v0.1.6 (2017-06-30)


## v0.1.5 (2017-06-30)


## v0.1.4 (2017-06-30)


## v0.1.3 (2017-06-15)


## v0.1.2 (2017-05-24)


## v0.1.1 (2017-05-24)


## v0.1.0 (2017-05-06)


## v0.0.21 (2017-04-12)


## v0.0.20 (2017-03-30)


## v0.0.19 (2017-03-27)


## v0.0.18 (2017-03-27)


## v0.0.17 (2017-03-23)


## v0.0.16 (2017-03-23)


## v0.0.15 (2017-03-23)


## v0.0.14 (2017-03-23)


## v0.0.13 (2017-03-23)


## v0.0.12 (2017-03-22)


## v0.0.11 (2017-03-16)


## v0.0.10 (2017-03-15)


## v0.0.9 (2017-03-15)


