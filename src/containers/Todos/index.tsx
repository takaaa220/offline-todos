import React, { FC } from "react";
import { Fetcher } from "~/helpers/fetcher";
import { Todo } from "~/db/todo";

type Props = {
  todosFetcher: Fetcher<Todo[]>;
};

export const TodosPage: FC<Props> = ({ todosFetcher }) => {
  const todos = todosFetcher.get();
  console.log(todos);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.value}</li>
      ))}
    </ul>
  );
};
