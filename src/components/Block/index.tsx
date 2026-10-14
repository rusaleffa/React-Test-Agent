import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import React, { memo, MouseEventHandler, useCallback } from 'react'; // Удаляем React.useState
import { Typography } from 'src/shared/ui';

import { CollapseChevronIcon } from '../../icons';

interface IBlock {
  children?: React.ReactNode;
  title?: string;
  withHide?: boolean;
  open: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  onToggle: () => void;
  id?: string;
}
const BlockComponent = ({
  children,
  title,
  withHide = true,
  open,
  onClick,
  onToggle,
  id,
}: IBlock) => {
  const handleChange = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  return (
    <Wrapper
      id={id}
      onClick={onClick}>
      <Title>
        <div />
        <Typography
          variant={'title.large'}
          bold>
          {title}
        </Typography>
        {withHide ? (
          <SIconButton
            onClick={handleChange}
            sx={{
              marginRight: '6px',
            }}>
            <CollapseChevronIcon
              style={{
                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform .5s',
              }}
            />
          </SIconButton>
        ) : (
          <div />
        )}
      </Title>
      <Collapse
        sx={{ width: '100%' }}
        in={open}>
        {children}
      </Collapse>
    </Wrapper>
  );
};

export const Block = memo(BlockComponent);

const Wrapper = styled(Box)`
  border-radius: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  align-self: stretch;
`;

const Title = styled(Box)`
  background: #ffffff;
  border-radius: 100px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 15px 4px 4px;
`;

const SIconButton = styled(IconButton)`
  background: ${(p) => p.theme.palette.Accent.Primary};
  color: #fff;
  &:hover {
    color: ${(p) => p.theme.palette.Accent.Primary};
    background: ${(p) => p.theme.palette.colors.White};
  }
`;
