import React from "react";
import { createStyles, Container, rem, Text } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    margin: 0,
    maxWidth: "unset",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },
}));

export const Footer = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Text fz="xs">@2023 All Right Reserved</Text>
      </Container>
    </div>
  );
};
