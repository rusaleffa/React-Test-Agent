import styled from '@emotion/styled';
import { IconButton, IconButtonProps } from '@mui/material';
import * as React from 'react';

import { HideArrowIcon } from '../../icons';

interface IArrowSwitchProps extends IconButtonProps {
  checked: boolean;
}
export const ArrowSwitch = (props: IArrowSwitchProps) => {
  return (
    <SIconButton {...props}>
      <HideArrowIcon />
    </SIconButton>
  );
};
const SIconButton = styled(IconButton)<IArrowSwitchProps>`
  border-radius: 100px;
  background: #0f74ff !important;
  display: flex;
  align-items: center;
  width: 48px;
  height: 32px;
  padding: 0;
  & svg {
    transition: transform 0.3s ease-in-out;

    transform: ${(p) => (p.checked ? 'rotate(0deg)' : 'rotate(180deg)')};
  }
`;
