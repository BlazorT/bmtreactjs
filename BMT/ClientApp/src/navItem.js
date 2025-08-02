export const transformData = (data) => {
  const result = [];
  const stack = [];
  const visited = new Set();
  console.log("data", data);
  // Push the root elements onto the stack
  stack.push({ parentId: 0, result });

  while (stack.length > 0) {
    const { parentId, result } = stack.pop();
    const key = parentId === 0 ? 'root' : `${parentId}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    // Filter items with matching parentId
    const filteredItems = data
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.submenuId - b.submenuId);

    for (const item of filteredItems) {
      // Filter children items
      const children = data
        .filter((child) => child.parentId === item.submenuId && child.canView === 1)
        .sort((a, b) => a.submenuId - b.submenuId);

      const newItem = {
        component: item.tag || item.name === "Dashboard" ?'CNavItem': 'CNavGroup',
        name: item.name,
        icon: item.menueIcon || '',
        to: item.actionName,
        items: [],
      };

      if (item.name === 'Dashboard' && item.canView === 1) {
        // Make "Dashboard" its own child
        result.push(newItem);
      } else {
        if (children.length > 0) {
          newItem.items = children.map((child) => ({
            component: child.tag || 'CNavItem',
            name: child.name,
            icon: child.menueIcon || '',
            to: child.actionName,
            items: [],
          }));

          // Add children to stack for further processing
          stack.push(...newItem.items.map((child) => ({ parentId: child.id, result: child.items })));
        }
        result.push(newItem);
      }
    }
  }

  console.log(result);
  return result;
};
