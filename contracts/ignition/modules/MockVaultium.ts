import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const MockVaultium = buildModule("MockVaultium", (m) => {

  const mockVaultium = m.contract("MockVaultium", [], {} );

  return { mockVaultium };
});

export default MockVaultium;