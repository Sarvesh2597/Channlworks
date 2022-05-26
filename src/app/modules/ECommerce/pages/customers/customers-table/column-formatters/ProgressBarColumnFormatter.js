// please be familiar with react-bootstrap-table-next column formaters
// https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Columns&selectedStory=Column%20Formatter&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
//import SVG from "react-inlinesvg";
// /import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import {ProgressBar} from "react-bootstrap";

export function ProgressBarColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openEditCustomerDialog, openDeleteCustomerDialog }
) {
    const now = row.declaration.completed/row.declaration.total * 100;

    // console.log(row.declaration);

    const label = `${row.declaration.completed}/${row.declaration.total}`

    const progressInstance = <ProgressBar className="mr-10" now={now} variant="info" label={`${label}`} />;


    
    return(progressInstance);
}
