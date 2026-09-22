const { Pinecone } = require( '@pinecone-database/pinecone')

const pc = new Pinecone({ apiKey:process.env.PINECONE_API_KEY });

const cohortChatGptIndex= pc.index("cohort-chatgpt");

async function createMemory({ id, vectors, metadata }) {
    await cohortChatGptIndex.upsert({
        records: [
            {
                id: id,
                values: vectors,
                metadata
            }
        ]
    });
}

async function queryMemory({queryVector,limit=5,metadata}){
    const data = await cohortChatGptIndex.query({
        vector:queryVector,
        topK:limit,
        filter:metadata?metadata:undefined,
        includeMetadata: true // Needed so matches contain text
    })
    return data.matches;
}

module.exports={
    createMemory,
    queryMemory
}