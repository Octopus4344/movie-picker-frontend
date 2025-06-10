import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
    </div>
  );
};

export default Spinner;
