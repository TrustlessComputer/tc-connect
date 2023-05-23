# TC Connect

TC connect is a simple javascript library that connects apps to Trustless Computer Wallet to retrieve user wallet addresses and sign transactions.

1: Define ABI
```javascript
const ABI = [
  {
    "inputs": [
      {
        "internalType": "contract WrappedToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "externalAddr",
        "type": "string"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
];
```

2: Create calldata
```javascript
import { ethers } from "ethers";

const CONNECT_URL = 'https://wadary.regtest.trustless.computer/relayer';
const WALLET_URL = 'https://trustlesswallet.io';

const ContractInterface = new ethers.utils.Interface(ABI);
const encodeAbi = ContractInterface.encodeFunctionData("burn", [
    tokenAddress,
    burnAmount,
    receiver
]);
```
3: Request sign transaction
```javascript
import * as TC_CONNECT from "tc-connect";
const connector = new TC_CONNECT.DappConnect(CONNECT_URL, WALLET_URL);

const toAddress = "0xFC9a05654a5bBaBBc7c230eB718b363C23d833D2";

await connection.requestSign({
    target: "_blank",
    calldata: encodeAbi,
    to: toAddress,
    value: "",
    isInscribe: false,
    gasPrice: undefined,
    gasLimit: undefined,
    functionType: 'Burn',
    functionName: 'burn(address,uint256,string)',
})
```