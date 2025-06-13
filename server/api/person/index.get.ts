import { PersonService } from "../../services/person.service";
import { PersonQuerySchema } from "../../schemas/person.schema";

export default defineEventHandler(async event => {
  try {
    const query = getQuery(event);
    const validatedQuery = PersonQuerySchema.parse(query);

    const result = await PersonService.findAll(validatedQuery);

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
        data: (error as { issues: unknown }).issues,
      });
    }

    throw error;
  }
});
