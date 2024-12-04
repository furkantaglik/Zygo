import { SyncLoader } from "react-spinners";

interface SpinnerProps {
  color?: "primary" | "secondary" | string;
  size?: number;
}

const Spinner = ({ color = "primary", size = 15 }: SpinnerProps) => {
  const getColor = () => {
    switch (color) {
      case "primary":
        return "#dc1155";
      case "secondary":
        return "#eeefe1";
      default:
        return color;
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <SyncLoader size={size} color={getColor()} />
    </div>
  );
};

export default Spinner;
