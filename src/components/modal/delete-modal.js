import { useState } from "react";
import { ModalContainer } from "./modal-container";

export default function DeleteModal({ isOpenDeleteModal, setIsOpenDeleteModal, handleDeletedRow }) {
  return (
    <>
      <ModalContainer isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-5">Are you sure you want to delete?</h3>
        <div className="flex gap-2 justify-center mt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
            onClick={() => {
              setIsOpenDeleteModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
            onClick={handleDeletedRow}
          >
            Delete
          </button>
        </div>
      </ModalContainer>
    </>
  );
}
