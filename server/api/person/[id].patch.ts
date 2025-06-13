import { PersonService } from "../../services/person.service";
import { UpdatePersonSchema } from "../../schemas/person.schema";

export default defineEventHandler(async event => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Person ID is required",
      });
    }

    const body = await readBody(event);
    const validatedData = UpdatePersonSchema.parse(body);

    const person = await PersonService.update(id, validatedData);

    return {
      success: true,
      data: person,
      message: "Person updated successfully",
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: (error as { issues: unknown }).issues,
      });
    }

    throw error;
  }
});
