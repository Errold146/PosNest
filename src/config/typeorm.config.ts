import { join } from "path";
import { ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    ssl: true,
    entities: [join(__dirname + '../../**/*.entity.{js,ts}')],
    synchronize: true
})