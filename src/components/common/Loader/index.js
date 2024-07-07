import React from "react";
import "./styles.css"
function Loader() {
  return (
    <div className="wrapper">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
