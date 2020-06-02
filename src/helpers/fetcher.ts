type State<T> =
  | {
      type: "resolved";
      value: T;
    }
  | {
      type: "pending";
      promise: Promise<T>;
    }
  | {
      type: "error";
      error: unknown;
    };

export class Fetcher<T> {
  private state: State<T>;

  constructor(fetch: () => Promise<T>) {
    const promise = fetch().then(
      (value) => {
        this.state = {
          type: "resolved",
          value,
        };

        return value;
      },
      (error) => {
        this.state = {
          type: "error",
          error,
        };

        throw error;
      },
    );

    this.state = {
      type: "pending",
      promise,
    };
  }

  public get(): T {
    switch (this.state.type) {
      case "pending":
        throw this.state.promise;
      case "error":
        throw this.state.error;
      default:
        return this.state.value;
    }
  }
}
