import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || 3000
  app.enableCors()
  app.enableShutdownHooks()
  await app.listen(port, () => {
    console.log(`
🚀 Server ready at: http://localhost:${port}/graphql
`)
  })
}
bootstrap()
