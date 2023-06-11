import { ID, databases, storage } from "@/appWrite";
import { getTodosGroupedByColumns } from "@/utilities/getTodosGroupedByColumns";
import uploadImage from "@/utilities/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;

  setBoardState: (board: Board) => void;

  updateTodoInDatabase: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;

  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
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

  image: null,
  setImage: (image: File | null) => set({ image }),

  newTaskInput: "",
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  newTaskType: "Todo",
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo =  {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumn = new Map(get().board.columns);

    //delete todoId from newColumn
    newColumn.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumn } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

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
