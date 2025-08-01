import React, { useEffect, useState } from 'react';

import moment from 'moment';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { roles_initial_state } from 'src/helpers/organize_menus';

import DARoles from '../RoleSettingComponents/DARoles';
import Button from '../UI/Button';
import useApi from 'src/hooks/useApi';
import { useNotification } from 'src/hooks/useNotification';
import LoadingBtn from '../UI/LoadingBtn';

const BmtRolesModal = (prop) => {
  const { isOpen, toggle, roleId, rolesData, header, canUpdate } = prop;
   console.log({ rolesData });
  const { showSnackbar, showConfirmation } = useNotification();

  const { loading, postData: postRoles } = useApi('/Common/submitgrouprights');

  const [rolesSetting, setRoleSetting] = useState([]);

  useEffect(() => {
    if (rolesData !== undefined) {
      const sortedData = rolesData !== undefined ? rolesData?.sort((a, b) => a.id - b.id) : [];
      const iniData = roles_initial_state(sortedData);
      setRoleSetting(iniData);
    } else {
      setRoleSetting([]);
    }
  }, [rolesData]);

  const handleRoleChange = (parentName, pageName, right, value) => {
    console.log({ parentName, pageName, right, value });
    setRoleSetting((prevData) => {
      const newData = prevData.map((parent) => {
        if (parent.parent === parentName) {
          const updatedChilds = parent.childs.map((child) => {
            if (child.page === pageName) {
              const updatedPrivileges =
                right === 'allRights'
                  ? {
                    allRights: value,
                    edit: value,
                    add: value,
                    delete: value,
                    view: value,
                    print: value,
                    export: value,
                  }
                  : { ...child.privileges, [right]: value };

              const allRightsChecked = Object.keys(updatedPrivileges).every(
                (privilege) => privilege === 'allRights' || updatedPrivileges[privilege],
              );

              return {
                ...child,
                privileges: updatedPrivileges,
                allRights: allRightsChecked,
              };
            }
            return child;
          });

          const allRightsChecked = updatedChilds.every((child) => child.allRights);

          return {
            ...parent,
            childs: updatedChilds,
            parentAllRights: allRightsChecked, // Update parentAllRights based on all child allRights
          };
        }
        return parent;
      });

      return newData;
    });
  };
  const handleParentAllRightsChange = (parentName, value) => {
    setRoleSetting((prevData) => {
      const newData = prevData.map((parent) => {
        if (parent.parent === parentName) {
          const updatedChilds = parent.childs.map((child) => {
            const updatedPrivileges = {
              allRights: value,
              edit: value,
              add: value,
              delete: value,
              view: value,
              print: value,
              export: value,
            };

            return {
              ...child,
              privileges: updatedPrivileges,
              allRights: value,
            };
          });

          return {
            ...parent,
            childs: updatedChilds,
            parentAllRights: value,
          };
        }
        return parent;
      });

      return newData;
    });
  };

  const onCancel = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => onYesConfirm(),
      onNo: () => onNoConfirm(),
    });
  };
  const onSave = async () => {
    const updatePrivileges = (apiData, frontendData) => {
      return apiData
        .map((item) => {
          const frontendItem = frontendData.find(
            (fItem) =>
              fItem.parent === item.name ||
              (fItem.childs && fItem.childs.some((child) => child.page === item.name)),
          );

          if (frontendItem && frontendItem.childs && frontendItem.childs.length > 0) {
            // If frontend data is found and has children, update child-specific values
            const childPrivileges = frontendItem.childs.find((child) => child.page === item.name);
            console.log({ childPrivileges, item });
            if (childPrivileges) {
              const newItem = {
                id: item.assignmentId,
                roleId: roleId,
                menuId: item.submenuId,
                full: childPrivileges.allRights ? 1 : 0,
                canAdd: childPrivileges.privileges.add ? 1 : 0,
                canUpdate: childPrivileges.privileges.edit ? 1 : 0,
                canDelete: childPrivileges.privileges.delete ? 1 : 0,
                canView: childPrivileges.privileges.view ? 1 : 0,
                canPrint: childPrivileges.privileges.print ? 1 : 0,
                canExport: childPrivileges.privileges.export ? 1 : 0,
                createdBy: 1,
                rowVer: 1,
                status: 1,
                lastUpdatedBy: 1,
                lastUpdatedAt: moment().format(),
                createdAt: moment().format(), // current date time
                // Add other keys as needed
              };

              return newItem;
            }
          }

          // If no frontend data or child privileges found, return null or an appropriate default value
          return null; // or a default object
        })
        .filter((item) => item !== null); // Remove null values from the result
    };

    const body = updatePrivileges(rolesData, rolesSetting);
    console.log(body.filter((b)=>b.id!=0));
    const res = await postRoles(body);
    console.log("res", res);
    if (res?.status === true) {
      showSnackbar(res?.message, 'success');
      
      toggle();
      setRoleSetting([]);
    } else {
      showSnackbar(res?.message, 'error');
    }
  };

  const onYesConfirm = () => {
    toggle();
    onNoConfirm();
  };
  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>{header}</ModalHeader>
      <ModalBody className="paddingAllSide">
        <DARoles
          handleRoleChange={handleRoleChange}
          rolesSetting={rolesSetting}
          handleParentAllRightsChange={handleParentAllRightsChange}
          rolesData={rolesData}
          canUpdate={canUpdate}
        />
        <div className="CenterAlign pt-2">
          {loading ? (
            <LoadingBtn title="Submitting" />
          ) : (
            <React.Fragment>
              <Button title="Cancel" onClick={onCancel} />
              {canUpdate === 1 && <Button title="Save" onClick={onSave} />}
            </React.Fragment>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};
export default BmtRolesModal;
