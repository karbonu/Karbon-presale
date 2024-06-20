import React from "react";
import { StarIcon } from "lucide-react";
import CheckMark from "../Icons/CheckMark";

interface PasswordIconCompProps {
  condition: boolean;
}

const PasswordIconComp: React.FC<PasswordIconCompProps> = ({ condition }) => {
  return condition ? <CheckMark /> : <StarIcon />;
};

export default PasswordIconComp;
