import { DocumentInterface } from "@langchain/core/documents";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

async function generateEmbeddings() {
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

}

generateEmbeddings()