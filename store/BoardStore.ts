import { databases } from "@/appWrite";
import { getTodosGroupedByColumns } from "@/utilities/getTodosGroupedByColumns";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDatabase: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDatabase: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
}));
