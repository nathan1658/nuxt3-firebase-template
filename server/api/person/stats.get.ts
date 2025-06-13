import { PersonService } from "../../services/person.service";

export default defineEventHandler(async _event => {
  const stats = await PersonService.getStatistics();

  return {
    success: true,
    data: stats,
  };
});
