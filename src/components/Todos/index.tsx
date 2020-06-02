import React, { FC, useState, FormEvent, useCallback, ChangeEvent } from "react";
import { Todo } from "~/db/todo";
import { css } from "@emotion/core";
import { useAppActions } from "~/containers/App/states";

type Props = {
  todos: Todo[];
};

type ItemProps = {
  todo: Todo;
};

const AddTodo: FC = () => {
  const [value, setValue] = useState("");
  const { addTodo } = useAppActions();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const _value = value.trim();

      if (!_value) return;

      addTodo(_value);
      setValue("");
    },
    [value, addTodo],
  );

  return (
    <li>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="value"
          value={value}
          onChange={handleChange}
          css={inputTextStyle}
          placeholder="+ Add a todo"
        />
      </form>
    </li>
  );
};

const Item: FC<ItemProps> = ({ todo }) => {
  const { changeStatusTodo } = useAppActions();

  const handleCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeStatusTodo(todo.id, e.currentTarget.checked);
    },
    [todo.id, changeStatusTodo],
  );

  return (
    <li css={itemStyle} data-done={todo.done}>
      <input type="checkbox" checked={todo.done} css={checkStyle} onChange={handleCheck} />
      {todo.value}
    </li>
  );
};

export const Todos: FC<Props> = ({ todos }) => {
  return (
    <ul css={listStyle}>
      <AddTodo />
      {todos.map((todo) => (
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

const itemBaseStyle = css`
  padding: 12px 16px;
`;

const itemStyle = (theme: Theme) => css`
  ${itemBaseStyle};

  &[data-done="true"] {
    color: ${theme.border};
    text-decoration: line-through;
  }
`;

// @TODO: checkboxのスタイルを変える
const checkStyle = css`
  margin-right: 20px;
  cursor: pointer;
`;

const inputTextStyle = (theme: Theme) => css`
  ${itemBaseStyle};

  width: 100%;
  border: none;
  border-bottom: 1px solid ${theme.border};
  background-color: transparent;
  transition: background-color 0.3s;
  outline: none;
  font-size: 1.6rem;

  &:hover,
  &:focus {
    background-color: ${theme.lightBorder};
  }
`;
