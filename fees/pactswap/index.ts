import { FetchOptions, FetchV2, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import {  getFeeOnDateTime, getFeeSmartContract } from "./helpers";

const fetch: FetchV2 = async (options: FetchOptions) => {
  const dailyFees = options.createBalances();
  const feeSmartContract = await getFeeSmartContract();
  const formattedFeeSmartContract = feeSmartContract.startsWith('0x') ? feeSmartContract : `0x${feeSmartContract}`;

  const startTime = new Date(options.fromTimestamp * 1000).toISOString().replace('Z', '');
  console.log('startTime', startTime);
  const endTime = new Date(options.toTimestamp * 1000).toISOString().replace('Z', '');
  console.log('endTime', endTime);

  const feeStartTime = await getFeeOnDateTime(formattedFeeSmartContract, startTime);
  console.log('feeStartTime', feeStartTime);
  const feeEndTime = await getFeeOnDateTime(formattedFeeSmartContract, endTime);
  console.log('feeEndTime', feeEndTime);

  dailyFees.addGasToken(BigInt(feeEndTime - feeStartTime).toString());

  return { dailyFees }
};

// 07 - 0x000000000000000000000000000000000000000000001bc77b21314eb516e92e
// 09 - 0x000000000000000000000000000000000000000000001bc77b21314eb516e92e
// 10 - 0x000000000000000000000000000000000000000000001bc77b21314eb516e92e

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.ETHEREUM]: {
      fetch,
    }
  },
  methodology: {
    Fees: 'All fees paid by users for finalising transactions.',
    Revenue: 'All fees are distributed to PactSwap fee pool.',
    ProtocolRevenue: 'All fees are distributed to PactSwap fee pool.',
  }
};

export default adapter;
