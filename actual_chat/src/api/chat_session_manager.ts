export  interface Session{
    SessionID:string,
    Title:string,
    CreatedAt:string,
    LastMessageAt:string
}
export const get_all_sessions_for_specific_cleint=async(client_id:number)=>{

    // const mockSessions: Session[] = [
    //     {
    //       SessionID: "session-001",
    //       Title: "喫煙所はどこですか？",
    //       CreatedAt: "2026-01-29T10:30:00.000Z",
    //       LastMessageAt: "2026-01-29T10:35:00.000Z",
    //     },
    //     {
    //       SessionID: "session-002",
    //       Title: "オフィスの営業時間は？",
    //       CreatedAt: "2026-01-28T09:00:00.000Z",
    //       LastMessageAt: "2026-01-28T09:15:00.000Z",
    //     },
    //     {
    //       SessionID: "session-003",
    //       Title: "会議室の予約方法は？",
    //       CreatedAt: "2026-01-27T14:00:00.000Z",
    //       LastMessageAt: "2026-01-27T14:20:00.000Z",
    //     },
    //     {
    //       SessionID: "session-004",
    //       Title: "有給休暇の申請方法は？",
    //       CreatedAt: "2026-01-26T11:00:00.000Z",
    //       LastMessageAt: "2026-01-26T11:10:00.000Z",
    //     },
    //     {
    //       SessionID: "session-005",
    //       Title: "社割制度について教えてください",
    //       CreatedAt: "2026-01-25T16:00:00.000Z",
    //       LastMessageAt: "2026-01-25T16:25:00.000Z",
    //     },
    // ];

    // // Simulate API delay (remove this later)
    // await new Promise((resolve) => setTimeout(resolve, 500));

    // // Return sessions sorted by LastMessageAt (newest first)
    // return mockSessions.sort(
    // (a, b) =>
    //     new Date(b.LastMessageAt).getTime() - new Date(a.LastMessageAt).getTime()
    // );


}

export const get_chat_sessions_of_particular_client = async (
  clientID: string
): Promise<Session[]> => {

  const response = await fetch(
    "https://1q30yb2061.execute-api.ap-northeast-1.amazonaws.com/dev",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientID }),
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  const sessions: Session[] = data.sessions; // <-- match Lambda response

  return sessions.sort(
    (a, b) =>
      new Date(b.LastMessageAt).getTime() -
      new Date(a.LastMessageAt).getTime()
  );
};


  
const generateSessionId = (): string => {
    return crypto.randomUUID(); 
    // Output example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
};