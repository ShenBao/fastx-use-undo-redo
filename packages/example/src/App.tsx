import { Button, Tabs, type TabsProps } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import BasicDemo from "./components/BasicDemo";
import FlowDemo from "./components/FlowDemo";

const items: TabsProps["items"] = [
  {
    key: `1`,
    label: `Basic Demo`,
    children: <BasicDemo />,
  },
  {
    key: `2`,
    label: `Flow Demo`,
    children: <FlowDemo />,
  },
];

function App() {
  return (
    <>
      <Header
        style={{
          background: "unset",
          color: "#000",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1>useUndoRedo</h1>
        </div>
        <div className="actions">
          <Button
            type="link"
            key="github"
            href="https://github.com/ShenBao/fastx-use-undo-redo"
            target="_blank"
            rel="noreferrer"
          >
            <GithubOutlined />
          </Button>
        </div>
      </Header>
      <Tabs
        defaultActiveKey={items?.[0]?.key}
        type="card"
        style={{ marginBottom: 32 }}
        items={items}
        tabBarExtraContent={<>
          <Button type="link" target="_blank" href="https://github.com/ShenBao/fastx-use-undo-redo">docs</Button>
        </>}
      />
    </>
  );
}

export default App;
