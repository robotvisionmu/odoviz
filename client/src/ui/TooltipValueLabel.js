import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';

function TooltipValueLabel(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip PopperProps={{ popperRef }} open={open} enterTouchDelay={0} placement="bottom" title={value}>
      {children}
    </Tooltip>
  );
}

export default TooltipValueLabel;
