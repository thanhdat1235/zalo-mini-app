import React, { FC, MouseEventHandler, ReactNode } from "react";
import { TouchOpacity } from "zalo-ui";
import { Icon, Text } from "zmp-ui";

export interface ListItemProps {
  title: ReactNode;
  subtitle: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const ListItem: FC<ListItemProps> = ({ title, subtitle, onClick }) => {
  return (
    <TouchOpacity className="flex space-x-2" onClick={onClick}>
      <div className="flex-1 space-y-[2px]">
        <Text size="small" className="font-medium text-sm text-primary">
          {title}
        </Text>
        <Text size="xSmall" className="text-gray">
          {subtitle}
        </Text>
      </div>
      <Icon icon="zi-chevron-right" />
    </TouchOpacity>
  );
};
