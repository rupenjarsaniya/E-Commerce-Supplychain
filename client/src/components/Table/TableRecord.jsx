import React, { useCallback, useContext } from 'react';
import { createStyles, Table, Anchor, Text, Button } from '@mantine/core';
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

  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export const TableRecord = ({ data }) => {
  const { classes } = useStyles();

  const {
    role,
    customerContract,
    sellerContract,
    transporterContract,
    status,
  } = useContext(SupplyContext);

  const cancelOrder = useCallback(
    async (index) => {
      if (!customerContract) {
        return;
      }

      try {
        await customerContract.cancelOrder(index);
      } catch (error) {
        console.log(error);
      }
    },
    [customerContract]
  );

  const confirmOrder = useCallback(
    async (index) => {
      if (!sellerContract) {
        return;
      }

      try {
        const res = await sellerContract.getOrderByIndex(index);
        await sellerContract.confirmOrder(res);
      } catch (error) {
        console.log(error);
      }
    },
    [sellerContract]
  );

  const packagingOrder = useCallback(
    async (index) => {
      if (!sellerContract) {
        return;
      }

      try {
        const res = await sellerContract.getOrderByIndex(index);
        await sellerContract.packagingOrder(res);
      } catch (error) {
        console.log(error);
      }
    },
    [sellerContract]
  );

  const shippingOrder = useCallback(
    async (index) => {
      if (!transporterContract) {
        return;
      }

      try {
        const res = await transporterContract.getOrderByIndex(index);
        await transporterContract.shippingOrder(res);
      } catch (error) {
        console.log(error);
      }
    },
    [transporterContract]
  );

  const outForDeliveryOrder = useCallback(
    async (index) => {
      if (!transporterContract) {
        return;
      }

      try {
        const res = await transporterContract.getOrderByIndex(index);
        await transporterContract.outForDeliveryOrder(res);
      } catch (error) {
        console.log(error);
      }
    },
    [transporterContract]
  );

  const deliverdOrder = useCallback(
    async (index) => {
      if (!transporterContract) {
        return;
      }

      try {
        const res = await transporterContract.getOrderByIndex(index);
        await transporterContract.deliverdOrder(res);
      } catch (error) {
        console.log(error);
      }
    },
    [transporterContract]
  );

  const buttonComponent = useCallback(
    (status, index) => {
      if (role === 3) {
        return (
          <Button
            color="red"
            size="xs"
            compact
            uppercase
            disabled={status !== 'Placed'}
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
              disabled={status !== 'Placed'}
              onClick={() => confirmOrder(index)}
            >
              Confirm
            </Button>
            <Button
              color="indigo"
              size="xs"
              compact
              uppercase
              disabled={status !== 'Confirmed'}
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
              disabled={status !== 'Packaging'}
              onClick={() => shippingOrder(index)}
            >
              Shipping
            </Button>
            <Button
              color="grape"
              size="xs"
              compact
              uppercase
              disabled={status !== 'Shipping'}
              onClick={() => outForDeliveryOrder(index)}
            >
              Out for delivery
            </Button>
            <Button
              color="green"
              size="xs"
              compact
              uppercase
              disabled={status !== 'Out for Delivery'}
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
      <Table sx={{ minWidth: 1000 }} verticalSpacing="">
        <thead>
          <tr>
            <th>Index</th>
            <th>Order Address</th>
            <th>Actions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => {
            const url = `/history/${row}`;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <Anchor component="button" fz="sm">
                    <Link href={url}>{row}</Link>
                  </Anchor>
                </td>
                <td>
                  <div className={classes.buttonWrapper}>
                    {buttonComponent(status[index], index)}
                  </div>
                </td>
                <td>
                  <Text className={classes.status}>{status[index]}</Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
