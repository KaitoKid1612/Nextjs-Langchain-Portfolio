import { DataAPIClient  } from '@datastax/astra-db-ts';

import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const endpoint = process.env.ASTRA_DB_ENDPOINT || "";
const token = process.env.ASTRA_DB_APPLICATION_TOKEN || "";
const collection = process.env.ASTRA_DB_COLLECTION || "";

export async function getVectorStore() {
    return AstraDBVectorStore.fromExistingIndex(
        new GoogleGenerativeAIEmbeddings({
            model: "embedding-001",
        }),
        {
            token,
            endpoint,
            collection,
            collectionOptions: {
                vector: {
                  dimension: 768,
                  metric: "cosine",
                },
            },
        }
    );
}

export async function getEmbeddingsCollection() {
    const client = new DataAPIClient(token);
    const db = client.db(endpoint);

    (async () => {
        const colls = await db.listCollections();
        console.log('Connected to AstraDB:', colls);
      })();
}