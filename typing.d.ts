interface Board {
  columns: Map<TypedColumn, Column>;
}
type TypedColumn = "Todo" | "Inprogress" | "Onhold" | "Done";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: TypedColumn;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}
