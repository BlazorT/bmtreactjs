import React, { useEffect, useState } from 'react';

import moment from 'moment';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';

import { roles_initial_state } from 'src/helpers/organize_menus';

import DARoles from '../RoleSettingComponents/DARoles';
import useFetch from 'src/hooks/useFetch';

const DSPRolesModal = (prop) => {
  const { isOpen, toggle, roleId, rolesData, header, canUpdate } = prop;

  const dispatch = useDispatch();
  const {
    response: rolesRes,
    error: rolesErr,
    loading: rolesLoading,
    fetchData: postRoles,
  } = useFetch();

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
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: 'Are you sure you want to cancel?',
        isOpen: true,
        onYes: () => onYesConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
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

    await postRoles('/Common/submitgrouprights', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    console.log(rolesRes);
    if (rolesRes?.current?.status === true) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'Roles added succesfully',
          toastVariant: 'success',
        }),
      );
      toggle();
      setRoleSetting([]);
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong',
          toastVariant: 'error',
        }),
      );
    }
  };

  const onYesConfirm = () => {
    toggle();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };
  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>{header}</ModalHeader>
      <ModalBody className="paddingAllSide">
        <div className="text-center mgTop">
          <div className="row pt-2">
            <div className="col-md-12 col-xl-12">
              <DARoles
                handleRoleChange={handleRoleChange}
                rolesSetting={rolesSetting}
                handleParentAllRightsChange={handleParentAllRightsChange}
                rolesData={rolesData}
                canUpdate={canUpdate}
              />
            </div>
          </div>
        </div>

        <div className="CenterAlign pt-2">
          <button
            onClick={() => onCancel()}
            type="button"
            className="btn btn_Default m-2 sales-btn-style"
          >
            Cancel
          </button>
          {canUpdate === 1 && (
            <button
              onClick={() => onSave()}
              type="button"
              className="btn btn_Default sales-btn-style m-2"
            >
              Save
            </button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};
export default DSPRolesModal;
