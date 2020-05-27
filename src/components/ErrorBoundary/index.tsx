import React, { Component } from "react";

type State = {
  error: boolean;
};

type Props = {
  name?: string;
  errorElement?: JSX.Element;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: unknown): void {
    console.error(error);
    console.error(errorInfo);

    this.setState({ error: true });
  }

  render() {
    const { children, errorElement } = this.props;
    const { error } = this.state;

    const element = errorElement || <p>errorおきたよ</p>;

    return !error ? children : element;
  }
}
