import { FetchOptions, FetchV2, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import {  getFeeOnDateTime, getFeeSmartContract } from "./helpers";

const fetch: FetchV2 = async (options: FetchOptions) => {
  const dailyFees = options.createBalances();
  const feeSmartContract = await getFeeSmartContract();
  const formattedFeeSmartContract = feeSmartContract.startsWith('0x') ? feeSmartContract : `0x${feeSmartContract}`;
  console.log('formattedFeeSmartContract', formattedFeeSmartContract);

  const startTime = new Date(options.fromTimestamp * 1000).toISOString().replace('Z', '');
  const endTime = new Date(options.toTimestamp * 1000).toISOString().replace('Z', '');

  const feeStartTime = await getFeeOnDateTime(formattedFeeSmartContract, startTime);
  const feeEndTime = await getFeeOnDateTime(formattedFeeSmartContract, endTime);
  const dailyFeesNumber = feeEndTime - feeStartTime;

  dailyFees.addCGToken('coinweb', dailyFeesNumber / 1e18);

  return { dailyFees }
};

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.COINWEB]: {
      fetch,
      start: '2025-06-11',
    }
  },
  methodology: {
    Fees: 'All fees paid by users for finalising transactions.',
    Revenue: 'All fees are distributed to PactSwap fee pool.',
    ProtocolRevenue: 'All fees are distributed to PactSwap fee pool.',
  }
};

export default adapter;
