import React, { FC } from "react";
import { css } from "@emotion/core";

export const Loader: FC = () => <p>loading...</p>;

export const PageLoader: FC = () => <div>loading...</div>;

export const FixedLoader: FC = () => <div css={fixedStyle} />;

const fixedStyle = css`
  position: fixed;
  top: 70px;
  right: 60px;
  width: 80px;
  height: 80px;
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
