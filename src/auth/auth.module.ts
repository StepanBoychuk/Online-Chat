import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { HashService } from 'src/hash/hash.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, HashService],
  controllers: [AuthController],
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
