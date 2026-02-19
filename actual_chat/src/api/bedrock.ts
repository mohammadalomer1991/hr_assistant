export const fetchData = async (question:string):Promise<string> => {
    const response = await fetch(
        "https://vdehiwqk0k.execute-api.ap-northeast-1.amazonaws.com/bedrock_stage",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question: question,
        }),
        }
    );

    const data = await response.json();
    return data.response;
    };