import { gql, request } from "graphql-request"

// const COINWEB_URL = 'https://api-cloud.coinweb.io'
const COINWEB_URL = 'https://bitcoin-graphql-ovh-blue.coinhq.store/wallet'

const queryGetClaimOnDateTime = gql`
query ($dateTime: NaiveDateTime!, $feeSmartContract: String!) {
  shard(name: BNB) {
    snapshots {
      onTime(dt: $dateTime) {
        fetchClaim(readOp: {
          claim: {
            issuer: {
              FromSmartContract: $feeSmartContract,
            }
            keyFirstPart: ["FUNDS"]
          }
        }) {
          claim {
            content {
              feesStored
            }
          }
        }
      }
    }
  }
}
`

export const getFeeOnDateTime = async(feeSmartContract: string, dateTime: string): Promise<number> => {
    const feeResponse = await request(COINWEB_URL, queryGetClaimOnDateTime, {
        dateTime: dateTime,
        feeSmartContract: feeSmartContract,
    });
    return Number(feeResponse.shard.snapshots.onTime.fetchClaim.claim.content.feesStored);
}

export const getFeeSmartContract = async(): Promise<string> => {
    const data = await fetch('https://app.pactswap.io/build-info.json')
    const json = await data.json()
    try {
        const feeSmartContract = json.BTC.L2_CONTRACT_ADDRESS_MAKER.module.instance.parameters.content.owner;
        return feeSmartContract
    } catch (error) {
        throw new Error('Failed to get fee smart contract', { cause: error })
    }
}