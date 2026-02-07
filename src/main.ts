import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { join } from 'path';

// Función recursiva para extraer todos los mensajes de error
function extractMessages(errors: any[]): string[] {
    return errors.flatMap(error => {
        // Si tiene children (errores anidados), procesarlos recursivamente
        if (error.children && error.children.length > 0) {
            return extractMessages(error.children);
        }
        // Si tiene constraints, extraer los mensajes
        if (error.constraints) {
            return Object.values(error.constraints);
        }
        return [];
    });
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) => {
            const messages = extractMessages(errors);
            return new BadRequestException(messages);
        }
    }))
    app.useStaticAssets(join(__dirname, '../public'))
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
