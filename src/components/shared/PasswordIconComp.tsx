import React from "react";
import CheckMark from "../Icons/CheckMark";
import StarIcon from "../Icons/StarIcon";

interface PasswordIconCompProps {
  condition: boolean;
}

const PasswordIconComp: React.FC<PasswordIconCompProps> = ({ condition }) => {
  return condition ? <CheckMark /> : <StarIcon />;
};

export default PasswordIconComp;
