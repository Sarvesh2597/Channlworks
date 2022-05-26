import React, { useEffect, useState } from "react";
import "../../../_metronic/_assets/sass/pages/error/error-3.scss";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import moment from "moment";
export function ProgramDefinition() {
  const [pageData, setPageData] = useState();
  const partnerId = JSON.parse(localStorage.getItem("user-details")).partnerId;
  const programId = useParams().programId;
  const associationId = useParams().accociationId;
  const programName = useParams().programName;

  useEffect(async () => {
    const res = await fetchJSON(
      BASE_URL +
        "/programdefinition/compliant/partner/" +
        partnerId +
        "/program/" +
        programId +
        "/association/" +
        associationId
    );
    if (res) {
      setPageData(res);
      // let data = levelingNodes(res.compliance_data.definition);
      // setTreeData(data)
    }
  }, []);
  let mainPadding = 40;

  const group = (groupData, padding) => {
    return (
      <React.Fragment>
        {groupData.map((e, index) => {
          return (
            <React.Fragment>
              <tr>
                <td style={{ paddingLeft: padding }} className={e.group ? "text-primary" : ""}>
                  {" "}
                  {e.group || index === 0 || e.option === "any" ? (
                    ""
                  ) : (
                    <span
                      className="label label-md label-light-info label-inline"
                      style={{
                        textTransform: "uppercase",
                        color:
                          e.option === "and"
                            ? "info"
                            : e.option === "or"
                            ? "red"
                            : "",
                      }}
                    >
                      {e.option}
                    </span>
                  )}{" "}
                  {e.name}{" "}
                  {e.group && e.option === "any" ? (
                    <span>(ANY {e.value} of the following)</span>
                  ) : (
                    ""
                  )}
                </td>
                <td
                  className="text-center"
                >
                  {e.value === true || ((e.reqType === 'program' || e.type === 'program') && !e.hasOwnProperty('value'))
                    ? "YES"
                    : e.group
                    ? e.option === "any"
                      ? e.value
                      : ""
                    : e.value === null
                    ? "NO"
                    : (!e.group && e.option) === "any"
                    ? e.value
                    : e.value
                    ? e.value
                    : "YES"}
                </td>
                <td
                  className={`text-center ${
                    e.status < e.value ||
                    (e.status === 0 &&
                      ((e.reqType && e.reqType !== "certification") ||
                        (e.type && e.type !== "certification"))) ||
                      e.status === false
                      ? "text-danger"
                      : ""
                  }`}
                >
                  {e.status === true ? (
                    "YES"
                  ) : e.status === null ? (
                    <span>{e.status < e.value ? (typeof e.value === 'number' && e.group.length === 0) ? "0 *" : "NO *" : ""}</span>
                  ) : e.group ? (
                    e.option === "any" ? (
                      e.status
                    ) : (
                      e.group.length === 0 && e.reqType === 'group' ? 'NO *' : ''
                    )
                  ) : (
                    <span>
                      {(e.status === 0 &&
                        ((e.reqType && e.reqType !== "certification") ||
                          (e.type && e.type !== "certification"))) ||
                      e.status === false
                        ? "NO"
                        : e.status}
                      {parseInt(e.status, 10) < e.value || e.status === 0
                        ? " *"
                        : ""}
                    </span>
                  )}
                </td>
              </tr>
              {e.group && e.group.length > 0
                ? group(e.group, padding + 40)
                : ""}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="d-flex flex-column flex-root container-box">
        <div className="d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat p-10 p-sm-30 ">
          <div className="d-flex justify-content-end mb-15 heading-height">
            <h4>Partner World Technologies</h4>
          </div>
          <div className="d-flex justify-content-between mb-15">
            <div style={{ width: "80%" }}>
              <h4 className="text-primary">PROGRAM</h4>
              <h3>
                {programName} {/* <br></br> Desktop{" "}                 */}
              </h3>
              <p>
                {pageData && pageData.Program
                  ? pageData.Program.programDetails
                  : ""}
              </p>
            </div>
            <div>
              <h4 className="text-primary">CURRENT STATUS</h4>
              {pageData && pageData.is_compliant ? (
                <p className="text-success">COMPLIANT</p>
              ) : (
                <p className="text-danger">NOT COMPLIANT</p>
              )}
            </div>
          </div>
          <h6 className="text-primary mb-7">PROGRAM REQUIREMENTS</h6>
          <Table bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-center">Required</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageData &&
              pageData.compliance_data &&
              pageData.compliance_data.definition ? (
                pageData.compliance_data.definition.map((item) => {

                  return (
                    <React.Fragment>
                      <tr>
                        <td className={item.group ? "text-primary" : ""}>
                          {item.name}
                        </td>
                        <td className={`text-center`}>
                          {item.value && !item.group ? item.value : item.value}
                          {item.value === true  || ((item.reqType === 'program' || item.type === 'program') && !item.hasOwnProperty('value'))  ? "YES" : ""}
                          {item.value === false ? "NO" : ""}
                        </td>
                        <td
                          className={`text-center ${ 
                            (item.status !== item.value && item.status <= item.value) || ((item.reqType === 'program' || item.type === 'program') && !item.hasOwnProperty('value')) || item.value && !item.hasOwnProperty('status')? "text-danger"  : ""
                          }`}
                        >
                          {item.status === true ? "Yes" : ""}
                          {item.status === false
                            ? item.status !== item.value
                              ? "NO *"
                              : "NO "
                            : ""}
                          {item.status || (item.status === 0 && ((item.reqType !== 'program' || item.type !== 'program') && item.hasOwnProperty('value')))  ? item.status < item.value ? item.status + '*': item.status  : ""}
                          {item.status === null ? (typeof item.value === 'number' && item.group.length === 0) ?  '0 *' : "NO *" : item.value && !item.hasOwnProperty('status') || ((item.reqType === 'program' || item.type === 'program') && !item.hasOwnProperty('value')) ? 'NO *' : ''}
                        </td>
                      </tr>
                      {item.group ? group(item.group, mainPadding) : ""}
                    </React.Fragment>
                  );
                })
              ) : (
                <span className="text-center">Compliance Data Not Found</span>
              )}
            </tbody>
          </Table>
          <p className="mt-3">
            {" "}
            Note: (*) Asterisk marked represents Requirement not met
          </p>
          <div className="d-flex justify-content-between mt-6">
            <p>Powered by ChannlWorks</p>
            <p>
              Last Updated On -{" "}
              {pageData ? moment(pageData.updatedAt).format("DD-MM-YYYY") : ""}
            </p>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-info"
              id="printPageButton"
              onClick={(e) => window.print()}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
