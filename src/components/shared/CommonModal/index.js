import { Modal } from "antd";
import React, { Children } from "react";

const CommonModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  children,
  centered = true,
  title = "",
  closable = false,
  footer = null,
  forceRender,
  width,
  destroyOnClose = false,
  closeIcon = false,
  maskClosable,
}) => {
  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered={centered}
      closable={closable}
      footer={footer}
      className="common-modal"
      width={width}
      destroyOnClose={destroyOnClose}
      closeIcon={closeIcon}
      maskClosable={maskClosable}
      forceRender={forceRender}
    >
      {children}
    </Modal>
  );
};

export default CommonModal;
