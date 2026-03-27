import { Client, Databases, Query, ID } from "appwrite";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint(endpoint) // Your API Endpoint
  .setProject(projectId); // Your project ID;

const database = new Databases(client);

export const updateSearchTerm = async (searchTerm: string, movie: any) => {
  const existingDocuments = await database.listDocuments(
    databaseId,
    collectionId,
    [Query.equal("searchTerm", searchTerm)]
  );

  if (existingDocuments.documents.length > 0) {
    const doc = existingDocuments.documents[0];
    await database.updateDocument(databaseId, collectionId, doc.$id, {
      count: doc.count + 1,
    });
  } else {
    await database.createDocument(databaseId, collectionId, ID.unique(), {
      searchTerm,
      count: 1,
      movie_id: movie?.id,
      poster_url: movie?.poster_path
        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        : "/default-poster.png",
    });
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(databaseId, collectionId, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.log(error);
  }
};
