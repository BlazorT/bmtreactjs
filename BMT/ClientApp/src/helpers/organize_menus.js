export const organizeData = (data) => {
  const organized = {};
  const result = [];

  data.forEach((item) => {
    const { submenuId: id, parentId } = item;
    if (!organized[id]) {
      organized[id] = { ...item, children: [] };
    } else {
      organized[id] = { ...organized[id], ...item };
    }

    if (!parentId || parentId === 0) {
      result.push(organized[id]);
    } else {
      if (!organized[parentId]) {
        organized[parentId] = { children: [] };
      }
      organized[parentId].children.push(organized[id]);
    }
  });

  return result;
};

export const roles_initial_state = (data) =>
  organizeData(data).map((item) => {
    const childs =
      item.children.length < 1
        ? [
            {
              page: item.name,
              allRights:
                item.canAdd === 1 &&
                item.canDelete === 1 &&
                item.canView === 1 &&
                item.canPrint === 1 &&
                item.canExport === 1 &&
                item.canUpdate === 1,
              privileges: {
                edit: item.canUpdate === 1,
                add: item.canAdd === 1,
                delete: item.canDelete === 1,
                view: item.canView === 1,
                print: item.canPrint === 1,
                export: item.canExport === 1,
              },
            },
          ]
        : item.children.map((child) => ({
            page: child.name,
            allRights:
              child.canUpdate === 1 &&
              child.canAdd === 1 &&
              child.canDelete === 1 &&
              child.canView === 1 &&
              child.canExport === 1 &&
              child.canPrint === 1,
            privileges: {
              edit: child.canUpdate === 1,
              add: child.canAdd === 1,
              delete: child.canDelete === 1,
              view: child.canView === 1,
              print: child.canPrint === 1,
              export: child.canExport === 1,
            },
          }));

    const parentAllRights = childs.every((child) => child.allRights === true);

    return {
      parent: item.name,
      childs,
      parentAllRights,
    };
  });
