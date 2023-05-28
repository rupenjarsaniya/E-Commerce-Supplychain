const { expect } = require("chai");

describe("Seller Contract", () => {
  let adminInstance,
    deployer,
    accounts,
    seller,
    sellerInstance,
    transporter,
    transporterInstance,
    customerInstance;
  const orderId = 1;
  const order_location = "Ahmedabad";
  const quantity = 1;
  const items = "Items1, Item2";
  const amount = ethers.utils.parseEther("2.0");
  const name = "ABC";
  const location = "Ahmedabad";

  beforeEach(async () => {
    accounts = await hre.ethers.getSigners();
    seller = accounts[3];
    deployer = accounts[1];
    transporter = accounts[2];

    const Admin = await hre.ethers.getContractFactory("Admin", deployer);
    adminInstance = await Admin.deploy();
    await adminInstance.deployed();

    const Seller = await hre.ethers.getContractFactory("Seller", deployer);
    sellerInstance = await Seller.deploy(adminInstance.address);
    await sellerInstance.deployed();

    const Transporter = await hre.ethers.getContractFactory(
      "Transporter",
      deployer
    );
    transporterInstance = await Transporter.deploy(adminInstance.address);
    await transporterInstance.deployed();

    await adminInstance.connect(seller).registerUser(name, location, 1);
    await adminInstance.registerUser(name, location, 3);
    await adminInstance.connect(transporter).registerUser(name, location, 2);

    const Customer = await hre.ethers.getContractFactory("Customer", deployer);
    customerInstance = await Customer.deploy(
      adminInstance.address,
      sellerInstance.address,
      transporterInstance.address
    );
    await customerInstance.deployed();
  });

  it("Should deploy the customer contract", () => {
    expect(customerInstance.address).to.not.equal(0);
  });

  it("Should place the order", async () => {
    await customerInstance.placeOrder(
      orderId,
      seller.address,
      transporter.address,
      order_location,
      quantity,
      items,
      { value: amount }
    );

    const customerOrder = await customerInstance.getOrderByIndex(0);
    const sellerOrder = await sellerInstance.connect(seller).getOrderByIndex(0);
    const transporterOrder = await transporterInstance
      .connect(transporter)
      .getOrderByIndex(0);

    expect(sellerOrder).to.equal(customerOrder);
    expect(transporterOrder).to.equal(customerOrder);
  });

  it("Should cancel the order", async () => {
    await customerInstance.placeOrder(
      orderId,
      seller.address,
      transporter.address,
      order_location,
      quantity,
      items,
      { value: amount }
    );
    await customerInstance.cancelOrder(0);
    const orderAddress = await customerInstance.getAllOrders();
    const orderDetail = await customerInstance.getOrderDetail(
      orderAddress[orderAddress.length - 1]
    );
    expect(orderDetail._status).to.equal(6);
  });

  it("Should return all orders", async () => {
    await customerInstance.placeOrder(
      orderId,
      seller.address,
      transporter.address,
      order_location,
      quantity,
      items,
      { value: amount }
    );

    const allOrders = await customerInstance.getAllOrders();
    expect(allOrders.length).to.deep.equal(1);
  });

  it("Should return order by index", async () => {
    await customerInstance.placeOrder(
      orderId,
      seller.address,
      transporter.address,
      order_location,
      quantity,
      items,
      { value: amount }
    );

    const orderAddress = await customerInstance.getOrderByIndex(0);
    const allOrders = await customerInstance.getAllOrders();
    expect(orderAddress).to.equal(allOrders[0]);
  });

  it("should return order detail", async () => {
    await customerInstance.placeOrder(
      orderId,
      seller.address,
      transporter.address,
      order_location,
      quantity,
      items,
      { value: amount }
    );
    const orderAddress = await customerInstance.getOrderByIndex(0);
    const orderDetail = await customerInstance.getOrderDetail(orderAddress);

    expect(orderDetail._orderId).to.equal(orderId);
    expect(orderDetail._seller_ethAddress).to.equal(seller.address);
    expect(orderDetail._transporter_ethAddress).to.equal(transporter.address);
    expect(orderDetail._location).to.equal(order_location);
    expect(orderDetail._items).to.equal(items);
    expect(orderDetail._quantity).to.equal(quantity);
    expect(orderDetail._amount).to.equal(amount);
  });

  it("Should return only customer has access", async () => {
    await expect(
      customerInstance
        .connect(seller)
        .placeOrder(
          orderId,
          seller.address,
          transporter.address,
          order_location,
          quantity,
          items,
          { value: amount }
        )
    ).to.be.revertedWith("Only customer has access");
  });

  it("Should return invalid seller address", async () => {
    await expect(
      customerInstance.placeOrder(
        orderId,
        accounts[6].address,
        transporter.address,
        order_location,
        quantity,
        items,
        { value: amount }
      )
    ).to.be.revertedWith("Invalid seller address");
  });

  it("Should return invalid transporter address", async () => {
    await expect(
      customerInstance.placeOrder(
        orderId,
        seller.address,
        accounts[6].address,
        order_location,
        quantity,
        items,
        { value: amount }
      )
    ).to.be.revertedWith("Invalid transporter address");
  });

  it("Should return you have to pay", async () => {
    await expect(
      customerInstance.placeOrder(
        orderId,
        seller.address,
        transporter.address,
        order_location,
        quantity,
        items
      )
    ).to.be.revertedWith("You have to pay");
  });
});
