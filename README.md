# NestJS Sample

A NestJS RESTful APIs sample project, including:

- [x] Restful APIs satisfies [Richardson Maturity Model(l2)](https://martinfowler.com/articles/richardsonMaturityModel.html#level2)
- [x] Customized Mongoose integration module
- [x] Passport/JWT authentication with simple text secrets
- [x] Fully testing codes with Jest, jest-mock-extended, ts-mockito, @golevelup/ts-jest etc.
- [x] Github actions workflow for continuous testing, code coverage report, docker image building

## Docs
- [Documentation](./docs/index.md)

## Build

Install the dependencies.

```bash
$ npm install
```

Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Reference
- [The official Nestjs documentation](https://docs.nestjs.com)
- [Wagago IO Courses](https://wanago.io)

  *
