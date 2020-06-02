import React, { FC, useMemo } from "react";
import { Fetcher } from "~/helpers/fetcher";
import { Todo } from "~/db/todo";
import { Todos } from "~/components/Todos";
import { css } from "@emotion/core";

type Props = {
  todosFetcher: Fetcher<Todo[]>;
};

export const TodosPage: FC<Props> = ({ todosFetcher }) => {
  const todos = todosFetcher.get();
  const sortedTodos = useMemo(
    () => [...todos.filter((todo) => !todo.done), ...todos.filter((todo) => todo.done)],
    [todos],
  );

  return (
    <section css={wrapperStyle}>
      <h1 css={headingStyle}>Todos</h1>
      <Todos todos={sortedTodos} />
    </section>
  );
};

const wrapperStyle = css`
  max-width: 760px;
  padding: 40px 16px;
  margin: 0 auto;
`;

const headingStyle = css`
  font-weight: bold;
  font-size: 2.4rem;
`;
