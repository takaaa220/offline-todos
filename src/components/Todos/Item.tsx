import React, {
  FC,
  useTransition,
  useCallback,
  ChangeEvent,
  useState,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import { css } from "@emotion/core";
import { itemBaseStyle } from ".";
import { Todo } from "~/db/todo";
import { useAppActions } from "~/containers/App/states";
import { TRANSITION_CONFIG } from "~/constants";

type ItemProps = {
  todo: Todo;
};

export const Item: FC<ItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { changeStatusTodo, editTodo } = useAppActions();
  const [startChangeStatusTransition, changing] = useTransition(TRANSITION_CONFIG);
  const [startEditTransition, updating] = useTransition(TRANSITION_CONFIG);

  const handleStartEdit = useCallback(() => {
    setEditing(true);
  }, []);
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

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();

      const _value = value.trim();
      if (!_value) {
        setEditing(false);
        setValue(todo.value);
        return;
      }

      editTodo({ id: todo.id, value: _value, startTransition: startEditTransition });
      setEditing(false);
    },
    [value, todo.value, todo.id, startEditTransition, editTodo],
  );

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  return (
    <li css={itemStyle} data-done={todo.done}>
      <input
        type="checkbox"
        checked={changing ? !todo.done : todo.done}
        css={checkStyle}
        onChange={handleCheck}
        disabled={changing}
      />
      {editing ? (
        <>
          <form css={formStyle} onSubmit={handleSubmit}>
            <div css={overlayStyle} onClick={() => handleSubmit()} />
            <input
              ref={inputRef}
              css={inputStyle}
              type="text"
              value={value}
              onChange={handleChange}
            />
          </form>
        </>
      ) : (
        <p className="text" css={textStyle} onClick={handleStartEdit}>
          {todo.value}
        </p>
      )}
      <span className="edit" css={editStyle}>
        Edit
      </span>
    </li>
  );
};

const itemStyle = (theme: Theme) => css`
  ${itemBaseStyle};
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.lightBorder};

    > .edit {
      opacity: 1;
    }
  }

  &[data-done="true"] {
    > .text {
      color: ${theme.border};
      text-decoration: line-through;
    }
  }
`;

const textStyle = css`
  flex: 1;
`;

// @TODO: checkboxのスタイルを変える
const checkStyle = css`
  margin-right: 20px;
  cursor: pointer;
`;

const formStyle = css`
  flex: 1;
`;

const inputStyle = (theme: Theme) => css`
  position: relative;
  display: block;
  width: 100%;
  font-size: 1.8rem;
  color: ${theme.char};
  background-color: transparent;
  border: none;
  outline: none;
  line-height: 1.6;
`;

const editStyle = (theme: Theme) => css`
  font-size: 1.2rem;
  color: ${theme.border};
  opacity: 0;
  transition: opacity 0.2s;
`;

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
