import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const MockVaultium = buildModule("MockVaultium", (m) => {

  const lock = m.contract("MockVaultium", [], {} );

  return { lock };
});

export default MockVaultium;