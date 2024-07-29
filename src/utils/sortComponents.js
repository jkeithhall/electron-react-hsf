export default function sortComponents(componentList) {
  return componentList.sort((a, b) => {
    // Assets ordered by id
    if (!a.parent && !b.parent) return a.id - b.id;
      // Subcomponents ordered by parents' id
    if (a.parent && b.parent) {
      return a.parent.id === b.parent.id ? a.parent.id - b.parent.id : a.id - b.id;
    }
    // Subcomponents ordered after their parent but before other assets
    if (!a.parent && b.parent) {
      if (a.id === b.parent) return -1;
      return a.id - b.parent.id;
    }
    if (a.parent && !b.parent) {
      if (a.parent.id === b.id) return 1;
      return a.parent.id - b.id;
    }
    return 0;
  });
}