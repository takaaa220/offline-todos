import React, { FC, createContext, useContext, useState, useCallback, ReactNode } from "react";
import { css } from "@emotion/core";

type ContextValue = {
  activeTab: number;
  setActiveTab: (index: number) => void;
};

const TabsContext = createContext<ContextValue>({} as ContextValue);

type Props = {
  initialTab?: number;
};

export const Tabs: FC<Props> = ({ initialTab = 0, children }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
  );
};

export const TabList: FC = ({ children }) => <ul css={listStyle}>{children}</ul>;

export const Tab: FC<{ tab: number }> = ({ tab, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  const handleClick = useCallback(() => {
    if (activeTab === tab) return;

    setActiveTab(tab);
  }, [activeTab, setActiveTab, tab]);

  return (
    <li css={itemStyle} data-active={activeTab === tab} onClick={handleClick}>
      {children}
    </li>
  );
};

type PanelProps = {
  tab: number;
  render?: (activeTab: number) => ReactNode;
};

export const TabPanel: FC<PanelProps> = ({ tab, render, children }) => {
  const { activeTab } = useContext(TabsContext);

  return (
    <div css={panelStyle} data-active={activeTab === tab}>
      {render?.(activeTab) || children}
    </div>
  );
};

const listStyle = (theme: Theme) => css`
  display: flex;
  border-bottom: 1px solid ${theme.lightBorder};
  margin-bottom: 12px;
`;

const itemStyle = (theme: Theme) => css`
  padding: 8px 20px;
  color: ${theme.darkBorder};
  cursor: pointer;

  &[data-active="true"] {
    color: ${theme.primary};
    cursor: default;
    border-bottom: 3px solid ${theme.primary};
    font-weight: bold;
  }
`;

const panelStyle = css`
  display: none;

  &[data-active="true"] {
    display: block;
  }
`;
