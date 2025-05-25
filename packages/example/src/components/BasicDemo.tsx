import { useState } from "react";
import { Button, Divider, Form, Select } from "antd";
import useUndoRedo from "@fastx/use-undo-redo";

type MutationBehavior =
  | "mergePastReversed"
  | "mergePast"
  | "destroyFuture"
  | "keepFuture";

const BasicDemo = () => {
  const [behavior, setBehavior] =
    useState<MutationBehavior>("mergePastReversed");

  const [
    count,
    setCount,
    {
      past,
      future,

      undo,
      canUndo,
      redo,
      canRedo,
      reset,
      resetInitialState,
    },
  ] = useUndoRedo(0, {
    behavior,
    ignoreIdenticalMutations: true,
    cloneState: false,
  });

  const getVisualItem = (items: number[]) => {
    if (items.length === 0) {
      return (
        <span className="text-empty">
          <i>empty</i>
        </span>
      );
    }

    return items.map((e, i) => `${e}${i + 1 !== items.length ? ", " : ""}`);
  };

  return (
    <section className="section">
      <div className="container">
        <p>Past: {getVisualItem(past)}</p>
        <p>Present: {count}</p>
        <p>Future: {getVisualItem(future)}</p>

        <Divider />

        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item>
            <Button
              onClick={() => {
                const c = count + 1;
                setCount(c);
                setCount(c);
              }}
            >
              +
            </Button>
            <Button onClick={() => setCount((c) => c - 1)}>-</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={undo} disabled={!canUndo}>
              undo
            </Button>
            <Button onClick={redo} disabled={!canRedo}>
              redo
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => reset()}>reset</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => resetInitialState(42)}>
              resetInitialState to 66
            </Button>
            <Button onClick={() => resetInitialState(66, true)}>
              resetInitialState to 88 to present
            </Button>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Select
              style={{ width: 200 }}
              value={behavior}
              onChange={(value) => setBehavior(value)}
            >
              <Select.Option value="mergePastReversed">
                mergePastReversed
              </Select.Option>
              <Select.Option value="mergePast">mergePast</Select.Option>
              <Select.Option value="destroyFuture">destroyFuture</Select.Option>
              <Select.Option value="keepFuture">keepFuture</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <div>historyLimit: 100</div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default BasicDemo;
