import { PersonService } from "../../services/person.service";

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const searchQuery = query.q as string;

  if (!searchQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query parameter "q" is required',
    });
  }

  const results = await PersonService.search(searchQuery);

  return {
    success: true,
    data: results,
    count: results.length,
  };
});
