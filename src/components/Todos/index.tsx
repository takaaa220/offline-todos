import React, { FC, useMemo } from "react";
import { css } from "@emotion/core";
import { AddTodo } from "./Add";
import { Item } from "./Item";
import { Todo } from "~/db/todo";

type Props = {
  todos: Todo[];
};

export const Todos: FC<Props> = ({ todos }) => {
  const sortedTodos = useMemo(
    () =>
      todos.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;

        return 0;
      }),
    [todos],
  );

  return (
    <ul css={listStyle}>
      <AddTodo />
      {sortedTodos.map((todo) => (
        <Item key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

const listStyle = (theme: Theme) => css`
  > li + li {
    border-top: 1px solid ${theme.border};
  }
`;

export const itemBaseStyle = css`
  padding: 12px 16px;
`;
