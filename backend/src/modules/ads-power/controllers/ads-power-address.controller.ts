import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AdsPowerAddressService } from '@src/modules/ads-power/services/ads-power-address.service.js';
import { CreateAdsPowerAddressDto } from '@src/modules/ads-power/dto/create-ads-power-address.dto.js';
import { UpdateAdsPowerAddressDto } from '@src/modules/ads-power/dto/update-ads-power-address.dto.js';
import { BaseEntity } from '@src/common/entities/base.entity.js';
import { BaseController } from '@src/common/controllers/base.controller.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Controller('ads-power-address')
@UseInterceptors(ClassSerializerInterceptor)
export class AdsPowerAddressController extends BaseController {
  constructor(private readonly adsPowerAddressService: AdsPowerAddressService) {
    super();
  }

  @Post()
  async create(
    @AuthUser() authUser: IAuthUser,
    @Body() dto: CreateAdsPowerAddressDto,
  ) {
    const address = await this.adsPowerAddressService.create(authUser._id, dto);

    return this.createResponse(BaseEntity.fromObject(address));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdsPowerAddressDto) {
    const address = await this.adsPowerAddressService.update(id, dto);

    return this.createResponse(BaseEntity.fromObject(address));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.adsPowerAddressService.delete(id);

    return this.createEmptyResponse();
  }

  @Get()
  async getList(@Request() req: any) {
    const addresses = await this.adsPowerAddressService.getListByUserId(
      req.authUser._id,
    );

    return this.createResponse(BaseEntity.fromArray(addresses));
  }
}
