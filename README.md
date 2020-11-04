# Time Lock Smart Contract

***
## 【Introduction of Time Lock Smart Contract】
- Time Lock Smart Contract
  - We are currently exploring unique ways to help users seamlessly use their ERC20 tokens across networks.
  
  - We are interested in a Solidity contract that allows a user to send an amount of ERC20 token to a smart contract that takes custody of the asset for a pre-determined amount of time (e.g., 7 days) and issues a redemption token (similar to liquidity provider tokens in systems like Uniswap). 

  - At the end of the pre-determined time window, the contract should allow the user to reclaim the asset using by exchanging the redemption token for the original amount of asset.


&nbsp;

***

## Setup
### ① Install modules
```
$ npm install
```

<br>

### ② Run ganache-cli
（Please make sure whether port number is `8545` or not）
```
$ ganache-cli
```

<br>

### ③ Compile contracts
```
$ npm run compile:local
```

<br>

### ④ Test contracts（※ In progress to implement）
```
$ npm run test:local
```


&nbsp;

***

## 【References】
- Money Dance  
https://www.moneydance.io/
https://moneydance.devpost.com/
https://moneydance.devpost.com/details/resources?preview_token=dMiXFgKLi2UrXFT5QLBQy5STNJs4mFnRfJwrZl%2Bhlgc%3D

<br>

- Poly Games
  - Concept of the "Time Lock Smart Contract"：  
    https://docs.polyient.games/developer-resources/moneydance-hackathon

