import { Exclude, Expose, Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

export class BaseEntity {
  @Exclude()
  __v?: string;

  @Exclude()
  _id?: Types.ObjectId;

  @Transform(({ obj }) => obj._id?.toString())
  @Expose()
  id: string;

  constructor(data: Record<string, any>) {
    if (data instanceof Document) {
      data = data.toObject();
    }

    for (const key in data) {
      if (data[key] instanceof Types.ObjectId) {
        data[key] = data[key].toString();
      }
    }

    Object.assign(this, data);
  }

  static fromObject<T extends BaseEntity>(
    this: new (data: Record<string, any>) => T,
    data: Document | Record<string, any>,
  ): T {
    return new this(data);
  }

  static fromArray<T extends BaseEntity>(
    this: new (data: Record<string, any>) => T,
    data: Array<Document | Record<string, any>>,
  ): T[] {
    return data.map((item) => new this(item));
  }
}
