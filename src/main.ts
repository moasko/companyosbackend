import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Use ValidationPipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true, // TODO: Re-enable after defining full DTOs
      // forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle("ENEA Telecom API")
    .setDescription("The ENEA Telecom ERP & CMS API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT || 3000, "0.0.0.0");
  console.log(`Application is running on port: ${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
