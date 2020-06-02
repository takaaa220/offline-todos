import React, {
  FC,
  useState,
  FormEvent,
  useCallback,
  ChangeEvent,
  useTransition,
  Suspense,
} from "react";
import { Todo } from "~/db/todo";
import { css } from "@emotion/core";
import { useAppActions } from "~/containers/App/states";

type Props = {
  todos: Todo[];
};

type ItemProps = {
  todo: Todo;
  changing: boolean;
  onCheck: (id: string, done: boolean) => void;
};

type AddTodoProps = {
  adding: boolean;
  onSubmit: (value: string) => void;
};

const AddTodo: FC<AddTodoProps> = ({ onSubmit, adding }) => {
  const [value, setValue] = useState("");
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const _value = value.trim();

      if (!_value) return;

      onSubmit(_value);
      setValue("");
    },
    [value, onSubmit],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [],
  );

  return (
    <li>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="value"
          value={value}
          disabled={adding}
          onChange={handleChange}
          css={inputTextStyle}
          placeholder="+ Add a todo"
        />
      </form>
    </li>
  );
};

const Item: FC<ItemProps> = ({ todo, changing, onCheck }) => {
  const handleCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (changing) return;

      onCheck(todo.id, e.currentTarget.checked);
    },
    [todo.id, onCheck, changing],
  );

  return (
    <li css={itemStyle} data-done={todo.done}>
      <input
        type="checkbox"
        checked={todo.done}
        css={checkStyle}
        onChange={handleCheck}
        disabled={changing}
      />
      {todo.value}
    </li>
  );
};

export const Todos: FC<Props> = ({ todos }) => {
  const { addTodo, changeStatusTodo } = useAppActions();
  const [startAddTransition, adding] = useTransition({
    timeoutMs: 10000,
  });
  const handleAddTodo = useCallback(
    (value: string) => {
      addTodo(value, startAddTransition);
    },
    [addTodo, startAddTransition],
  );
  const [startChangeStatusTransition, changing] = useTransition({ timeoutMs: 10000 });
  const handleChangeStatus = useCallback((id: string, done: boolean) => {
    changeStatusTodo({ id, done, startTransition: startChangeStatusTransition });
  }, []);

  return (
    <ul css={listStyle}>
      <AddTodo onSubmit={handleAddTodo} adding={adding} />
      {todos.map((todo) => (
        <Item key={todo.id} todo={todo} onCheck={handleChangeStatus} changing={changing} />
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
