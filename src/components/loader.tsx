import { ThreeDots } from "react-loader-spinner";

const Loader = ({ size = 60 }: { size?: number }) => (
  <ThreeDots
    visible={true}
    height={size}
    width={size}
    color="blue"
    radius="8"
    ariaLabel="three-dots-loading"
  />
);

export default Loader;
