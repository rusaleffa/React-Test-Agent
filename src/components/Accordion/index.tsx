import styled from '@emotion/styled';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import React from 'react';
import { IGetRolesItem } from 'src/shared/store/api/users/users.types';

import { AngleIcon } from '../../icons';
import { Checkbox } from '../base/CheckBox';
import { Typography } from '../base/Typography';

interface IAccordionProps {
  title: string;
  disabled: boolean;
  data: IGetRolesItem[];
  checkedList: string[];
}
export const Accordion = ({
  title,
  disabled,
  data,
  checkedList,
}: IAccordionProps) => {
  return (
    <Wrapper>
      <MuiAccordion>
        <AccordionSummary
          expandIcon={<AngleIcon />}
          aria-controls='panel2-content'
          id='panel2-header'>
          <HeadWrapper>
            <Typography
              variant={'title.medium'}
              bold>
              {title}
            </Typography>
          </HeadWrapper>
        </AccordionSummary>
        <AccordionDetails>
          {data.map((el) => {
            const isChecked = checkedList.includes(el.name);
            return (
              <Checkbox
                key={el.name}
                checkboxProps={{
                  disabled,
                  checked: isChecked,
                  sx: {
                    '&.Mui-disabled': {
                      color: isChecked ? '#0F74FF' : undefined,
                      opacity: isChecked ? 1 : undefined,
                    },
                  },
                }}
                label={el.info}
              />
            );
          })}
        </AccordionDetails>
      </MuiAccordion>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const AccordionSummary = styled(MuiAccordionSummary)`
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded' {
    gap: 4px;
  }
  flex-direction: row-reverse;
`;

const HeadWrapper = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  max-height: 24px;
`;
