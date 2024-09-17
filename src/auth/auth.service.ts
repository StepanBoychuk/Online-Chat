import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const existingUsername = await this.userModel.findOne({
      where: { username: createUserDto.username },
    });
    const existingEmail = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUsername) {
      throw new HttpException('User with this username is already exist', 400);
    }
    if (existingEmail) {
      throw new HttpException('User with this email is already exist', 400);
    }
    return await this.userModel.create(createUserDto);
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.userModel.findOne({
      where: { username: signInDto.username },
    });
    if (
      !user ||
      user.password !==
        (await this.hashService.hashPassword(signInDto.password))
    ) {
      throw new HttpException('Wrong username or password', 401);
    }
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return this.jwtService.sign(userData);
  }
}
