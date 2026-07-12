import type { PracticeNode } from "@/types/practice-graph/practice-node";

const revisionBatchSize = 9;
const stretchInsertEvery = 9;
const discoveryInsertEvery = 19;

/** Order practice nodes toward ~85% revision, ~10% stretch, ~5% discovery. */
export function orderNodesByDistribution(nodes: PracticeNode[]): PracticeNode[] {
  const revision = nodes.filter((node) => node.weight === "revision");
  const stretch = nodes.filter((node) => node.weight === "stretch");
  const discovery = nodes.filter((node) => node.weight === "discovery");

  const ordered: PracticeNode[] = [];
  let stretchIndex = 0;
  let discoveryIndex = 0;

  for (let index = 0; index < revision.length; index += 1) {
    ordered.push(revision[index]);

    const turn = index + 1;
    if (turn % stretchInsertEvery === 0 && stretchIndex < stretch.length) {
      ordered.push(stretch[stretchIndex]);
      stretchIndex += 1;
    }

    if (turn % discoveryInsertEvery === 0 && discoveryIndex < discovery.length) {
      ordered.push(discovery[discoveryIndex]);
      discoveryIndex += 1;
    }
  }

  while (stretchIndex < stretch.length) {
    ordered.push(stretch[stretchIndex]);
    stretchIndex += 1;
  }

  while (discoveryIndex < discovery.length) {
    ordered.push(discovery[discoveryIndex]);
    discoveryIndex += 1;
  }

  if (ordered.length === 0) {
    return [...nodes].sort((left, right) => left.order - right.order);
  }

  return ordered.map((node, index) => ({
    ...node,
    order: index,
  }));
}

export function countDistribution(nodes: PracticeNode[]) {
  return nodes.reduce(
    (counts, node) => {
      counts[node.weight] += 1;
      return counts;
    },
    { revision: 0, stretch: 0, discovery: 0 },
  );
}

export { revisionBatchSize };
