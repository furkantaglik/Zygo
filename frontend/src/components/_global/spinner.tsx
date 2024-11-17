import { SyncLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <SyncLoader color="#dc1155" />
    </div>
  );
};

export default Spinner;
