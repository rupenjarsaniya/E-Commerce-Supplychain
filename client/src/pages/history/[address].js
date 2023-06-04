import { getStatus } from '@/components/Table';
import { SupplyContext } from '@/contexts/SupplyContext';
import { getContract } from '@/helper/fetchContracts';
import { client } from '@/helper/sanityClient';
import { OrderABI } from '@/utils/const';
import { Anchor, Divider, Title, createStyles } from '@mantine/core';
import { IconCopy, IconCurrencyEthereum } from '@tabler/icons-react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

export default function History({ transaction }) {
  const router = useRouter();

  const { address } = router.query;
  const { classes } = useStyles();
  const { appStatus, connectedAccount, metamask } = useContext(SupplyContext);
  const [data, setData] = useState({});

  const handleCopy = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(error);
    }
  };

  const orderContract = useCallback(async () => {
    if (!metamask) {
      return;
    }
    const contract = await getContract(metamask, address, OrderABI);

    const orderDetail = await contract.getOrderDetail(
      transaction.customerAddress
    );
    setData(orderDetail);
  }, [metamask, address, transaction]);

  useEffect(() => {
    if (appStatus === 'connected') {
      orderContract();
    }
  }, [orderContract, appStatus]);

  return (
    <div className={classes.main}>
      <Title order={4}>Order Details</Title>
      <Divider my="sm" />
      <div className={classes.box}>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Transaction Hash:</div>
          <div className={classes.data}>{transaction?.txHash}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Order Address:</div>
          <div className={classes.data}>
            <Anchor component="button">{address}</Anchor>
          </div>
        </div>
        <Divider my="sm" />
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Order ID:</div>
          <div className={classes.data}>
            {Number(data?._orderId).toString()}
          </div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Status:</div>
          <div className={classes.data}>{getStatus(data?._status)}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Timestamp:</div>
          <div className={classes.data}>{transaction?._createdAt}</div>
        </div>
        <Divider my="sm" />
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Seller Address:</div>
          <div className={classes.data}>{data?._seller_ethAddress}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Transporter Address:</div>
          <div className={classes.data}>{data?._transporter_ethAddress}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>From:</div>
          <div className={classes.data}>
            <div className={classes.wrapper}>
              <Anchor component="button">{transaction?.customerAddress}</Anchor>
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
          <div className={classes.data}>{data?._location}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Quantity:</div>
          <div className={classes.data}>
            {Number(data?._quantity).toString()}
          </div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Items:</div>
          <div className={classes.data}>{data?._items}</div>
        </div>
        <div className={classes.itemWrapper}>
          <div className={classes.title}>Amount:</div>
          <div className={classes.data}>
            <div className={classes.wrapper}>
              <IconCurrencyEthereum size={20} />
              {Number(data?._amount).toString()} ETH
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps = async (context) => {
  const query = `*[_type == 'orderdetail' && toAddress == "${context.query.address}"]`;
  const hash = await client.fetch(query);

  return { props: { transaction: hash[0] } };
};
