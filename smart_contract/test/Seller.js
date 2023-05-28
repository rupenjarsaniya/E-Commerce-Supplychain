const { expect } = require("chai");

describe("Seller Contract", () => {
  let admin, deployer, accounts, seller, order, customer, transporter;
  const orderId = 1;
  const order_location = "Ahmedabad";
  const quantity = 1;
  const items = "Items1, Item2";
  const amount = ethers.utils.parseEther("2.0");
  const name = "ABC";
  const location = "Ahmedabad";

  beforeEach(async () => {
    accounts = await hre.ethers.getSigners();
    customer = accounts[3];
    deployer = accounts[1];
    transporter = accounts[2];

    const Admin = await hre.ethers.getContractFactory("Admin", deployer);
    admin = await Admin.deploy();
    await admin.deployed();

    await admin.registerUser(name, location, 1);
    await admin.connect(customer).registerUser(name, location, 3);
    await admin.connect(transporter).registerUser(name, location, 2);

    const Order = await hre.ethers.getContractFactory("Order", customer);

    order = await Order.deploy(
      admin.address,
      orderId,
      customer.address,
      deployer.address,
      transporter.address,
      order_location,
      quantity,
      items,
      amount,
      { value: amount }
    );
    await order.deployed();

    const Seller = await hre.ethers.getContractFactory("Seller", deployer);
    seller = await Seller.deploy(admin.address);
    await seller.deployed();
  });

  it("Should deploy the seller contract", () => {
    expect(seller.address).to.not.equal(0);
  });

  it("Should confirm the order", async () => {
    await seller.confirmOrder(order.address);
    const orderDetail = await order.getOrderDetail(customer.address);
    expect(orderDetail._status).to.equal(1);
  });

  it("Should packaging the order", async () => {
    await seller.confirmOrder(order.address);
    await seller.packagingOrder(order.address);
    const orderDetail = await order.getOrderDetail(customer.address);
    expect(orderDetail._status).to.equal(2);
  });

  it("Should set new order", async () => {
    await seller.setNewOrder(deployer.address, order.address);
    const allOrders = await seller.getAllOrders();
    expect(allOrders[0]).to.equal(order.address);
  });

  it("Should return all orders", async () => {
    const NewOrder = await hre.ethers.getContractFactory("Order", customer);

    const newOrder = await NewOrder.deploy(
      admin.address,
      orderId,
      customer.address,
      deployer.address,
      transporter.address,
      order_location,
      quantity,
      items,
      amount,
      { value: amount }
    );
    await newOrder.deployed();

    await seller.setNewOrder(deployer.address, order.address);
    await seller.setNewOrder(deployer.address, newOrder.address);

    const orderArr = [order.address, newOrder.address];
    const allOrders = await seller.getAllOrders();
    expect(allOrders).to.deep.equal(orderArr);
  });

  it("Should return order by index", async () => {
    await seller.setNewOrder(deployer.address, order.address);
    const oneOrder = await seller.getOrderByIndex(0);
    expect(oneOrder).to.equal(order.address);
  });

  it("Should return invalid seller for this order", async () => {
    await seller.confirmOrder(order.address);
    const newSeller = accounts[4];
    await admin.connect(newSeller).registerUser(name, location, 1);
    await expect(
      seller.connect(newSeller).confirmOrder(order.address)
    ).to.be.revertedWith("Invalid seller address for this order");
  });

  it("Should return only seller has access", async () => {
    await expect(
      seller.connect(customer).confirmOrder(order.address)
    ).to.be.revertedWith("Only seller has access");
  });
});
