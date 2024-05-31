import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const Vaultium = buildModule("Vaultium", (m) => {

  const vaultium = m.contract("Vaultium", [
    30, // challenge duration seconds
  ], {} );

  return { vaultium };
});

export default Vaultium;