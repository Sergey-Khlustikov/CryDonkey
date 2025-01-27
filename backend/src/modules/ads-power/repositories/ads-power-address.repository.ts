import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AdsPowerAddress,
  AdsPowerAddressDocument,
} from '@src/modules/ads-power/schemas/ads-power-address.schema.js';
import { Model, Types } from 'mongoose';

@Injectable()
export class AdsPowerAddressRepository {
  constructor(
    @InjectModel(AdsPowerAddress.name)
    private readonly adsPowerAddressModel: Model<AdsPowerAddressDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    data: Partial<AdsPowerAddressDocument>,
  ): Promise<AdsPowerAddressDocument> {
    return this.adsPowerAddressModel.create({
      userId,
      ...data,
    });
  }

  async findById(id: Types.ObjectId): Promise<AdsPowerAddressDocument | null> {
    return this.adsPowerAddressModel.findById(id).exec();
  }

  async updateById(
    id: Types.ObjectId,
    data: Partial<AdsPowerAddressDocument>,
  ): Promise<AdsPowerAddressDocument | null> {
    const doc = await this.adsPowerAddressModel.findById(id).exec();

    if (!doc) {
      return null;
    }

    if (data.name) {
      doc.name = data.name;
    }

    if (data.host) {
      doc.host = data.host;
    }

    if (data.port) {
      doc.port = data.port;
    }

    await doc.save();

    return doc;
  }

  async deleteById(
    id: Types.ObjectId,
  ): Promise<AdsPowerAddressDocument | null> {
    return this.adsPowerAddressModel.findByIdAndDelete(id).exec();
  }

  async getListByUserId(
    userId: Types.ObjectId,
  ): Promise<AdsPowerAddressDocument[]> {
    return this.adsPowerAddressModel.find({ userId }).exec();
  }
}
