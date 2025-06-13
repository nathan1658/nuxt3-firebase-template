import { PersonModel, type PersonDocument } from "../models/person.model";
import {
  CreatePersonSchema,
  UpdatePersonSchema,
  PersonQuerySchema,
  type CreatePerson,
  type UpdatePerson,
  type PersonQuery,
} from "../schemas/person.schema";

export const PersonService = {
  create: async (data: CreatePerson): Promise<PersonDocument> => {
    const validatedData = CreatePersonSchema.parse(data);

    const existingPerson = await PersonModel.findByEmail(validatedData.email);
    if (existingPerson) {
      throw createError({
        statusCode: 409,
        statusMessage: "Person with this email already exists",
      });
    }

    const person = new PersonModel(validatedData);
    return await person.save();
  },

  findById: async (id: string): Promise<PersonDocument | null> => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid person ID format",
      });
    }

    return await PersonModel.findById(id);
  },

  findAll: async (
    query: PersonQuery = {},
  ): Promise<{
    data: PersonDocument[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const validatedQuery = PersonQuerySchema.parse(query);
    const { page, limit, search, isActive, sortBy, sortOrder } = validatedQuery;

    const filter: Record<string, unknown> = {};

    if (typeof isActive === "boolean") {
      filter.isActive = isActive;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions: Record<string, number> = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PersonModel.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      PersonModel.countDocuments(filter),
    ]);

    return {
      data: data as PersonDocument[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  update: async (id: string, data: UpdatePerson): Promise<PersonDocument | null> => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid person ID format",
      });
    }

    const validatedData = UpdatePersonSchema.parse(data);

    if (validatedData.email) {
      const existingPerson = await PersonModel.findOne({
        email: validatedData.email,
        _id: { $ne: id },
      });

      if (existingPerson) {
        throw createError({
          statusCode: 409,
          statusMessage: "Person with this email already exists",
        });
      }
    }

    const person = await PersonModel.findByIdAndUpdate(
      id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!person) {
      throw createError({
        statusCode: 404,
        statusMessage: "Person not found",
      });
    }

    return person;
  },

  delete: async (id: string): Promise<PersonDocument | null> => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid person ID format",
      });
    }

    const person = await PersonModel.findByIdAndDelete(id);

    if (!person) {
      throw createError({
        statusCode: 404,
        statusMessage: "Person not found",
      });
    }

    return person;
  },

  softDelete: async (id: string): Promise<PersonDocument | null> => {
    return await PersonService.update(id, { isActive: false });
  },

  findByEmail: async (email: string): Promise<PersonDocument | null> => {
    return await PersonModel.findByEmail(email);
  },

  search: async (query: string): Promise<PersonDocument[]> => {
    if (!query || query.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Search query is required",
      });
    }

    return await PersonModel.search(query.trim());
  },

  getStatistics: async () => {
    return await PersonModel.getStatistics();
  },

  findByAge: async (minAge: number, maxAge: number): Promise<PersonDocument[]> => {
    if (minAge < 0 || maxAge < 0 || minAge > maxAge) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid age range",
      });
    }

    return await PersonModel.findByAge(minAge, maxAge);
  },
};
