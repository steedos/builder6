import "@salesforce-ux/design-system/css/icons/base/index.css";

import React from 'react';

const Icon = ({ name='lead', type="standard", className="", ...props }) => {
  const svgPath = `/icons/${type}-sprite/svg/symbols.svg#${name}`;
  const cssName = name.replace(/_/g, "-");
  return (
    <span className={`slds-icon_container slds-icon-${type}-${cssName}`}>
      <svg {...props} aria-hidden="true" className={`slds-icon ${className}`}>
        <use xlinkHref={svgPath}></use>
      </svg>
    </span>
  );
};

export default Icon;
