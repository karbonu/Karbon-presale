import React from "react";
import CheckMark from "../Icons/CheckMark.tsx";
import StarIcon from "../Icons/StarIcon.tsx";

interface PasswordIconCompProps {
  condition: boolean;
}

const PasswordIconComp: React.FC<PasswordIconCompProps> = ({ condition }) => {
  return condition ? <CheckMark /> : <StarIcon />;
};

export default PasswordIconComp;
