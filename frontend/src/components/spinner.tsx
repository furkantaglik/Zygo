import { SyncLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <SyncLoader color="#26baa1" />
    </div>
  );
};

export default Spinner;
