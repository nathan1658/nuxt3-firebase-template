import { PersonService } from "../../services/person.service";

export default defineEventHandler(async event => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Person ID is required",
    });
  }

  const person = await PersonService.findById(id);

  if (!person) {
    throw createError({
      statusCode: 404,
      statusMessage: "Person not found",
    });
  }

  return {
    success: true,
    data: person,
  };
});
