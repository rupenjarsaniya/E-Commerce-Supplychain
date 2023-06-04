export const orderDetail = {
  name: 'orderdetail',
  type: 'document',
  title: 'OrderDetail',
  fields: [
    {
      name: 'txHash',
      title: 'Transaction Hash',
      type: 'string',
    },
    {
      name: 'customerAddress',
      title: 'Customer Address',
      type: 'string',
    },
    {
      name: 'sellerAddress',
      title: 'Seller Address',
      type: 'string',
    },
    {
      name: 'transporterAddress',
      title: 'Transporter Address',
      type: 'string',
    },
    {
      name: 'toAddress',
      title: 'To (Order) Address',
      type: 'string',
    },
  ],
}
