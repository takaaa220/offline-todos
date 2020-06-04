import React, { FC, useMemo } from "react";
import { css } from "@emotion/core";
import { Fetcher } from "~/helpers/fetcher";
import { Todo } from "~/db/todo";
import { Todos } from "~/components/Todos";
import { Tabs, TabList, Tab, TabPanel } from "~/components/Tab";

type Props = {
  todosFetcher: Fetcher<Todo[]>;
};

export const TodosPage: FC<Props> = ({ todosFetcher }) => {
  const todos = todosFetcher.get();
  const doneTodos = useMemo(() => todos.filter((todo) => todo.done), [todos]);
  const inProgressTodos = useMemo(() => todos.filter((todo) => !todo.done), [todos]);

  return (
    <section css={wrapperStyle}>
      <h1 css={headingStyle}>Todos</h1>
      <div>
        <Tabs>
          <TabList>
            <Tab tab={0}>Todo</Tab>
            <Tab tab={1}>Done</Tab>
          </TabList>
          <TabPanel tab={0}>
            <Todos todos={inProgressTodos} />
          </TabPanel>
          <TabPanel tab={1}>
            <Todos todos={doneTodos} />
          </TabPanel>
        </Tabs>
      </div>
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
