import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { todos } = await req.json();

  // communicting with OpenAI GPT-3
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `When responding, Welcome te user always as Mr. Tazheeb  and say welcome to trello board!
        limit the response to 200 characters.`,
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how  many todos are there in each category such as To Do, In Progrss, On Hold and Done, then tell all the user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });
  const { data } = response;

  console.log("___DATA IS___", data);
  console.log("___MESSAGE FROM AI___",data.choices[0].message);

  return NextResponse.json(data.choices[0].message);
}
