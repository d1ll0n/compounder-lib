export type swapTokenForCToken_Input = {
  sellToken: string
  buyToken: string
  buyCToken: string
  sellAmount: string
  minBuyToken: string
}

export type swapCTokenForToken_Input = {
  sellToken: string
  sellCToken: string
  buyToken: string
  redeemAmount: string
  minBuyToken: string
}

export type swapCTokenForCToken_Input = {
  sellToken: string
  sellCToken: string
  buyToken: string
  buyCToken: string
  redeemAmount: string
  minBuyToken: string
}