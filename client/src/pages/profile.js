import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Container,
  Grid,
  Select,
  Text,
  TextInput,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { IconEdit, IconEditCircle, IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import React, { useState } from "react";
const useStyles = createStyles((theme) => ({
  main: {
    maxWidth: 1000,
    margin: "auto",
    minHeight: "67vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  wrap: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    margin: theme.spacing.md,
    gap: 50,
    [theme.fn.smallerThan("xs")]: {
      marginInline: 0,
      flexDirection: "column",
      alignItems: "center",
    },
  },

  profileInfoWrapper: {},

  avatarWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    cursor: "pointer",
  },
}));

function NameFocus() {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState("");

  return (
    <TextInput
      label="Name"
      required
      placeholder="Enter You Name"
      onFocus={() => setOpened(true)}
      onBlur={() => setOpened(false)}
      mt="md"
      sx={{ minWidth: 350 }}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      rightSection={
        <ActionIcon variant="transparent">
          {true ? <IconEdit size={20} /> : <IconUpload size={20} />}
        </ActionIcon>
      }
    />
  );
}
function LocationFocus() {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState("");

  return (
    <TextInput
      mt="md"
      label="Location"
      required
      placeholder="Enter Location"
      onFocus={() => setOpened(true)}
      onBlur={() => setOpened(false)}
      sx={{ minWidth: 350 }}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      rightSection={
        <ActionIcon variant="transparent">
          {true ? <IconEdit size={20} /> : <IconUpload size={20} />}
        </ActionIcon>
      }
    />
  );
}
function RoleFocus() {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Select
      mt="md"
      label="Your favorite framework/library"
      required
      placeholder="Select a Role"
      onFocus={() => setOpened(true)}
      onBlur={() => setOpened(false)}
      data={[
        { value: "0", label: "No Role" },
        { value: "1", label: "Seller" },
        { value: "2", label: "Transporter" },
        { value: "3", label: "Customer" },
        { value: "4", label: "Revoke" },
      ]}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      rightSection={
        <ActionIcon variant="transparent">
          {true ? <IconEdit size={20} /> : <IconUpload size={20} />}
        </ActionIcon>
      }
    />
  );
}

export default function Profile() {
  const { classes } = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.wrap}>
        <div className={classes.avatarWrapper}>
          <Avatar
            src={"https://randomuser.me/api/portraits/men/4.jpg"}
            alt={"user.name"}
            radius="xl"
            size={200}
          />
        </div>
        <div className={classes.profileInfoWrapper}>
          <NameFocus />
          <LocationFocus />
          <RoleFocus />
          <Button variant="light" mt="md" color="red">
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
