import React from "react";
import { links } from "../Header";
import {
  createStyles,
  Container,
  Group,
  Anchor,
  rem,
  Title,
  Text,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    margin: 0,
    maxWidth: "unset",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },

  title: {
    color:
      theme.colorScheme === "light"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
}));

export const Footer = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Title order={4} className={classes.title}>
          E Commerce Supplychain
        </Title>
        <Text>
          E-Commerece Supplychain @2023 All Right Reserved | Made With ❤️ By
          Rupen
        </Text>
      </Container>
    </div>
  );
};
