const { expect } = require("chai");

describe("Seller Contract", () => {
  let admin, deployer, accounts, transporter, order, customer, seller;
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
    seller = accounts[1];
    deployer = accounts[2];

    const Admin = await hre.ethers.getContractFactory("Admin", deployer);
    admin = await Admin.deploy();
    await admin.deployed();

    await admin.connect(seller).registerUser(name, location, 1);
    await admin.connect(customer).registerUser(name, location, 3);
    await admin.registerUser(name, location, 2);

    const Order = await hre.ethers.getContractFactory("Order", customer);

    order = await Order.deploy(
      admin.address,
      orderId,
      customer.address,
      seller.address,
      deployer.address,
      order_location,
      quantity,
      items,
      amount,
      { value: amount }
    );
    await order.deployed();

    const Transporter = await hre.ethers.getContractFactory(
      "Transporter",
      deployer
    );
    transporter = await Transporter.deploy(admin.address);
    await transporter.deployed();
  });

  it("Should deploy the transporter contract", () => {
    expect(transporter.address).to.not.equal(0);
  });

  it("Should shipping the order", async () => {
    await order.confirmOrder(seller.address);
    await order.packagingOrder(seller.address);
    await transporter.shippingOrder(order.address);
    const orderDetail = await order.getOrderDetail(customer.address);
    expect(orderDetail._status).to.equal(3);
  });

  it("Should out for delivery the order", async () => {
    await order.confirmOrder(seller.address);
    await order.packagingOrder(seller.address);
    await transporter.shippingOrder(order.address);
    await transporter.outForDeliveryOrder(order.address);
    const orderDetail = await order.getOrderDetail(customer.address);
    expect(orderDetail._status).to.equal(4);
  });

  it("Should delivered the order", async () => {
    await order.confirmOrder(seller.address);
    await order.packagingOrder(seller.address);
    await transporter.shippingOrder(order.address);
    await transporter.outForDeliveryOrder(order.address);
    await transporter.deliverdOrder(order.address);
    const orderDetail = await order.getOrderDetail(customer.address);
    expect(orderDetail._status).to.equal(5);
  });

  it("Should set new order", async () => {
    await transporter.setNewOrder(deployer.address, order.address);
    const allOrders = await transporter.getAllOrders();
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

    await transporter.setNewOrder(deployer.address, order.address);
    await transporter.setNewOrder(deployer.address, newOrder.address);

    const orderArr = [order.address, newOrder.address];
    const allOrders = await transporter.getAllOrders();
    expect(allOrders).to.deep.equal(orderArr);
  });

  it("Should return order by index", async () => {
    await transporter.setNewOrder(deployer.address, order.address);
    const oneOrder = await transporter.getOrderByIndex(0);
    expect(oneOrder).to.equal(order.address);
  });

  it("Should return invalid transporter for this order", async () => {
    await order.confirmOrder(seller.address);
    await order.packagingOrder(seller.address);
    const newTransporter = accounts[4];
    await admin.connect(newTransporter).registerUser(name, location, 2);
    await expect(
      transporter.connect(newTransporter).shippingOrder(order.address)
    ).to.be.revertedWith("Invalid transporter address for this order");
  });

  it("Should return with order is not in packagin state", async () => {
    await expect(transporter.shippingOrder(order.address)).to.be.revertedWith(
      "Order is not in packaging state"
    );
  });

  it("Should return with order is not in shipped state", async () => {
    await expect(
      transporter.outForDeliveryOrder(order.address)
    ).to.be.revertedWith("Order is not in shipped state");
  });

  it("Should return with order is not in out for delivery state", async () => {
    await expect(transporter.deliverdOrder(order.address)).to.be.revertedWith(
      "Order is not in out for delivery state"
    );
  });

  it("Should return only transporter has access", async () => {
    await expect(
      transporter.connect(customer).shippingOrder(order.address)
    ).to.be.revertedWith("Only transporter has access");
  });
});
