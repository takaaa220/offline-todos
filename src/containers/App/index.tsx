import React, { FC } from "react";
import { css } from "@emotion/core";

export const App: FC = () => {
  return <div css={wrapper}>hello world</div>;
};

const wrapper = css`
  width: 100%;
`;
