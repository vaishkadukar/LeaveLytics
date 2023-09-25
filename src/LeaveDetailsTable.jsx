import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./LeaveDetails.css";
import { Tooltip } from "@mui/material";

const LeaveDetailsTable = (props) => {
  const receivedData = props.data;
  const columns = [
    { field: "EMP_NAME", headerName: "Name", width: 280 },
    { field: "TYPE", headerName: "Type", width: 120 },
    { field: "ONSITE_OFFSHORE", headerName: "Location", width: 120 },
    {
      field: "EMP_CONTACT",
      headerName: "Contact",
      width: 300,

      renderCell: (parameters) => {
        const objectData = parameters.value;
        const formattedData1 = `${objectData.phone}`;
        const formattedData2 = `${objectData.mail}`;

        return (
          <div className="cell_inside">
            <span>{formattedData1 === "undefined" ? "" : formattedData1}</span>
            <span>
              <CellWithTooltip
                value={formattedData2 === "undefined" ? "" : formattedData2}
              />
            </span>
          </div>
        );
      },
    },
    {
      field: "REPL",
      headerName: "Replacement",
      width: 300,
      renderCell: (parameters) => {
        const objectData = parameters.value;
        const formattedData1 = `${objectData.name}`;
        const formattedData2 = `${objectData.contact}`;

        return (
          <div className="cell_inside">
            <span>{formattedData1 === "undefined" ? "" : formattedData1}</span>
            <span>
              <CellWithTooltip
                value={formattedData2 === "undefined" ? "" : formattedData2}
              />
            </span>
          </div>
        );
      },
    },
    {
      field: "REPL_CONTACT",
      headerName: "Replacement Contact",
      width: 180,

      renderCell: (parameters) => {
        const objectData = parameters.value;
        const formattedData1 = `${objectData.rphoneno}`;

        return (
          <div className="cell_inside">
            <span>{formattedData1}</span>
          </div>
        );
      },
    },
  ];

  const CellWithTooltip = ({ value }) => (
    <Tooltip title={value}>
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {value}
      </div>
    </Tooltip>
  );

  return (
    <div className="table">
      <DataGrid
        rows={receivedData}
        columns={columns}
        pageSize={5}
      />
    </div>
  );
};

export default LeaveDetailsTable;
