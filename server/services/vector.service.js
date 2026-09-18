const { Pinecone } = require( '@pinecone-database/pinecone')

const pc = new Pinecone({ apiKey: 'PINECONE_API_KEY' });

const cohortChatGptIndex= pc.index("cohort-chatgpt");

async function createMemory({id,vectors,metadata}){
    await cohirtChatGptIndex.upsert([{
   id:id,
   values:vectors,
   metadata
    }])
}

async function queryMemory({queryHeader,limit=5,metadata}){
    const data = await cohortChatGptIndex.query({
        vector:queryVector,
        topK:limit,
        filter:metadata?metadata:undefined
    })
    return data.matches
}

module.exports={
    createMemory,
    queryMemory
}