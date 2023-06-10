"use client";

import { useBoardStore } from "@/store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

const Board = () => {
  
  const [board, getBoard, setBoardState, updateTodoInDatabase] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDatabase,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    // check if user dragged the card outside of the board
    if (!destination) return;

    //handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    // Handle card dragging
    //This step is needed as the index are stored as numbers(0,1,2 etc.) instead of id's with DnD library

    const columns = Array.from(board.columns);
    const startColumnIndex = columns[Number(source.droppableId)];
    const finishColumnIndex = columns[Number(destination.droppableId)];

    const startColumn: Column = {
      id: startColumnIndex[0],
      todos: startColumnIndex[1].todos,
    };
    const finishColumn: Column = {
      id: finishColumnIndex[0],
      todos: finishColumnIndex[1].todos,
    };

    if (!startColumn || !finishColumn) return;

    if (source.index === destination.index && startColumn === finishColumn)
      return;

    const newTodos = startColumn.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startColumn.id === finishColumn.id) {
      // same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startColumn.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // dragging to another column

      const finishedTodos = Array.from(finishColumn.todos);
      finishedTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      };

      newColumns.set(startColumn.id, newCol);
      newColumns.set(finishColumn.id, {
        id: finishColumn.id,
        todos: finishedTodos,
      });

      // Updating in Database
      updateTodoInDatabase(todoMoved, finishColumn.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-7xl mx-auto"
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
