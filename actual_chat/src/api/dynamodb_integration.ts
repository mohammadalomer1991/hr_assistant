export const put_item_into_dynamodb_table = (
    question: string,
    answer: string,
    sessionId:string,
    timestamp:string,
    createAt:string,
    ) => {
    const response= fetch(
    "https://20ijpfx5af.execute-api.ap-northeast-1.amazonaws.com/dev",
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question,
            answer,
            sessionId,
            timestamp,
            createAt

        }),
    }
    );

    console.log(response)
};


const  get_all_questions_of_specific_session= ()=>{
}

export const get_chat_sessions_of_particular_client=()=>{}