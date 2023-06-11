import { SupplyContext } from '@/contexts/SupplyContext';
import { getContract } from '@/helper/fetchContracts';
import { OrderABI } from '@/utils/const';
import { Anchor, Divider, Title, createStyles } from '@mantine/core';
import { IconCopy, IconCurrencyEthereum } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  main: {
    maxWidth: 1000,
    margin: 'auto',
    minHeight: `calc(100vh - 118px)`,
    display: 'flex',
    flexDirection: 'column',
    marginBlock: theme.spacing.md,
  },

  infoWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },

  info: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },

  box: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  itemWrapper: {
    display: 'flex',
    alignItems: 'center',
  },

  data: {
    flex: 4,
  },

  title: {
    flex: 1,
  },

  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
}));

export default function History() {
  const { classes } = useStyles();
  const { connectedAccount, metamask, customerContract } =
    useContext(SupplyContext);
  const router = useRouter();
  const { address } = router.query;
  const [orderData, setOrderData] = useState(null);

  const handleCopy = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      if (address) {
        const contract = await getContract(metamask, address, OrderABI);
        const orderDetail = await contract.getOrderDetail();
        console.log(orderDetail);
        setOrderData(orderDetail);
      }
    } catch (error) {
      console.log(error);
    }
  }, [metamask, address, customerContract]);

  useEffect(() => {
    if (!orderData) {
      fetchData();
    }
  }, [fetchData]);

  return (
    <div className={classes.main}>
      <Title order={4}>Order Details</Title>
      <Divider my="sm" />
      <div className={classes.box}>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Order Address:</div>
          <div className={classes.data}>
            <Anchor component="button">{address}</Anchor>
          </div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Order ID:</div>
          <div className={classes.data}>
            {Number(orderData?._orderId).toString()}
          </div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Status:</div>
          <div className={classes.data}>{orderData?._status}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Timestamp:</div>
          <div className={classes.data}>{'transaction?._createdAt'}</div>
        </div>
        <Divider my="sm" />
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Seller Address:</div>
          <div className={classes.data}>{orderData?._seller_ethAddress}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Transporter Address:</div>
          <div className={classes.data}>
            {orderData?._transporter_ethAddress}
          </div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>From:</div>
          <div className={classes.data}>
            <div className={classes.wrapper}>
              <Anchor component="button">
                {orderData?._customer_ethAddress}
              </Anchor>
              <IconCopy
                style={{ cursor: 'pointer' }}
                size={20}
                onClick={() => handleCopy(connectedAccount)}
              />
            </div>
          </div>
        </div>
        <Divider my="sm" />
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Location:</div>
          <div className={classes.data}>{orderData?._location}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Quantity:</div>
          <div className={classes.data}>
            {Number(orderData?._quantity).toString()}
          </div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Items:</div>
          <div className={classes.data}>{orderData?._items}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Amount:</div>
          <div className={classes.data}>
            <div className={classes.wrapper}>
              <IconCurrencyEthereum size={20} />
              {Number(orderData?._amount).toString()} ETH
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
