import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlatformEnum } from '../enums/platform.enum';
import { AppVersion, AppVersionDocument } from '../schemas/app-version.schema';

@Injectable()
export class AppVersionService {
  constructor(
    @InjectModel(AppVersion.name)
    private versionModel: Model<AppVersionDocument>,
  ) {}

  async create(platform: 'ios' | 'android', version: string) {
    // Verifica si ya existe
    const existing = await this.versionModel.findOne({ platform, version });
    if (existing) {
      throw new BadRequestException(
        `Version ${version} for ${platform} already exists`,
      );
    }

    const newVersion = new this.versionModel({ platform, version });
    return newVersion.save();
  }

  async update(versionId: string, isActive: boolean) {
    const version = await this.versionModel.findById(versionId);
    if (!version) throw new NotFoundException('Version not found');
    version.isActive = isActive;
    return version.save();
  }

  async checkVersion(platform: PlatformEnum, version: string) {
    const appVersion = await this.versionModel.findOne({ platform, version });
    let isValid = false;
    let isActive = false;

    if (appVersion) {
      isActive = appVersion?.isActive;
      isValid = true;
    }

    return {
      isValid: isValid,
      isActive: isActive,
      playStoreUrl:
        'https://play.google.com/store/apps/details?id=com.joseperezgil.neura',
      appStoreUrl: '',
    };
  }

  async listVersions(platform?: PlatformEnum) {
    const query = platform ? { platform } : {};
    return this.versionModel.find(query).sort({ createdAt: -1 });
  }
}
