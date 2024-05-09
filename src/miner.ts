import { KeyPair, mnemonicToWalletKey } from 'ton-crypto'
import { getHttpEndpoint } from '@orbs-network/ton-access'
import { internal, OpenedContract, TonClient, WalletContractV4 } from 'ton'
import { delay } from './utils'
import { minerConfig } from './config'
import axios from 'axios'


export class Miner {
  async run() {
    const key = await mnemonicToWalletKey(minerConfig.mnemonic)
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 })

    // initialize ton rpc client
    const endpoint = await getHttpEndpoint({ network: 'mainnet' })
    const client = new TonClient({ endpoint, timeout: 10000 })
    const walletContract = client.open(wallet)

    // send mining txs
    await this._sendTxs(walletContract, key)
  }

  private async _sendTxs(walletContract: OpenedContract<WalletContractV4>, key: KeyPair) {
    for (let i = 0; i < minerConfig.txCount; i++) {
      console.log(`Sending tx ${i} of ${minerConfig.txCount}`)
      try {
        const seqno = await this._sendTx(walletContract, key)
        console.log('Waiting for tx confirmation')
        await this._waitTxConfirmation(seqno, walletContract)
      } catch (err: unknown) {
        i--
        if (axios.isAxiosError(err)) {
          console.error('Network error', err.toString())
        }
        console.warn('Something went wrong, trying again...')
      }
      await delay(minerConfig.timeout)
    }
  }

  private async _sendTx(walletContract: OpenedContract<WalletContractV4>, key: KeyPair) {
    const seqno = await walletContract.getSeqno()
    console.log(`Got seqNo ${seqno}. Sending tx...`)

    await walletContract.sendTransfer({
      secretKey: key.secretKey, seqno: seqno, messages: [internal({
        to: minerConfig.giverAddress,
        value: minerConfig.tonAmount,
        body: minerConfig.comment, // optional comment
        bounce: true,
      })],
    })
    return seqno
  }

  private async _waitTxConfirmation(prevSeqno: number, walletContract: OpenedContract<WalletContractV4>) {
    let currentSeqno = await walletContract.getSeqno()
    // Waiting for wallet seqno change
    while (currentSeqno === prevSeqno) {
      currentSeqno = await walletContract.getSeqno()
      await delay(500)
    }
    console.log(`Transaction confirmed! New seqNo: ${currentSeqno}`)
    return currentSeqno
  }
}


