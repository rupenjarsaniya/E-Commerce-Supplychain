const { expect } = require("chai");

describe("Order Contract", () => {
  let admin, order, deployer, accounts, transporter, seller;
  const orderId = 1;
  const order_location = "Ahmedabad";
  const quantity = 1;
  const items = "Items1, Item2";
  const amount = ethers.utils.parseEther("2.0");
  const name = "ABC";
  const location = "Ahmedabad";

  beforeEach(async () => {
    accounts = await hre.ethers.getSigners();
    seller = accounts[1];
    transporter = accounts[2];
    deployer = accounts[3];

    const Admin = await hre.ethers.getContractFactory("Admin", deployer);
    admin = await Admin.deploy();
    await admin.deployed();

    await admin.registerUser(name, location, 3);
    await admin.connect(seller).registerUser(name, location, 1);
    await admin.connect(transporter).registerUser(name, location, 2);

    const Order = await hre.ethers.getContractFactory("Order", deployer);

    order = await Order.deploy(
      admin.address,
      orderId,
      deployer.address,
      seller.address,
      transporter.address,
      order_location,
      quantity,
      items,
      amount,
      { value: amount }
    );
    await order.deployed();

    const contractBalance = await order.provider.getBalance(order.address);
    expect(contractBalance).to.equal(amount);
  });

  it("Should deplpy contract", async () => {
    expect(order.address).to.not.equal(0);

    const orderDetail = await order.getOrderDetail(deployer.address);

    expect(orderDetail._orderId).to.equal(orderId);
    expect(orderDetail._seller_ethAddress).to.equal(seller.address);
    expect(orderDetail._transporter_ethAddress).to.equal(transporter.address);
    expect(orderDetail._location).to.equal(order_location);
    expect(orderDetail._items).to.equal(items);
    expect(orderDetail._quantity).to.equal(quantity);
    expect(orderDetail._amount).to.equal(amount);
  });

  it("Should confirm the order", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    const orderStatus = await order.status();
    expect(orderStatus).to.equal(1);
  });

  it("Should package the order", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    const orderStatus = await order.status();
    expect(orderStatus).to.equal(2);
  });

  it("Should ship the order", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    await order.connect(transporter).shippingOrder(transporter.address);
    const orderStatus = await order.status();
    expect(orderStatus).to.equal(3);
  });

  it("Should the order marked as out for delivery", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    await order.connect(transporter).shippingOrder(transporter.address);
    await order.connect(transporter).outForDeliveryOrder(transporter.address);
    const orderStatus = await order.status();
    expect(orderStatus).to.equal(4);
  });

  it("Should the order marked as delivered and transfer payment to seller", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    await order.connect(transporter).shippingOrder(transporter.address);
    await order.connect(transporter).outForDeliveryOrder(transporter.address);

    const sellerBalanceBefore = await ethers.provider.getBalance(
      seller.address
    );

    await order.connect(transporter).deliverdOrder(transporter.address);
    const orderStatus = await order.status();
    expect(orderStatus).to.equal(5);

    const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

    expect(sellerBalanceAfter.sub(sellerBalanceBefore)).to.equal(amount);
    expect(await order.provider.getBalance(order.address)).to.equal(0);
  });

  it("Should cancel order and refund to customer", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    await order.cancelOrder(deployer.address);
    const orderStatus = await order.status();
    expect(orderStatus).to.equal(6);
    expect(await order.provider.getBalance(order.address)).to.equal(0);
  });

  it("Should return order", async () => {
    const orderDetail = await order.getOrderDetail(deployer.address);
    expect(orderDetail._orderId).to.equal(orderId);
    expect(orderDetail._seller_ethAddress).to.equal(seller.address);
    expect(orderDetail._transporter_ethAddress).to.equal(transporter.address);
    expect(orderDetail._location).to.equal(order_location);
    expect(orderDetail._items).to.equal(items);
    expect(orderDetail._quantity).to.equal(quantity);
    expect(orderDetail._amount).to.equal(amount);
  });

  it("Should not cancel the order", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    await order.connect(transporter).shippingOrder(transporter.address);
    await order.connect(transporter).outForDeliveryOrder(transporter.address);
    await expect(order.cancelOrder(deployer.address)).to.be.revertedWith(
      "Order cannot be cancel"
    );
  });

  it("Should return error: only customer has access", async () => {
    await expect(order.getOrderDetail(seller.address)).to.be.revertedWith(
      "Only customer has access"
    );
  });

  it("Should return error: only seller has access", async () => {
    await expect(
      order.connect(seller).confirmOrder(transporter.address)
    ).to.be.revertedWith("Only seller has access");
  });

  it("Should return error: only transporter has access", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    await expect(
      order.connect(transporter).shippingOrder(seller.address)
    ).to.be.revertedWith("Only transporter has access");
  });

  it("Should return error: Invalid seller", async () => {
    const newSeller = accounts[4];
    await admin.connect(newSeller).registerUser(name, location, 1);
    await expect(
      order.connect(newSeller).confirmOrder(newSeller.address)
    ).to.be.revertedWith("Invalid seller address for this order");
  });

  it("Should return error: Invalid transporter", async () => {
    const newTransporter = accounts[4];
    await admin.connect(newTransporter).registerUser(name, location, 2);
    await order.connect(seller).confirmOrder(seller.address);
    await order.connect(seller).packagingOrder(seller.address);
    await expect(
      order.connect(newTransporter).shippingOrder(newTransporter.address)
    ).to.be.revertedWith("Invalid transporter address for this order");
  });

  it("Should return error: Invalid customer", async () => {
    const newCustomer = accounts[4];
    await admin.connect(newCustomer).registerUser(name, location, 3);
    await expect(order.getOrderDetail(newCustomer.address)).to.be.revertedWith(
      "Invalid customer address for this order"
    );
  });

  it("Should not in confirm the order", async () => {
    await order.connect(seller).confirmOrder(seller.address);
    await expect(
      order.connect(seller).confirmOrder(seller.address)
    ).to.be.revertedWith("Order is not in placed state");
  });

  it("Should not packaging the order", async () => {
    await expect(
      order.connect(seller).packagingOrder(seller.address)
    ).to.be.revertedWith("Order is not in confirm state");
  });

  it("Should not shipping the order", async () => {
    await expect(
      order.connect(transporter).shippingOrder(transporter.address)
    ).to.be.revertedWith("Order is not in packaging state");
  });

  it("Should not out for delivery the order", async () => {
    await expect(
      order.connect(transporter).outForDeliveryOrder(transporter.address)
    ).to.be.revertedWith("Order is not in shipped state");
  });

  it("Should not out for delivery the order", async () => {
    await expect(
      order.connect(transporter).deliverdOrder(transporter.address)
    ).to.be.revertedWith("Order is not in out for delivery state");
  });
});
