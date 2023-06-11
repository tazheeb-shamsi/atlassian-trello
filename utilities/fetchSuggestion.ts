import formatTodoForAI from "./formatTodoForAi";

const fecthSuggestion = async (board: Board) => {
  const todos = formatTodoForAI(board);

  const response = await fetch("api/generateSummary", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTdata = await response.json();
  const { content } = GPTdata;

  return content;
};

export default fecthSuggestion;
