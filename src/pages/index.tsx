import { AiFillOpenAI } from "react-icons/ai";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-start flex-col">
      <style>{`
        /* 彩虹流动动画 */
        @keyframes rainbow-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* 应用到文字上的渐变动画类 */
        .rainbow-text {
          background: linear-gradient(
            90deg,
            #ff0080,
            #ff8c00,
            #40e0d0,
            #7b68ee,
            #ff0080
          );
          background-size: 200% 200%;
          animation: rainbow-move 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <AiFillOpenAI size={200} className="text-gray-400 cursor-default" />

      <h1 className="mb-4 text-4xl font-bold rainbow-text cursor-default">
        欢迎使用 员工管理系统
      </h1>

      <p className="mb-8 text-gray-600 cursor-default">
        请在右上角选择功能以继续
      </p>
    </div>
  );
}
