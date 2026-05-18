// ** WEB3 Imports
import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { ethers } from 'ethers'
import { CONTRACT_INFO } from 'src/contract'

/**
 * Reads the current registration fee from the contract.
 *
 * `registerationFee()` is a public view function — no wallet connection needed.
 * Returns the raw BigNumber so it can be passed directly to approve() and registerUser().
 *
 * Fallback: if the contract read fails for any reason, falls back to
 * ethers.utils.parseEther('5') so registration is never completely blocked.
 */
const FALLBACK_FEE = ethers.utils.parseEther('5')

const useGetRegistrationFee = () => {
  const [fee, setFee] = useState(null)

  const { data, isSuccess, isError, error } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: 'registerationFee',
    // View function — no wallet needed, always enabled
    enabled: true,
    watch: false,
    // Use a public RPC so this works even before wallet connects
    staleTime: 60_000,
  })

  useEffect(() => {
    if (isSuccess && data) {
      setFee(data)
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (isError) {
      console.warn('[useGetRegistrationFee] Contract read failed, using fallback fee:', error?.message)
      // Use fallback so the user is not blocked
      setFee(FALLBACK_FEE)
    }
  }, [isError, error])

  return {
    /** BigNumber — pass directly to approve() and registerUser() args */
    registrationFee: fee ?? FALLBACK_FEE,
    /** true once fee is resolved (either from contract or fallback) */
    isFeeFetched: fee !== null || isError,
    isFeeError: isError,
  }
}

export default useGetRegistrationFee
