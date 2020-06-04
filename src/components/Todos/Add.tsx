import React, {
  useState,
  useTransition,
  useCallback,
  FormEvent,
  ChangeEvent,
  Suspense,
  FC,
} from "react";
import { css } from "@emotion/core";
import { Loader } from "../Loader";
import { itemBaseStyle } from ".";
import { useAppActions } from "~/containers/App/states";
import { TRANSITION_CONFIG } from "~/constants";

export const AddTodo: FC = () => {
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
    color: ${theme.char};

    &::placeholder {
      color: ${theme.border};
    }
  }

  &::placeholder {
    color: ${theme.darkBorder};
  }
`;
