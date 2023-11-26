# KitsCon 23.2

Source code for demo given at [KitsCon 23.2](https://kits.se/kitscon/kitscon_23_2) showcasing CRDTs.

It is a collaborative Todo-app, using CRDTs (more specifically, [automerge](https://automerge.org/)) to communicate between peers. The implementation is largely inspired by the [automerge quickstart](https://automerge.org/docs/quickstart/) tutorial and two example implementations from automerge, [react-todo](https://github.com/automerge/automerge-repo/tree/main/examples/react-todo) and [react-use-awareness](https://github.com/automerge/automerge-repo/tree/main/examples/react-use-awareness). For communication between peers it uses the sync servergraciously provided by the automerge project to communicate via websocket. In case of network issues it also uses the BroadcastChannel API to communicate via browser tabs for an offline demo of the capabilities of CRDTs.

For those interested in learning more about CRDTs, here are some resources:

- [crdt.tech - site with links to papers, resources & implementations](crdt.tech)
- [Blogseries about implementing your own CRDT](https://jakelazaroff.com/words/an-interactive-intro-to-crdts/)
- [Paper with an overview of CRDTS from different developer perspectives](https://arxiv.org/pdf/1806.10254.pdf)
- [Paper with a more abstract overview of CRDTs](https://arxiv.org/pdf/1805.06358.pdf)
- [Blogpost from Figma about their use of CRDTs](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
