import formatTodoForAI from "./formatTodoForAi";

const fecthSuggestion = async (board: Board) => {
  const todos = formatTodoForAI(board);
  console.log("FORMATTED TODOS MSG >>", todos);  

  const response = await fetch("api/generateSummary", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTdata = await response.json();
  const { content } = GPTdata;
  console.log("__GPT_DATA__", content);
  
  return content;
};

export default fecthSuggestion;
