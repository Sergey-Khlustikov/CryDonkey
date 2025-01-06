import {Request, Response} from "express";
import AdsPowerAddressRepository from "#src/domains/ads/repositories/AdsPowerAddressRepository.js";

class AdsPowerAddressController {
  private adsPowerAddressRepository = new AdsPowerAddressRepository();

  async create(request: Request, response: Response): Promise<void> {
    try {
      const address = await this.adsPowerAddressRepository.create(request.authUser.id, request.body);

      response.status(200).json({message: 'Address created successfully', data: address});
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }

  async update(request: Request, response: Response): Promise<void> {
    try {
      await this.adsPowerAddressRepository.update(request.params.id, request.body);

      response.status(200).json({message: 'Address updated successfully'});
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    try {
      await this.adsPowerAddressRepository.deleteById(request.params.id);

      response.status(200).json({message: 'Address deleted successfully'});
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }

  async getList(request: Request, response: Response): Promise<void> {
    try {
      const addresses = await this.adsPowerAddressRepository.getListByUserId(request.authUser.id);

      response.status(200).json(addresses);
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }
}

export default AdsPowerAddressController
