import { type FC, useCallback, useEffect, useMemo } from "react";
import { useUndoRedo } from "@fastx/use-undo-redo";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import type {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "antd";

const initialElements = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
    width: 150,
  },
  {
    id: "2",
    data: { label: "Default node" },
    position: { x: 100, y: 125 },
    width: 150,
  },
];

interface FlowState {
  nodes: Node[];
  edges: Edge[];
}

interface ButtonsProps {
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  reset: () => void;
}

const Buttons: FC<ButtonsProps> = ({ canUndo, undo, canRedo, redo, reset }) => (
  <div>
    <Button
      onClick={() => {
        undo();
      }}
      disabled={!canUndo}
    >
      Undo
    </Button>
    <Button
      onClick={() => {
        redo();
      }}
      disabled={!canRedo}
    >
      Redo
    </Button>
    <Button
      onClick={() => {
        reset();
      }}
    >
      Reset
    </Button>
  </div>
);

const App: FC = () => {
  const [
    state,
    setFlowState,
    { past, future, canUndo, undo, canRedo, redo, reset },
  ] = useUndoRedo<FlowState>({
    nodes: initialElements,
    edges: [],
  });

  console.log("canRedo", canUndo);
  console.log("canRedo", canRedo);
  console.log("past:", past);
  console.log("future:", future);

  const flowState = useMemo(() => ({ ...state }), [state]);

  useEffect(() => {
    console.log("Current state", flowState);
  }, [flowState]);

  const triggerUpdate = useCallback(
    (type: "nodes" | "edges", value: Node[] | Edge[]) => {
      setFlowState((prev) => ({
        nodes: type === "nodes" ? (value as Node[]) : prev.nodes,
        edges: type === "edges" ? (value as Edge[]) : prev.edges,
      }));
    },
    [setFlowState]
  );

  // @xyflow/react 会自动触发节点和连线的变更回调
  // @xyflow/react 会自动触发节点和连线的变更回调
  // @xyflow/react 会自动触发节点和连线的变更回调
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      triggerUpdate("nodes", applyNodeChanges(changes, flowState.nodes));
    },
    [flowState.nodes, triggerUpdate]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      triggerUpdate("edges", applyEdgeChanges(changes, flowState.edges));
    },
    [flowState.edges, triggerUpdate]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      triggerUpdate("edges", addEdge(connection, flowState.edges));
    },
    [flowState.edges, triggerUpdate]
  );

  return (
    <div className="flow-wrapper">
      <Buttons
        canUndo={!(past?.length <= 1)}
        canRedo={canRedo}
        undo={undo}
        redo={redo}
        reset={reset}
      />

      <div className="flow-wrapper" style={{ height: "600px", width: "100%" }}>
        <ReactFlow
          nodes={flowState.nodes}
          edges={flowState.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          zoomOnScroll={false}
          panOnScroll
        />
      </div>
    </div>
  );
};

export default App;
