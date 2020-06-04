import React, { FC } from "react";
import { Todo } from "~/db/todo";
import { css } from "@emotion/core";
import { AddTodo } from "./Add";
import { Item } from "./Item";

type Props = {
  todos: Todo[];
};

export const Todos: FC<Props> = ({ todos }) => (
  <ul css={listStyle}>
    <AddTodo />
    {todos.map((todo) => (
      <Item key={todo.id} todo={todo} />
    ))}
  </ul>
);

const listStyle = (theme: Theme) => css`
  > li + li {
    border-top: 1px solid ${theme.border};
  }
`;

export const itemBaseStyle = css`
  padding: 12px 16px;
`;
