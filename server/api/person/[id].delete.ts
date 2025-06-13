import { PersonService } from "../../services/person.service";

export default defineEventHandler(async event => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Person ID is required",
    });
  }

  const query = getQuery(event);
  const softDelete = query.soft === "true";

  let person;
  if (softDelete) {
    person = await PersonService.softDelete(id);
  } else {
    person = await PersonService.delete(id);
  }

  return {
    success: true,
    data: person,
    message: softDelete ? "Person deactivated successfully" : "Person deleted successfully",
  };
});
