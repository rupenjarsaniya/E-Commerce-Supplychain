const { expect } = require("chai");

describe("Admin Contract", () => {
  let admin, deployer, accounts;
  const name = "ABC",
    location = "Ahmedabad",
    role = 3;

  beforeEach(async () => {
    accounts = await hre.ethers.getSigners();
    deployer = accounts[3];

    const Admin = await hre.ethers.getContractFactory("Admin", deployer);
    admin = await Admin.deploy();
    await admin.deployed();
  });

  it("Should deploy the admin contract", () => {
    expect(admin.address).to.not.equal(0);
  });

  it("Should register the new user", async () => {
    await admin.registerUser(name, location, role);
    const user = await admin.getUser();

    expect(user.ethAddress).is.equal(deployer.address);
    expect(user.name).to.equal(name);
    expect(user.location).to.equal(location);
    expect(user.role).to.equal(role);
  });

  it("Should revoke user role", async () => {
    await admin.registerUser(name, location, role);
    await admin.revokeRole();
    const userRole = await admin.getRole(deployer.address);

    expect(userRole).is.equal(4);
  });

  it("Should assign new role to user", async () => {
    const newRole = 2;

    await admin.registerUser(name, location, role);
    await admin.assignRole(newRole);
    const userRole = await admin.getRole(deployer.address);

    expect(userRole).is.equal(newRole);
  });

  it("Should not register user again", async () => {
    await admin.registerUser(name, location, role);
    await expect(admin.registerUser(name, location, role)).to.be.revertedWith(
      "User already exixsting with this eth address"
    );
  });

  it("Should only user has access", async () => {
    await admin.registerUser(name, location, role);
    await expect(admin.connect(accounts[0]).revokeRole()).to.be.revertedWith(
      "Invalid Address Found"
    );
  });
});
