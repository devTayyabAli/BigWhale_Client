// ** WEB3 Imports
import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { CONTRACT_INFO } from 'src/contract'

/**
 * Reads the current registration fee directly from the contract.
 * The contract stores it as a BigNumber (wei) — we return it as-is
 * so it can be passed directly to approve() and registerUser().
 *
 * Contract function: registerationFee() → uint256
 */
const useGetRegistrationFee = () => {
  const [fee, setFee] = useState(null)

  const { data, isSuccess, isError } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: 'registerationFee',
    watch: false,
  })

  useEffect(() => {
    if (isSuccess && data) {
      // data is a BigNumber — keep it as-is for contract calls
      setFee(data)
    }
  }, [data, isSuccess])

  return {
    /** BigNumber — pass directly to approve() and registerUser() args */
    registrationFee: fee,
    isFeeFetched: isSuccess,
    isFeeError: isError,
  }
}

export default useGetRegistrationFee
