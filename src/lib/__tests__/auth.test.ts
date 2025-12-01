import { getToken, isAuthenticated, removeToken, setToken } from "../auth";

describe("auth utils", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: (() => {
        let store: Record<string, string> = {};
        return {
          getItem(key: string) {
            return store[key] ?? null;
          },
          setItem(key: string, value: string) {
            store[key] = value;
          },
          removeItem(key: string) {
            delete store[key];
          },
          clear() {
            store = {};
          },
        };
      })(),
      writable: true,
    });
  });

  it("当没有 token 时 isAuthenticated 返回 false", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("设置 token 后 isAuthenticated 返回 true，getToken 能取到值", () => {
    setToken("mock-token");

    expect(isAuthenticated()).toBe(true);
    expect(getToken()).toBe("mock-token");
  });

  it("removeToken 会清理 token", () => {
    setToken("mock-token");
    removeToken();

    expect(isAuthenticated()).toBe(false);
    expect(getToken()).toBeNull();
  });
});


