# TC Connect

TC connect is a simple javascript library that connects apps to Trustless Computer Wallet to retrieve user wallet addresses and sign transactions.

# Installation

With Yarn:
```
  yarn add https://github.com/TrustlessComputer/tc-connect
```

# Connect wallet

```javascript
import * as TC_CONNECT from "tc-connect";

const CONNECT_URL = 'https://wadary.regtest.trustless.computer/relayer';
const WALLET_URL = 'https://trustlesswallet.io';

const connector = new TC_CONNECT.DappConnect(CONNECT_URL, WALLET_URL);

try {
  const account = await connector.requestAccount({
    target: "_blank",
    redirectURL: "",
    signMessage: "",
  });
  console.log("account", account);
} catch (e) {
  // todo handle error
  // Reject | Create transaction error
}
```
### Request
- `target`: window.open type `"_blank" | "_parent" | "_self" | "_top"`
- `redirectURL`: `optional` The url you want to redirect to when the request is successful.
- `signMessage`: `optional` Message for sign.

### Response
- `tcAddress`: TC wallet address in use.
- `btcAddress`: BTC wallet address  in use.
- `accounts`: Wallet's list of available accounts.
  - `tcAddress`: TC wallet address.
  - `btcAddress`: BTC wallet address.
- `signature`: The signature is signed by `tcAddress` if request `signMessage`.


# Sign Message

```javascript
import * as TC_CONNECT from "tc-connect";

const CONNECT_URL = 'https://wadary.regtest.trustless.computer/relayer';
const WALLET_URL = 'https://trustlesswallet.io';

const connector = new TC_CONNECT.DappConnect(CONNECT_URL, WALLET_URL);

try {
  const resp = await connection.requestSignMessage({
      target: "_blank",
      signMessage: "Hellow world.",
      fromAddress: "0x4821eaeb37061E3c26b2264838e788F8de06bdcF"
  })
  console.log("sign response", resp);
} catch (e) {
  // todo handle error
  // Reject | Create transaction error
}
```
### Request
- `target`: window.open type `"_blank" | "_parent" | "_self" | "_top"`
- `redirectURL`: `optional` The url you want to redirect to when the request is successful.
- `signMessage`: Message for sign.

### Response
- `tcAddress`: TC wallet address in use.
- `btcAddress`: BTC wallet address  in use.
- `accounts`: Wallet's list of available accounts.
  - `tcAddress`: TC wallet address.
  - `btcAddress`: BTC wallet address.
- `signature`: The signature is signed by `tcAddress`.


# Sign Transaction

## Contract Integration

### 1: Define ABI
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

### 2: Create calldata
```javascript
import { ethers } from "ethers";

const ContractInterface = new ethers.utils.Interface(ABI);
const encodeAbi = ContractInterface.encodeFunctionData("burn", [
    tokenAddress,
    burnAmount,
    receiver
]);
```
### 3: Request sign transaction
```javascript
import * as TC_CONNECT from "tc-connect";

const CONNECT_URL = 'https://wadary.regtest.trustless.computer/relayer';
const WALLET_URL = 'https://trustlesswallet.io';

const connector = new TC_CONNECT.DappConnect(CONNECT_URL, WALLET_URL);

const toAddress = "0xFC9a05654a5bBaBBc7c230eB718b363C23d833D2";

const response = await connector.requestSign({
    target: "_blank",
    calldata: encodeAbi,
    to: toAddress,
    value: "",
    redirectURL: "https://dapp_url.com",
    isInscribe: true,
    gasPrice: undefined,
    gasLimit: undefined,
    functionType: 'Burn',
    functionName: 'burn(address,uint256,string)',
});

console.log('Sign transaction response: ', response);

```
- `target`: window.open type `"_blank" | "_parent" | "_self" | "_top"`

- `calldata`: calldata for sign and send transaction.

- `to`: destination address.

- `value`: value TC sending transaction, `empty` if not defined. // 1e18 = 1 TC

- `isInscribe`: a flag to check whether to inscribe Bitcoin transaction:
    - `isInscribe = true`: Sign TC and Inscribe Bitcoin transaction.
    - `isInscribe = false`: Sign TC and do not Inscribe Bitcoin transaction.

- `gasPrice`: auto estimated, `undefined` if not defined.

- `gasLimit`: auto estimated, `undefined` if not defined.

