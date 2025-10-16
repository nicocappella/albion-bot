import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const username = configService.getOrThrow<string>('MONGO_USERNAME');
        const password = configService.getOrThrow<string>('MONGO_PASSWORD');
        const port = configService.getOrThrow<string>('MONGO_PORT');
        const database = configService.getOrThrow<string>('MONGO_DATABASE');
        const env = configService.get<string>('NODE_ENV', 'development');
        const connection = configService.getOrThrow<string>('MONGO_URI');

        const uri =
          env === 'development'
            ? `${connection}://${username}:${port}`
            : `${connection}://${username}:${password}@${database}.48zjsbj.mongodb.net/?retryWrites=true&w=majority`;

        return {
          uri,
          dbName: database,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
