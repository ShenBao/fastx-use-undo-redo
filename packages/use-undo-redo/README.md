# @fastx/use-undo-redo

`useUndoRedo` 一个 React Hook，为 `useState` 添加撤销/重做功能，提供简单易用的 API 。

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

## 特性

- 类似 `useState` 的 API
- 可选择状态变更后的处理方式，包括：`mergePastReversed`、`mergePast`、`destroyFuture` 或 `keepFuture`
- 可设置默认选项，避免每次 `setState` 都重复传入相同的行为配置
- 可设置历史记录上限，防止内存占用过大
- 无依赖
- 轻量级，无额外依赖

## 文档说明

useUndoRedo 没有复杂的抽象层，API 直接、易懂。

### API

初始化状态，与 `useState` 类似：

```js
const [yourState, setYourState, { undo, redo }] = useUndoRedo(initialState);
```

支持直接赋值和函数更新（functional updater）：

```js
setYourState(yourState + 1);
```

```js
setYourState((currentState) => currentState + 1);
```

`setState` 接受三个参数：

1. 要设置的新状态或更新函数
2. 当前一次调用的变更行为（可选）
3. `ignoreAction` 布尔值（可选）

`ignoreAction` 为 `true` 时，只更新当前状态 `present`，不修改 `past` 或 `future`，效果类似原生 `useState`。

### 撤销与重做

内部状态结构如下：

```js
{
    past: [0, 1, 2],
    present: 3,
    future: []
}
```

调用 `undo()` 会将 `present` 推入 `future` 并恢复 `past` 的最后一个值，`redo()` 则相反。

### 选项

`useUndoRedo` 接受两个参数：`initialState` 和可选的 `options`，格式如下：

```ts
interface Options {
  behavior?: "mergePastReversed" | "mergePast" | "destroyFuture" | "keepFuture";
  historyLimit?: number | "infinium" | "infinity";
  ignoreIdenticalMutations?: boolean;
  cloneState?: boolean;
}
```

#### 主要行为：

- `destroyFuture`：撤销后再更新状态会清空 `future`
- `mergePast` / `mergePastReversed`：将 `future` 合并进入 `past`
- `keepFuture`：保持 `future` 不变

### 其它导出值

除了主 API，第三个返回对象还包含：

```js
past, future, undo, canUndo, redo, canRedo, reset, static_setState;
```

`canUndo`/`canRedo` 用于判断当前是否可撤销或重做。  
`reset` 可重置状态到初始值或指定值。

### `resetInitialState`（处理异步数据）

当初始状态是空或 undefined（例如通过 API 获取数据）时，如果不处理，用户可能会撤销到空状态。  
`resetInitialState` 可替换 `past[0]` 为新值，避免这种情况。

### `static_setState`

只接受新值，不接受函数更新。不会因 `present` 改变而生成新引用，适合某些性能需求。


