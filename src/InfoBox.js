import React from "react";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <div className="col-md-4 info-box-card">
      <div
        onClick={props.onClick}
        className={`card ${active && "infoBox--selected"} ${
          isRed && "infoBox--red"
        }`}
      >
        <div className="card-header">
          <h5 className="card-title">{title}</h5>
        </div>
        <div className="card-body">
          <h2
            className={`card-text infoBox__cases ${
              !isRed && "infoBox__cases--green"
            }`}
          >
            {cases}
          </h2>
          <p className="infoBox__total" color="textSecondary">
            {total} Total
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoBox;
