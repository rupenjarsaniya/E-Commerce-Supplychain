import { Anchor, Divider, Title, createStyles } from "@mantine/core";
import { IconCopy, IconCurrencyEthereum } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";

const useStyles = createStyles((theme) => ({
  main: {
    maxWidth: 1000,
    margin: "auto",
    minHeight: `calc(100vh - 118px)`,
    display: "flex",
    flexDirection: "column",
    marginBlock: theme.spacing.md,
  },

  infoWrapper: {
    display: "flex",
    flexDirection: "column",
  },

  info: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  box: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  itemWrapper: {
    display: "flex",
    alignItems: "center",
  },

  data: {
    flex: 4,
  },

  title: {
    flex: 1,
  },

  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
}));

export default function History() {
  const router = useRouter();

  const { address } = router.query;
  const { classes } = useStyles();

  const handleCopy = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(error);
    }
  };

  const TableRow = ({ header, data }) => {
    return (
      <div className={classes.itemWrapper}>
        <div className={classes.title}>{header}</div>
        <div className={classes.data}>{data}</div>
      </div>
    );
  };

  const rows = [
    {
      header: "Transaction Hash:",
      data: "0x22832e547f89d1bc09b3447b03ac91ef5510becbc8f256c88dc06643b2df7798",
    },
    {
      header: "Order Address:",
      data: address,
    },
    { header: "Order ID:", data: "1" },
    { header: "Status:", data: "Delivered" },
    { header: "Timestamp:", data: "new Date().toISOString()", divider: true },
    {
      header: "From:",
      data: (
        <div className={classes.wrapper}>
          <Anchor component="button">
            0x8dC847Af872947Ac18d5d63fA646EB65d4D99560
          </Anchor>
          <IconCopy
            style={{ cursor: "pointer" }}
            size={20}
            onClick={() =>
              handleCopy("0x8dC847Af872947Ac18d5d63fA646EB65d4D99560")
            }
          />
        </div>
      ),
    },
    {
      header: "To:",
      data: (
        <div className={classes.wrapper}>
          <Anchor component="button">
            0x8dC847Af872947Ac18d5d63fA646EB65d4D99560
          </Anchor>
          <IconCopy
            style={{ cursor: "pointer" }}
            size={20}
            onClick={() =>
              handleCopy("0x8dC847Af872947Ac18d5d63fA646EB65d4D99560")
            }
          />
        </div>
      ),
      divider: true,
    },
    { header: "Location:", data: "Ahmedabad" },
    { header: "Quantity:", data: "1" },
    { header: "Items:", data: "items" },
    {
      header: "Amount:",
      data: (
        <div className={classes.wrapper}>
          <IconCurrencyEthereum size={20} />
          100 ETH
        </div>
      ),
    },
  ];

  return (
    <div className={classes.main}>
      <Title order={4}>Order Details</Title>
      <Divider my="sm" />

      <div className={classes.box}>
        {rows.map((item) => {
          return (
            <>
              <TableRow header={item.header} data={item.data} />
              {item.divider && <Divider my="sm" />}
            </>
          );
        })}
      </div>
    </div>
  );
}
