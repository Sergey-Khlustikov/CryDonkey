import { Injectable, NotFoundException } from '@nestjs/common';
import { AdsPowerAddressRepository } from '@src/modules/ads-power/repositories/ads-power-address.repository.js';
import { CreateAdsPowerAddressDto } from '@src/modules/ads-power/dto/create-ads-power-address.dto.js';
import { AdsPowerAddressDocument } from '@src/modules/ads-power/schemas/ads-power-address.schema.js';
import { Types } from 'mongoose';
import { UpdateAdsPowerAddressDto } from '@src/modules/ads-power/dto/update-ads-power-address.dto.js';

@Injectable()
export class AdsPowerAddressService {
  constructor(
    private readonly adsPowerAddressRepository: AdsPowerAddressRepository,
  ) {}

  async create(
    userId: string,
    dto: CreateAdsPowerAddressDto,
  ): Promise<AdsPowerAddressDocument> {
    const data: Partial<AdsPowerAddressDocument> = {
      name: dto.name,
      host: dto.host,
      port: dto.port,
    };

    return this.adsPowerAddressRepository.create(
      new Types.ObjectId(userId),
      data,
    );
  }

  async update(
    id: string,
    dto: UpdateAdsPowerAddressDto,
  ): Promise<AdsPowerAddressDocument> {
    const data: Partial<AdsPowerAddressDocument> = {
      name: dto.name,
      host: dto.host,
      port: dto.port,
    };

    const updated = await this.adsPowerAddressRepository.updateById(
      new Types.ObjectId(id),
      data,
    );

    if (!updated) {
      throw new NotFoundException(`AdsPowerAddress with id ${id} not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const doc = await this.adsPowerAddressRepository.deleteById(
      new Types.ObjectId(id),
    );

    if (!doc) {
      throw new NotFoundException(`AdsPowerAddress with id ${id} not found`);
    }
  }

  async getListByUserId(userId: string): Promise<AdsPowerAddressDocument[]> {
    return this.adsPowerAddressRepository.getListByUserId(
      new Types.ObjectId(userId),
    );
  }
}
