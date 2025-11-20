import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GradesModule } from './grades/grades.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importamos TypeOrmModule
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [
    // Configuración de la conexión a la base de datos MySQL
    // Configuración de la conexión a la base de datos MySQL
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USER') || 'root',
        password: configService.get<string>('DB_PASSWORD') || 'root',
        database: configService.get<string>('DB_NAME') || 'grades_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Descubre entidades automáticamente
        synchronize: true, // En desarrollo, sincroniza el esquema de la BD con las entidades. Desactivar en producción.
      }),
      inject: [ConfigService],
    }),
    GradesModule,
    EvaluationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
