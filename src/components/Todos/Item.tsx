import React, { FC, useTransition, useCallback, ChangeEvent } from "react";
import { css } from "@emotion/core";
import { itemBaseStyle } from ".";
import { Todo } from "~/db/todo";
import { useAppActions } from "~/containers/App/states";
import { TRANSITION_CONFIG } from "~/constants";

type ItemProps = {
  todo: Todo;
};

export const Item: FC<ItemProps> = ({ todo }) => {
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
