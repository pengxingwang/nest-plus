import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { EnvEnum } from 'src/enums';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),
    LoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: {
            level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
            transport:
              process.env.NODE_ENV === 'dev'
                ? { target: 'pino-pretty' }
                : undefined,
            useLevelLabels: true,
            stream: pino.destination({
              dest: './logs', // omit for stdout
              minLength: 4096, // Buffer before writing
              sync: false, // Asynchronous logging
            }),
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [],
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV === EnvEnum.DEV,
        keepConnectionAlive: true,
        dateStrings: true,
        timezone: '+08:00', //服务器上配置的时区
        logging: true,
        supportBigNumbers: true,
        bigNumberStrings: true,
      }),
    }),
  ],
})
export class LibsModule {}
