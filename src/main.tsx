import React from "react";
import ReactDOM from "react-dom/client";
import App, { CounterDoc } from "./App.tsx";
import "./index.css";

import { isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
//import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { next as A } from "@automerge/automerge";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";

const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
  storage: new IndexedDBStorageAdapter(),
});

const rootDocUrl = `${document.location.hash.substring(1)}`;
//const rootDocUrl = "automerge:3suNpCb1ci2mqUWrCJBCfWWoKMEr" // hardcoded
let handle;
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl);
} else {
  A.from
  handle = repo.create<CounterDoc>();
  handle.change((d) => {d.counter = new A.Counter(); d.list = []; d.myObject = {}});
}
const docUrl = (document.location.hash = handle.url);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <App docUrl={docUrl} />
    </RepoContext.Provider>
  </React.StrictMode>
);
