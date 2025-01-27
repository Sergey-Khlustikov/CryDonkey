import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdsPowerAddress,
  AdsPowerAddressSchema,
} from '@src/modules/ads-power/schemas/ads-power-address.schema.js';
import { AdsPowerAddressController } from '@src/modules/ads-power/controllers/ads-power-address.controller.js';
import { AdsPowerAddressService } from '@src/modules/ads-power/services/ads-power-address.service.js';
import { AdsPowerAddressRepository } from '@src/modules/ads-power/repositories/ads-power-address.repository.js';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import { AdsPowerApiController } from '@src/modules/ads-power/controllers/ads-power-api.controller.js';
import { UserAppSettingsModule } from '@src/modules/user_app_settings/user-app-settings.module.js';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: AdsPowerAddress.name, schema: AdsPowerAddressSchema },
    ]),
    UserAppSettingsModule,
  ],
  controllers: [AdsPowerAddressController, AdsPowerApiController],
  providers: [
    AdsPowerAddressService,
    AdsPowerAddressRepository,
    AdsPowerApiService,
  ],
  exports: [
    AdsPowerAddressService,
    AdsPowerAddressRepository,
    AdsPowerApiService,
  ],
})
export class AdsPowerModule {}
