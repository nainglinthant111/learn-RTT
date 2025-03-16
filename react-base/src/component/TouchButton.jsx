import { Children } from "react";

function TouchButton({onpass,children}) {
  return (
    <button onClick={()=>onpass(children)}>{children}</button>
  );
}

export default TouchButton;