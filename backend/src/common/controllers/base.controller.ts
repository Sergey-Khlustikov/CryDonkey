import { IResponse } from '@src/common/dto/api-response.interface.js';

export abstract class BaseController {
  protected createResponse<T>(
    data: T,
    message: string = 'Operation successful',
  ): IResponse<T> {
    return { data, message };
  }

  protected createEmptyResponse(
    message: string = 'Operation successful',
  ): IResponse<null> {
    return { data: null, message };
  }
}
