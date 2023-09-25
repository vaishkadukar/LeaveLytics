import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as xlsx from "xlsx";

const UploadFile = () => {
  const navigate = useNavigate();
  const readExcel = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer(file);
    const excelfile = xlsx.read(data);
    navigate("/Home", { state: { excelfile } });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <h1 style={{marginRight: "120px"}}>Upload file</h1>
        <input type="file" onChange={(e) => readExcel(e)} />
      </div>
    </>
  );
};

export default UploadFile;
