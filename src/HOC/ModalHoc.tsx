import React from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../redux/configStore";

type Props = {};

export default function ModalHOC({}: Props) {
  const { bodyComponent, open, title } = useSelector(
    (state: RootState) => state.modalReducer
  );

  return (
    <Modal show={open} size="lg" className="modal-dialog-scrollable">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyComponent}</Modal.Body>
    </Modal>
  );
}
