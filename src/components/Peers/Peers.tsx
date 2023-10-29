import "./Peers.css";

import { useState } from "react";
import { PeerStates, Heartbeats } from "@automerge/automerge-repo-react-hooks";
import { EphemeralState } from "../../App";

interface PeersProps {
  peerStates: PeerStates;
  heartbeats: Heartbeats;
}

export const Peers = ({ peerStates, heartbeats }: PeersProps) => {
  const [showList, setShowList] = useState(false);

  return (
    <div className="peers-container">
      <div
        className="peers-header"
        onClick={() => setShowList((value) => !value)}
      >
        <div className="peers-heading">
          Connected peers: {Object.keys(peerStates).length}
        </div>
        <button className="peers-button">
          <div className={`${showList ? "up" : "down"}`}>{">"}</div>
        </button>
      </div>
      <div className={`peers-list ${showList ? "show" : "hide"}`}>
        {Object.entries(peerStates).map(
          ([key, state]: [string, EphemeralState], i) => (
            <div className="peer-item" key={`${state.username}-${i}`}>
              <p className="peer-username">
                {state.username} - Last heartbeat{" "}
                {Math.floor((new Date().getTime() - heartbeats[key]) / 1000)}{" "}
                seconds ago
              </p>
              <ul className="peer-state-list">
                <li>Todos created: {state.todosCreated}</li>
                <li>Todos completed: {state.todosCompleted}</li>
                <li>Todos uncompleted: {state.todosUncompleted}</li>
                <li>Todos deleted: {state.todosDeleted}</li>
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};
