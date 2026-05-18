// ** WEB3 Imports
import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { ethers } from 'ethers'
import { CONTRACT_INFO } from 'src/contract'

/**
 * Reads minimumAmount and maximumAmount from the contract.
 * Both are stored in wei (18 decimals) — we convert to USDT for display.
 *
 * Used to validate the buyBW input before sending the transaction,
 * preventing the "0xfb8f41b2" revert (amount out of allowed range).
 */
const useGetBuyLimits = () => {
  const [minAmount, setMinAmount] = useState(null)  // in USDT (human-readable)
  const [maxAmount, setMaxAmount] = useState(null)  // in USDT (human-readable)

  const { data: minData, isSuccess: isMinSuccess } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: 'minimumAmount',
    enabled: true,
    watch: false,
    staleTime: 60_000,
  })

  const { data: maxData, isSuccess: isMaxSuccess } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: 'maximumAmount',
    enabled: true,
    watch: false,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (isMinSuccess && minData) {
      setMinAmount(Number(ethers.utils.formatUnits(minData, 'ether')))
    }
  }, [minData, isMinSuccess])

  useEffect(() => {
    if (isMaxSuccess && maxData) {
      setMaxAmount(Number(ethers.utils.formatUnits(maxData, 'ether')))
    }
  }, [maxData, isMaxSuccess])

  const isLimitsFetched = isMinSuccess && isMaxSuccess

  /**
   * Validates a USDT amount (human-readable number) against contract limits.
   * Returns null if valid, or an error string if invalid.
   */
  const validateAmount = (amount) => {
    const num = Number(amount)
    if (!num || isNaN(num) || num <= 0) return 'Please enter a valid amount'
    if (minAmount !== null && num < minAmount) {
      return `Minimum buy amount is $${minAmount}`
    }
    if (maxAmount !== null && num > maxAmount) {
      return `Maximum buy amount is $${maxAmount}`
    }
    return null
  }

  return {
    minAmount,
    maxAmount,
    isLimitsFetched,
    validateAmount,
  }
}

export default useGetBuyLimits
