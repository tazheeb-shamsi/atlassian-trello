"use client";

import { FormEvent, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModelStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";

function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    //adding task
    addTask(newTaskInput, newTaskType, image);
    setImage(null);
    closeModal();
  };

  const [addTask, image, setImage, newTaskInput, setNewtaskInput,newTaskType] =
    useBoardStore((state) => [
      state.addTask,
      state.image,
      state.setImage,
      state.newTaskInput,
      state.setNewTaskInput,
      state.newTaskType
    ]);

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        onSubmit={handleSubmit}
        as="form"
        className="relative z-10"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className=" w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a new task
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter a task here..."
                    value={newTaskInput}
                    onChange={(e) => setNewtaskInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                <TaskTypeRadioGroup />

                <div>
                  <button
                    type="button"
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-ofset-2"
                    onClick={() => {
                      imagePickerRef.current?.click();
                    }}
                  >
                    <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    Uplo Image
                  </button>

                  {image && (
                    <Image
                      alt="added-image-preview"
                      width={200}
                      height={200}
                      className="w-full h-44  object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                      src={URL.createObjectURL(image)}
                      onClick={(e) => {
                        setImage(null);
                      }}
                    />
                  )}
                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      //check if the e is an image
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>
                <div className="mt-4 text-right">
                  <button
                    type="submit"
                    disabled={!newTaskInput}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 
                  focus:outline-none focus-visible:ring-2  focus-visible:ring-blue-500 focus-visible:ring-ofset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
                  "
                  >
                    Add task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
