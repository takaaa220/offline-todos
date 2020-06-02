import React, { FC, useEffect } from "react";
import { useAppActions } from "../App/states";

const Alert: FC = () => <p>このブラウザはサポートしていません</p>;

export const TopPage: FC = () => {
  const isValidBrowser = !!window.indexedDB;
  const { goToTodos } = useAppActions();

  useEffect(() => {
    if (isValidBrowser) {
      goToTodos();
    }
  }, []);

  return isValidBrowser ? <></> : <Alert />;
};
