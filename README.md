# @fastx/use-undo-redo

`useUndoRedo` 一个 React Hook，为 `useState` 添加撤销/重做功能，提供简单易用的 API 。

[在线示例：https://shenbao.github.io/fastx-use-undo-redo/](https://shenbao.github.io/fastx-use-undo-redo/)

## 安装

```bash
pnpm install @fastx/use-undo-redo
```

## 基本用法

```js
import useUndoRedo from "@fastx/use-undo-redo";

const MyComponent = () => {
  const initialState = 0;

  const [count, setCount, { undo, redo }] = useUndoRedo(initialState);

  return (
    <>
      <p>{count}</p>
      <button onClick={undo}>undo</button>
    </>
  );
};
```

## More links

- [GitHub Home](https://github.com/ShenBao)
- [Blog Home](https://shenbao.github.io)
- [About Me](https://shenbao.github.io/about/)

## License

MIT
