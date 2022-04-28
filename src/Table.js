import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="card mb-20 ">
      <div className="card-header">
        <h5>Live Cases by Country</h5>
      </div>
      <div className="card-body">
        <div className="table">
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Cases</th>
              </tr>
            </thead>
            <tbody>
              {countries.map(({ country, cases, i }) => (
                <tr key={i}>
                  <td>{country}</td>
                  <td>
                    <strong>{numeral(cases).format("0,0")}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
