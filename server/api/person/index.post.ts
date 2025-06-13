import { PersonService } from "../../services/person.service";
import { CreatePersonSchema } from "../../schemas/person.schema";
import type { PersonResponse } from "~/types/api";

export default defineEventHandler(async (event): Promise<PersonResponse> => {
  try {
    const body = await readBody(event);
    const validatedData = CreatePersonSchema.parse(body);

    const person = await PersonService.create(validatedData);

    return {
      success: true,
      data: person,
      message: "Person created successfully",
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
