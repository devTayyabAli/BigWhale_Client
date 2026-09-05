// ** WEB3 Imports
import { useContractRead } from "wagmi";
import { CONTRACT_INFO } from "src/contract";

const useGetUSDTAllowance = (ownerAddress, spenderAddress) => {
  const { data: allowanceData, refetch: refetchAllowance } = useContractRead({
    address: CONTRACT_INFO.token.address,
    abi: CONTRACT_INFO.token.abi,
    functionName: "allowance",
    args: [ownerAddress, spenderAddress],
    enabled: !!ownerAddress && !!spenderAddress,
  });

  return { allowanceData, refetchAllowance };
};

export default useGetUSDTAllowance;
