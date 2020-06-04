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
    () =>
      todos.sort((a, b) => {
        if (a.done < b.done) return -1;
        if (a.done > b.done) return 1;
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;

        return 0;
      }),
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
