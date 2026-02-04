import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

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
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) => {
            const messages = extractMessages(errors);
            return new BadRequestException(messages);
        }
    }))
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
