import React, { useCallback, useContext, useMemo } from 'react';
import {
  createStyles,
  Table,
  Anchor,
  Text,
  ScrollArea,
  Button,
} from '@mantine/core';
import Link from 'next/link';
import { SupplyContext } from '@/contexts/SupplyContext';

const useStyles = createStyles(() => ({
  wrap: {
    minWidth: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
}));

export const getStatus = (status) => {
  switch (status) {
    case 0:
      return 'Placed';

    case 1:
      return 'Confirmed';

    case 2:
      return 'Packaging';

    case 3:
      return 'Shipping';

    case 4:
      return 'Out for Delivery';

    case 5:
      return 'Delivered';

    case 6:
      return 'Cancel';

    default:
      break;
  }
};

export const TableRecord = ({ data }) => {
  const { classes } = useStyles();
  const { role, customerContract, sellerContract, transporterContract } =
    useContext(SupplyContext);

  const cancelOrder = useCallback(async (index) => {
    if (!customerContract) {
      return;
    }

    try {
      await customerContract.cancelOrder(index);
    } catch (error) {
      console.log(error);
    }
  });

  const confirmOrder = useCallback(async (index) => {
    if (!sellerContract) {
      return;
    }

    try {
      const res = await sellerContract.getOrderByIndex(index);
      await sellerContract.confirmOrder(res);
    } catch (error) {
      console.log(error);
    }
  });

  const packagingOrder = useCallback(async (index) => {
    if (!sellerContract) {
      return;
    }

    try {
      const res = await sellerContract.getOrderByIndex(index);
      await sellerContract.packagingOrder(res);
    } catch (error) {
      console.log(error);
    }
  });

  const shippingOrder = useCallback(async (index) => {
    if (!transporterContract) {
      return;
    }

    try {
      const res = await transporterContract.getOrderByIndex(index);
      await transporterContract.shippingOrder(res);
    } catch (error) {
      console.log(error);
    }
  });

  const outForDeliveryOrder = useCallback(async (index) => {
    if (!transporterContract) {
      return;
    }

    try {
      const res = await transporterContract.getOrderByIndex(index);
      await transporterContract.outForDeliveryOrder(res);
    } catch (error) {
      console.log(error);
    }
  });

  const deliverdOrder = useCallback(async (index) => {
    if (!transporterContract) {
      return;
    }

    try {
      const res = await transporterContract.getOrderByIndex(index);
      await transporterContract.deliverdOrder(res);
    } catch (error) {
      console.log(error);
    }
  });

  const buttonComponent = useCallback(
    (status, index) => {
      if (role === 3) {
        return (
          <Button
            color="red"
            size="xs"
            compact
            uppercase
            disabled={status !== 0}
            onClick={() => {
              cancelOrder(index);
            }}
          >
            Cancel
          </Button>
        );
      }
      if (role === 1) {
        return (
          <>
            <Button
              color="orange"
              size="xs"
              compact
              uppercase
              disabled={status !== 0}
              onClick={() => confirmOrder(index)}
            >
              Confirm
            </Button>
            <Button
              color="indigo"
              size="xs"
              compact
              uppercase
              disabled={status !== 1}
              onClick={() => packagingOrder(index)}
            >
              Packaging
            </Button>
          </>
        );
      }
      if (role === 2) {
        return (
          <>
            <Button
              color="yellow"
              size="xs"
              compact
              uppercase
              disabled={status !== 2}
              onClick={() => shippingOrder(index)}
            >
              Shipping
            </Button>
            <Button
              color="grape"
              size="xs"
              compact
              uppercase
              disabled={status !== 3}
              onClick={() => outForDeliveryOrder(index)}
            >
              Out for delivery
            </Button>
            <Button
              color="green"
              size="xs"
              compact
              uppercase
              disabled={status !== 4}
              onClick={() => deliverdOrder(index)}
            >
              Delivered
            </Button>
          </>
        );
      }
    },
    [
      data,
      cancelOrder,
      confirmOrder,
      packagingOrder,
      shippingOrder,
      outForDeliveryOrder,
      deliverdOrder,
    ]
  );

  return (
    <div className={classes.wrap}>
      <ScrollArea>
        <Table sx={{ minWidth: 1000 }} verticalSpacing="">
          <thead>
            <tr>
              <th>Index</th>
              <th>Transaction Hash</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.length > 0 &&
              data?.map((row, index) => {
                console.log(row.txHash);
                const url = `/history/${row.orderAddress}`;
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Anchor component="button" fz="sm">
                        <Link href={url}>{row.txHash}</Link>
                      </Anchor>
                    </td>
                    <td>
                      <div className={classes.buttonWrapper}>
                        {buttonComponent(row.status, index)}
                      </div>
                    </td>
                    <td>
                      <Text className={classes.status}>
                        {getStatus(row.status)}
                      </Text>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
