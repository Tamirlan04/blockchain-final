import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  // подключаемся к локальной hardhat-нёде
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // ВАЖНО: берём signer ПО ИНДЕКСУ
  const signer = await provider.getSigner(0);

  // читаем артефакт контракта
  const artifact = await hre.artifacts.readArtifact("Donation");

  // создаём фабрику
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    signer
  );

  // деплой
  const donation = await factory.deploy();
  await donation.waitForDeployment();

  console.log("Donation deployed to:", await donation.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
