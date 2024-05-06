import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
// Configure dotenv before other imports
import { DocumentInterface } from "@langchain/core/documents";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { getVectorStore, getEmbeddingsCollection } from "../../lib/astradb";

async function generateEmbeddings() {
  const vectorStore = await getVectorStore();

  (await getEmbeddingsCollection());

  const loader = new DirectoryLoader(
    "src/document_loaders/example_data/example",
    {
      ".txt": (path) => new TextLoader(path),
    },
    true,
  );

  const docs = (await loader.load()).map((doc): DocumentInterface => {
    const url = doc.metadata.source
      .replace(/\\/g, "/")
      .split("/src/document_loaders/example_data/example/")[1]
      .split(".")[0] || "/";

    const pageContentTrimmed = doc.pageContent
      .replace(/\r/g, "")
      .replace(/^\s*[\r\n]/gm, "")
      .trim();

    return {
      pageContent: pageContentTrimmed,
      metadata: { url },
    };
  });

  const text = docs.map((doc) => doc.pageContent).join("");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 10,
  });
  
  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: text }),
  ]);

  await vectorStore.addDocuments(docOutput);
}

generateEmbeddings()