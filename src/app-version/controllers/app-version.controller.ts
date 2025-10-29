import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { CreateVersionRequestDto } from '../dto/create-version-request.dto';
import { GetVersionsRequestDto } from '../dto/get-versions-request.dto';
import { UpdateVersionRequestDto } from '../dto/update-version-request.dto';
import { AppVersionService } from '../services/app-version.service';

@Controller('app-versions')
export class AppVersionController {
  constructor(private readonly versionService: AppVersionService) {}
  @Auth()
  @Roles(Role.ADMIN)
  @Post('create')
  create(
    @Body()
    body: CreateVersionRequestDto,
  ) {
    return this.versionService.create(body.platform, body.version);
  }

  @Auth()
  @Roles(Role.ADMIN)
  @Patch('update')
  update(@Body() body: UpdateVersionRequestDto) {
    return this.versionService.update(body.id, body.isActive);
  }

  @Get('check')
  check(@Body() body: CreateVersionRequestDto) {
    return this.versionService.checkVersion(body.platform, body.version);
  }

  @Auth()
  @Roles(Role.ADMIN)
  @Post('list')
  list(@Body() body: GetVersionsRequestDto) {
    return this.versionService.listVersions(body.platform);
  }
}
