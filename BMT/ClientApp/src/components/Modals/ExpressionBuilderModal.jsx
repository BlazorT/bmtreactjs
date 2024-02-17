import React, { useState } from 'react';

import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { QueryBuilder, defaultValidator, formatQuery, parseJsonLogic } from 'react-querybuilder';

import AddRuleButton from '../QueryBuilderComponents/AddRuleButton';
import GroupRuleButton from '../QueryBuilderComponents/GroupRuleButton';
import CustomCombinator from '../QueryBuilderComponents/CustomCombinator';
import NotToggleBtn from '../QueryBuilderComponents/NotToggleBtn';
import FieldSelector from '../QueryBuilderComponents/FieldSelector';

import 'react-querybuilder/dist/query-builder.css';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';

function BuilderModal(prop) {
  const { toggle, isOpen, fields, name, setDaWorkFlowData, fieldsEntites, value, entities } = prop;
  const [query, setQuery] = useState();
  const [entity, setEntity] = useState(1);
  const dispatch = useDispatch();

  const onSave = () => {
    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: 'expression succesfully build',
        toastVariant: 'success',
      }),
    );

    toggle();
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

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };
  const onYesConfirm = () => {
    onCancel();
    // setQuery({ rules: [] });
    // setDaWorkFlowData((prevData) => ({
    //   ...prevData,
    //   [name]: '',
    // }));
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    toggle();
  };
  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop={true}
      fullscreen="lg"
      className="w-50"
      centered={true}
      toggle={toggle}
    >
      {/* <ModalHeader className="confirmation-modal-header">{header}</ModalHeader> */}
      <ModalBody className="confirmation-modal-body rounded">
        <QueryBuilder
          fields={fields}
          query={query}
          defaultQuery={value != '' && value && JSON.parse(value)}
          onQueryChange={(q) => {
            setQuery(q);

            setDaWorkFlowData &&
              setDaWorkFlowData((prevData) => ({
                ...prevData,
                [name]: q.rules.length > 0 ? formatQuery(q, 'json_without_ids') : '',
              }));
          }}
          autoSelectField={false}
          autoSelectOperator={false}
          resetOnFieldChange={false}
          controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
          validator={defaultValidator}
          independentCombinators
          // showNotToggle
          // showCombinatorsBetweenRules
          controlElements={{
            addRuleAction: (prop) => (
              <AddRuleButton
                prop={prop}
                entity={entity}
                setEntity={setEntity}
                entities={entities}
              />
            ),
            addGroupAction: (prop) => <GroupRuleButton prop={prop} />,
            combinatorSelector: (prop) => <CustomCombinator prop={prop} />,
            notToggle: (prop) => <NotToggleBtn prop={prop} />,
            fieldSelector: (prop) => <FieldSelector prop={prop} entity={entity} />,
          }}
        />
        <p className="h-75 ">{formatQuery(query, 'json_without_ids')}</p>
        <ModalFooter className="confirmation-modal-footer m-0 p-0">
          <button
            type="button"
            className="btn_Default m-2 sales-btn-style"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn_Default m-2 sales-btn-style"
            onClick={() => onSave()}
          >
            Save
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
export default BuilderModal;
