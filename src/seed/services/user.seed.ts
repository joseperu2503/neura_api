import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class UserSeed {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  users: UserSeedData[] = [
    {
      email: process.env.ADMIN_EMAIL || '',
      password: process.env.ADMIN_PASSWORD || '',
    },
  ];

  async run() {
    for (const user of this.users) {
      await this.create(user);
    }
  }

  private async create(params: UserSeedData) {
    const { email, password } = params;
    if (email === '' || password === '') return;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) return;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });

    await newUser.save();
  }
}

interface UserSeedData {
  email: string;
  password: string;
}
