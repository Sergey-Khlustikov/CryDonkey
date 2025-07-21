export interface ISeeder {
  name: string;

  seed(): Promise<void>;
}

export abstract class BaseSeeder implements ISeeder {
  abstract name: string;

  abstract seed(): Promise<void>;

  async run(): Promise<void> {
    console.log(`🚀 [Seeder] Starting: ${this.name}`);
    await this.seed();
    console.log(`✅ [Seeder] Done:     ${this.name}\n`);
  }
}
