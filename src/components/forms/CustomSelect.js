import React, { useId } from "react";
import Select from "react-select";
import { Label } from "@/components/ui/label";

const SelectDropdown = ({ label = "", options = [], onChange, placeholder = "Select...", isMulti = false, styles = {}, isDisabled = false }) => {
  const id = useId();

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        className="mt-3"
        id={id}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        isMulti={isMulti}
        styles={styles}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default SelectDropdown;
