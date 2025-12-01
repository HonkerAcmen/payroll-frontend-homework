import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Modal from "../Modal";

describe("Modal component", () => {
  it("关闭状态下不渲染任何内容", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="标题">
        内容
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it("打开时渲染标题和内容，并设置 body overflow", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="测试标题">
        <div>测试内容</div>
      </Modal>
    );

    expect(screen.getByText("测试标题")).toBeInTheDocument();
    expect(screen.getByText("测试内容")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    // 点击遮罩关闭
    const backdrop = screen.getByTestId("modal-backdrop");
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});


