import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });

    await newUser.save();

    const accessToken = this.getJwt({ id: newUser.id });
    return { accessToken };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email }).select('+password');

    //si el usuario con el email no existe
    if (!user) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    const accessToken = this.getJwt({ id: user.id });
    return { accessToken };
  }

  async getProfile(user: User) {
    return user;
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async createGuestUser() {
    const guestId = uuidv4();

    const user = new this.userModel({
      guestId,
      isGuest: true,
    });

    await user.save();

    const accessToken = this.getJwt({ id: user.id });
    return { accessToken };
  }
}
