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
import { Loader } from "../Loader";
import { TRANSITION_CONFIG } from "~/constants";

type Props = {
  todos: Todo[];
};

type ItemProps = {
  todo: Todo;
};

type AddTodoProps = {};

const AddTodo: FC<AddTodoProps> = () => {
  const [value, setValue] = useState("");
  const { addTodo } = useAppActions();
  const [startAddTransition, adding] = useTransition(TRANSITION_CONFIG);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const _value = value.trim();

      if (!_value) return;

      addTodo(_value, startAddTransition);
      setValue("");
    },
    [value, startAddTransition, addTodo],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [],
  );

  return (
    <li>
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </li>
  );
};

const Item: FC<ItemProps> = ({ todo }) => {
  const { changeStatusTodo } = useAppActions();
  const [startChangeStatusTransition, changing] = useTransition(TRANSITION_CONFIG);

  const handleCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (changing) return;

      changeStatusTodo({
        id: todo.id,
        done: e.currentTarget.checked,
        startTransition: startChangeStatusTransition,
      });
    },
    [todo.id, changing, changeStatusTodo, startChangeStatusTransition],
  );

  return (
    <li css={itemStyle} data-done={todo.done}>
      <input
        type="checkbox"
        checked={changing ? !todo.done : todo.done}
        css={checkStyle}
        onChange={handleCheck}
        disabled={changing}
      />
      {todo.value}
    </li>
  );
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
