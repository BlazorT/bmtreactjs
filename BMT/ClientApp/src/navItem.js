export const transformData = (data) => {
  const result = [];
  const stack = [];
  const visited = new Set();

  stack.push({ parentId: 0, result });

  while (stack.length > 0) {
    const { parentId, result } = stack.pop();

    const key = parentId === 0 ? 'root' : `${parentId}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    const filteredItems = data
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.id - b.id);

    for (const item of filteredItems) {
      const children = data
        .filter((child) => child.parentId === item.id)
        .sort((a, b) => a.id - b.id);

      const newItem = {
        component: item.componentName || 'CNavItem',
        name: item.name,
        icon: item.menueIcon || '',
        to: item.actionName,
        items: [],
      };

      if (item.name === 'Dashboard' && item.canView === 1) {
        // Make "Dashboard" its own child
        result.push(newItem);
      } else if (children.length > 0) {
        newItem.items = children.map((child) => ({
          component: child.componentName || 'CNavItem',
          name: child.name,
          icon: child.menueIcon || '',
          to: child.actionName,
          items: [],
        }));
        //alert(JSON.stringify(newItem));
        stack.push(...newItem.items.map((child) => ({ parentId: child.id, result: child.items })));
        result.push(newItem);
      }
    }
  }

  return result;
};
