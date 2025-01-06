import AdsPowerAddress, {IAdsPowerAddress} from "#src/domains/ads/models/AdsPowerAddress.js";

class AdsPowerAddressRepository {
  async create(userId: string, data: IAdsPowerAddress) {
    return AdsPowerAddress.create({
      userId,
      name: data.name,
      host: data.host,
      port: data.port,
    })
  }

  async update(id: string, data: IAdsPowerAddress) {
    const model = await AdsPowerAddress.findById(id);

    if (!model) {
      throw new Error('Model not found');
    }

    if (data.name) {
      model.name = data.name;
    }
    if (data.host) {
      model.host = data.host;
    }
    if (data.port) {
      model.port = data.port;
    }

    return model.save();
  }

  async deleteById(id: string) {
    return AdsPowerAddress.findByIdAndDelete(id);
  }

  async getListByUserId(userId: string): Promise<IAdsPowerAddress[]> {
    return AdsPowerAddress.find({userId})
  }
}

export default AdsPowerAddressRepository;
