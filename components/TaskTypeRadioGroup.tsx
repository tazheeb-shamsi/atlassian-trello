"use client";

import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const types = [
  {
    id: "Todo",
    name: "Todo",
    description: " A new task to be completed",
    color: "bg-red-500",
  },
  {
    id: "Onhold",
    name: "On Hold",
    description: " A task to be on hold",
    color: "bg-orange-500",
  },
  {
    id: "Inprogress",
    name: "In Progress",
    description: " A task to be in progress",
    color: "bg-blue-500",
  },
  {
    id: "Done",
    name: "Done",
    description: " A task that has been completed",
    color: "bg-green-500",
  },
];
const TaskTypeRadioGroup = () => {
  const [newTaskType, setNewTaskType] = useBoardStore((state) => [
    state.newTaskType,
    state.setNewTaskType,
  ]);
  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup
          value={newTaskType}
          onChange={(e) => {
            setNewTaskType(e);
          }}
        >
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-200"
                      : ""
                  }
                  ${
                    checked
                      ? `${type.color} bg-opacity-75 text-white`
                      : "bg-white"
                  }
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className=" flex items-center w-full justify-between">
                      <div className="flex items-center ">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-white" : "text-gray-500"
                            }`}
                          >
                            <span>{type.description}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>

                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckCircleIcon className="h-6 w-6"/>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default TaskTypeRadioGroup;
