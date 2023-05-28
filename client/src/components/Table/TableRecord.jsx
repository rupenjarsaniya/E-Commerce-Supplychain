import React from "react";
import {
  createStyles,
  Table,
  Progress,
  Anchor,
  Text,
  Group,
  ScrollArea,
  rem,
} from "@mantine/core";
import { data } from "./data";

const useStyles = createStyles((theme) => ({
  wrap: {
    minWidth: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
}));

export const TableRecord = () => {
  const { classes, theme } = useStyles();

  const rows = data.map((row, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <Anchor component="button" fz="sm">
            {row.orderAddress}
          </Anchor>
        </td>
        <td>
          <div className={classes.buttonWrapper}>{row.actions}</div>
        </td>
        <td>
          <Text className={classes.status}>{row.status}</Text>
        </td>
      </tr>
    );
  });

  return (
    <div className={classes.wrap}>
      <ScrollArea>
        <Table sx={{ minWidth: 1000 }} verticalSpacing="">
          <thead>
            <tr>
              <th>Index</th>
              <th>Order Address</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
