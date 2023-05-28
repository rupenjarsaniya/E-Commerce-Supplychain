const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[3];

  // Deplpy admin contract
  const Admin = await hre.ethers.getContractFactory("Admin", deployer);
  const admin = await Admin.deploy();
  await admin.deployed();
  console.log(`Admin contract deployed to ${admin.address}`);

  // Deplpy Seller contract
  const Seller = await hre.ethers.getContractFactory("Seller", deployer);
  const seller = await Seller.deploy(admin.address);
  await seller.deployed();
  console.log(`Seller contract deployed to ${seller.address}`);

  // Deplpy Transporter contract
  const Transporter = await hre.ethers.getContractFactory(
    "Transporter",
    deployer
  );
  const transporter = await Transporter.deploy(admin.address);
  await transporter.deployed();
  console.log(`Transporter contract deployed to ${transporter.address}`);

  // Deplpy Customer contract
  const Customer = await hre.ethers.getContractFactory("Customer", deployer);
  const customer = await Customer.deploy(
    admin.address,
    seller.address,
    transporter.address
  );
  await customer.deployed();
  console.log(`Customer contract deployed to ${customer.address}`);

  console.log("ALL CONTRACT ARE DEPLOYED BY", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
