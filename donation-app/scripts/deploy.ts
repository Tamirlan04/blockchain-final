// @ts-nocheck
import { ethers } from "ethers";
import fs from "fs";
import path from "path"; 

async function main() {
    console.log(" Starting manual deployment...");

    
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    let signer;
    try {
        signer = await provider.getSigner(0);
        console.log("Deployer address:", await signer.getAddress());
    } catch (e) {
        console.error("Could not connect to the local node. Is 'npx hardhat node' running?");
        return;
    }

   
    const artifactPath = path.join(process.cwd(), "artifacts", "contracts", "Donation.sol", "Donation.json");

    if (!fs.existsSync(artifactPath)) {
        console.error("Artifact file not found at:", artifactPath);
        console.log("Make sure you ran 'npx hardhat compile' and the contract name is correct.");
        return;
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    
    console.log("Deploying Donation...");
    const donation = await factory.deploy();
    
    await donation.waitForDeployment();
    
    const donationAddress = await donation.getAddress();

    const tokenAddress = await donation.rewardToken();

    console.log("\n===============================================");
    console.log(" DEPLOYMENT SUCCESSFUL!");
    console.log(` Donation App:  ${donationAddress}`);
    console.log(` Reward Token: ${tokenAddress}`);
    console.log("===============================================\n");
}

main().catch((error) => {
    console.error("\n ERROR:");
    console.error(error);
    process.exitCode = 1;
    
});