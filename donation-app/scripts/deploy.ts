// @ts-nocheck
import { ethers } from "ethers";
import fs from "fs";
import path from "path"; // Теперь импорт правильный

async function main() {
    console.log("🚀 Starting manual deployment...");

    // 1. Подключение к локальной ноде
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    let signer;
    try {
        signer = await provider.getSigner(0);
        console.log("👤 Deployer address:", await signer.getAddress());
    } catch (e) {
        console.error("❌ Could not connect to the local node. Is 'npx hardhat node' running?");
        return;
    }

    // 2. Путь к артефактам (относительно корня проекта)
    // Замените старый путь на этот:
    const artifactPath = path.join(process.cwd(), "artifacts", "contracts", "Donation.sol", "Donation.json");

    if (!fs.existsSync(artifactPath)) {
        console.error("❌ Artifact file not found at:", artifactPath);
        console.log("💡 Make sure you ran 'npx hardhat compile' and the contract name is correct.");
        return;
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // 3. Создание фабрики и деплой
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    
    console.log("⏳ Deploying Donation...");
    const donation = await factory.deploy();
    
    // В ethers v6 ждем именно так:
    await donation.waitForDeployment();
    
    const donationAddress = await donation.getAddress();

    // 4. Получаем адрес RewardToken (Tokenization Requirement)
    const tokenAddress = await donation.rewardToken();

    console.log("\n===============================================");
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log(`📍 Donation App:  ${donationAddress}`);
    console.log(`🪙 Reward Token: ${tokenAddress}`);
    console.log("===============================================\n");
}

main().catch((error) => {
    console.error("\n💀 ERROR:");
    console.error(error);
    process.exitCode = 1;
});