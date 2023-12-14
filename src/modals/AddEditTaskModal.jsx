import React, { useState } from "react";
import { v4, validate } from "uuid";
import corssIcon from "../assets/icon-cross.svg";
import { useDispatch, useSelector } from "react-redux";
import boardSlice from "../redux/boardsSlice";

const AddEditTaskModal = ({
  type,
  device,
  setOpenAddEditTask,
  taskIndex,
  prevColIndex = 0,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isValid, setIsValid] = useState(false);
  const boards = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );
  const dispatch = useDispatch();

  const columns = boards.columns;
  const col = columns.find((col, index) => index === prevColIndex);
  const [status, setStatus] = useState(columns[prevColIndex].name);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);

  const [subtask, setSubtask] = useState([
    { title: "", isCompleted: false, id: v4() },
    { title: "", isCompleted: false, id: v4() },
  ]);

  const handleChange = (id, newValue) => {
    setSubtask((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = newValue;

      return newState;
    });
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onDelete = (id) => {
    setSubtask((prevState) => prevState.filter((el) => el.id !== id));
  };

  const validate = () => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }

    for (let i = 0; i < subtask.length; i++) {
      if (!subtask[i].title.trim()) {
        return false;
      }
    }

    setIsValid(true);
    return true;
  };

  const onSubmit = (type) => {
    if (type === "add") {
      dispatch(
        boardSlice.actions.addBoard({
          title,
          description,
          subtask,
          status,
          newColIndex,
        })
      );
    } else {
      dispatch(
        boardSlice.actions.editBoard({
          title,
          description,
          subtask,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        })
      );
    }
  };

  return (
    <div
      className={
        device === "mobile"
          ? "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 bg-[#00000080]"
          : "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 bg-[#00000080]"
      }
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenAddEditTask(false);
      }}
    >
      {/* modal section */}
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto px-8 py-8 rounded-xl">
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Task</h3>

        {/* Task name */}
        <div className="mt-8 flex flex-col space-y-1">
          <label htmlFor="" className="text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7] ring-0"
            placeholder="e.g Take coffee baeak"
          />
        </div>

        {/* description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label htmlFor="" className="text-sm dark:text-white text-gray-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>

        {/* subtasks section */}
        <div className="mt-8 flex flex-col space-y-1">
          <label htmlFor="" className="text-sm dark:text-white text-gray-500">
            Subtasks
          </label>
          {subtask.map((task, index) => {
            return (
              <div key={index} className="flex items-center w-full">
                <input
                  type="text"
                  value={subtask.title}
                  className="bg-transparent outline-none focus:border-0 border flex-grow px-4 py-2 rounded-md text-sm border-gray-600 focus:outline-[#635fc7]"
                  placeholder="e.g Task conference"
                  onChange={(e) => {
                    handleChange(subtask.id, e.target.value);
                  }}
                />
                <img
                  src={corssIcon}
                  alt=""
                  className="m-4 cursor-pointer"
                  onClick={() => {
                    onDelete(task.id);
                  }}
                />
              </div>
            );
          })}

          <button
            onClick={() => {
              setSubtask((state) => [
                ...state,
                { title: "", isCompleted: false, id: v4() },
              ]);
            }}
            className="w-full items-center dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 rounded-full"
          >
            + Add New Subtask
          </button>
        </div>

        {/* current status section */}

        <div className="mt-8 flex flex-col space-y-3">
          <label htmlFor="" className="text-sm dark:text-white text-gray-500">
            Current status
          </label>
          <select
            value={status}
            onChange={onChangeStatus}
            className="select-status flex flex-grow px-4 py-2 rounded-md text-sm bg-transparent dark:bg-black focus:border-0 border border-gray-300 focus:outline-[#635fc7] outline-none"
          >
            {columns.map((column, index) => (
              <option value={column.name} key={index}>
                {column.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                setOpenAddEditTask(false);
              }
            }}
            className="w-full items-center text-white bg-[#635fc7] py-2 rounded-full"
          >
            {type === "edit" ? "Save Edit" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