- `redirectURL`: The url you want to redirect to when the request is successful, `undefined` if not defined.

## Contract Deployment

```javascript
const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "delegate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "voter",
                "type": "address"
            }
        ],
        "name": "giveRightToVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32[]",
                "name": "proposalNames",
                "type": "bytes32[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposal",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "chairperson",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "proposals",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "name",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "voters",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "weight",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "voted",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "delegate",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "vote",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "winnerName",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "winnerName_",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "winningProposal",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "winningProposal_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const arguments = ["0x52a6eb687cd22e80d3342eac6fcc7f2e19209e8f83eb9b82e81c6f3e6f30743b", "0xf84cdc2564441bb489174122b9ba5a4f8c92df198c33d0dc2affe1429d37f59b"];
const byteCode = "60806040523480156200001157600080fd5b506040516200143e3803806200143e833981810160405281019062000037919062000342565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060005b81518110156200017657600260405180604001604052808484815181106200010f576200010e62000393565b5b60200260200101518152602001600081525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010155505080806200016d90620003fb565b915050620000e2565b505062000448565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001e28262000197565b810181811067ffffffffffffffff82111715620002045762000203620001a8565b5b80604052505050565b6000620002196200017e565b9050620002278282620001d7565b919050565b600067ffffffffffffffff8211156200024a5762000249620001a8565b5b602082029050602081019050919050565b600080fd5b6000819050919050565b620002758162000260565b81146200028157600080fd5b50565b60008151905062000295816200026a565b92915050565b6000620002b2620002ac846200022c565b6200020d565b90508083825260208201905060208402830185811115620002d857620002d76200025b565b5b835b81811015620003055780620002f0888262000284565b845260208401935050602081019050620002da565b5050509392505050565b600082601f83011262000327576200032662000192565b5b8151620003398482602086016200029b565b91505092915050565b6000602082840312156200035b576200035a62000188565b5b600082015167ffffffffffffffff8111156200037c576200037b6200018d565b5b6200038a848285016200030f565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000819050919050565b60006200040882620003f1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036200043d576200043c620003c2565b5b600182019050919050565b610fe680620004586000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063609ff1bd1161005b578063609ff1bd146101145780639e7b8d6114610132578063a3ec138d1461014e578063e2ba53f01461018157610088565b80630121b93f1461008d578063013cf08b146100a95780632e4176cf146100da5780635c19a95c146100f8575b600080fd5b6100a760048036038101906100a291906109e2565b61019f565b005b6100c360048036038101906100be91906109e2565b6102e5565b6040516100d1929190610a37565b60405180910390f35b6100e2610319565b6040516100ef9190610aa1565b60405180910390f35b610112600480360381019061010d9190610ae8565b61033d565b005b61011c6106d7565b6040516101299190610b15565b60405180910390f35b61014c60048036038101906101479190610ae8565b61075f565b005b61016860048036038101906101639190610ae8565b610916565b6040516101789493929190610b4b565b60405180910390f35b610189610973565b6040516101969190610b90565b60405180910390f35b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000816000015403610229576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161022090610c08565b60405180910390fd5b8060010160009054906101000a900460ff161561027b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027290610c74565b60405180910390fd5b60018160010160006101000a81548160ff0219169083151502179055508181600201819055508060000154600283815481106102ba576102b9610c94565b5b906000526020600020906002020160010160008282546102da9190610cf2565b925050819055505050565b600281815481106102f557600080fd5b90600052602060002090600202016000915090508060000154908060010154905082565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060010160009054906101000a900460ff16156103d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103c990610d72565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610440576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043790610dde565b60405180910390fd5b5b600073ffffffffffffffffffffffffffffffffffffffff16600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146105af57600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691503373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105aa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105a190610e4a565b60405180910390fd5b610441565b60018160010160006101000a81548160ff021916908315150217905550818160010160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060010160009054906101000a900460ff16156106b2578160000154600282600201548154811061068657610685610c94565b5b906000526020600020906002020160010160008282546106a69190610cf2565b925050819055506106d2565b81600001548160000160008282546106ca9190610cf2565b925050819055505b505050565b6000806000905060005b60028054905081101561075a57816002828154811061070357610702610c94565b5b9060005260206000209060020201600101541115610747576002818154811061072f5761072e610c94565b5b90600052602060002090600202016001015491508092505b808061075290610e6a565b9150506106e1565b505090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e490610f24565b60405180910390fd5b600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff161561087d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161087490610f90565b60405180910390fd5b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000154146108cc57600080fd5b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555050565b60016020528060005260406000206000915090508060000154908060010160009054906101000a900460ff16908060010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154905084565b6000600261097f6106d7565b815481106109905761098f610c94565b5b906000526020600020906002020160000154905090565b600080fd5b6000819050919050565b6109bf816109ac565b81146109ca57600080fd5b50565b6000813590506109dc816109b6565b92915050565b6000602082840312156109f8576109f76109a7565b5b6000610a06848285016109cd565b91505092915050565b6000819050919050565b610a2281610a0f565b82525050565b610a31816109ac565b82525050565b6000604082019050610a4c6000830185610a19565b610a596020830184610a28565b9392505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610a8b82610a60565b9050919050565b610a9b81610a80565b82525050565b6000602082019050610ab66000830184610a92565b92915050565b610ac581610a80565b8114610ad057600080fd5b50565b600081359050610ae281610abc565b92915050565b600060208284031215610afe57610afd6109a7565b5b6000610b0c84828501610ad3565b91505092915050565b6000602082019050610b2a6000830184610a28565b92915050565b60008115159050919050565b610b4581610b30565b82525050565b6000608082019050610b606000830187610a28565b610b6d6020830186610b3c565b610b7a6040830185610a92565b610b876060830184610a28565b95945050505050565b6000602082019050610ba56000830184610a19565b92915050565b600082825260208201905092915050565b7f486173206e6f20726967687420746f20766f7465000000000000000000000000600082015250565b6000610bf2601483610bab565b9150610bfd82610bbc565b602082019050919050565b60006020820190508181036000830152610c2181610be5565b9050919050565b7f416c726561647920766f7465642e000000000000000000000000000000000000600082015250565b6000610c5e600e83610bab565b9150610c6982610c28565b602082019050919050565b60006020820190508181036000830152610c8d81610c51565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610cfd826109ac565b9150610d08836109ac565b9250828201905080821115610d2057610d1f610cc3565b5b92915050565b7f596f7520616c726561647920766f7465642e0000000000000000000000000000600082015250565b6000610d5c601283610bab565b9150610d6782610d26565b602082019050919050565b60006020820190508181036000830152610d8b81610d4f565b9050919050565b7f53656c662d64656c65676174696f6e20697320646973616c6c6f7765642e0000600082015250565b6000610dc8601e83610bab565b9150610dd382610d92565b602082019050919050565b60006020820190508181036000830152610df781610dbb565b9050919050565b7f466f756e64206c6f6f7020696e2064656c65676174696f6e2e00000000000000600082015250565b6000610e34601983610bab565b9150610e3f82610dfe565b602082019050919050565b60006020820190508181036000830152610e6381610e27565b9050919050565b6000610e75826109ac565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610ea757610ea6610cc3565b5b600182019050919050565b7f4f6e6c79206368616972706572736f6e2063616e20676976652072696768742060008201527f746f20766f74652e000000000000000000000000000000000000000000000000602082015250565b6000610f0e602883610bab565b9150610f1982610eb2565b604082019050919050565b60006020820190508181036000830152610f3d81610f01565b9050919050565b7f54686520766f74657220616c726561647920766f7465642e0000000000000000600082015250565b6000610f7a601883610bab565b9150610f8582610f44565b602082019050919050565b60006020820190508181036000830152610fa981610f6d565b905091905056fea2646970667358221220dfee653292616b0079213f0c655d971f61986450d9ba5cd42baab80609aab65264736f6c63430008130033";

const web3 = new Web3();
const ContractInterface = new web3.eth.Contract(ABI);
const encodeABI = ContractInterface.deploy({
    data: bytecode,
    arguments: [
        arguments
    ]
}).encodeABI();

const connector = new TC_CONNECT.DappConnect(CONNECT_URL, WALLET_URL);

const response = await connector.requestSign({
    target: "_blank",
    calldata: encodeABI,
    to: "",
    value: "",
    isInscribe: true,
    functionType: 'Contract Depoloyment',
    functionName: 'constructor(bytes32[])',
});

console.log('Deploy contract response: ', response);
```
