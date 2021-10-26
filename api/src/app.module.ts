import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration, { DatabaseConfig } from './common/config/configuration';
import { validation } from './common/config/validation';
import { GroupModule } from './group/group.module';
import { MemberModule } from './member/member.module';
import { AreaModule } from './area/area.module';
import { LocationModule } from './location/location.module';
import { Group } from './group/entities/group.entity';
import { Area } from './area/entities/area.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
      load: [configuration],
      validationSchema: validation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = configService.get<DatabaseConfig>('database');

        return {
          type: 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.database,
          entities: [Group, Area],
          autoLoadModels: true,
          synchronize: process.env.TYPEORM_SYNCRONIZE === 'true',
          keepConnectionAlive: true,
        };
      },
    }),
    GroupModule,
    MemberModule,
    AreaModule,
    LocationModule,
  ],
})
export class AppModule {}
