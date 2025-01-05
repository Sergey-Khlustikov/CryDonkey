import {usersSeeder} from "#src/db/seeders/usersSeeder.js";

const runSeeders = async () => {
  await usersSeeder();
}

export default runSeeders;
