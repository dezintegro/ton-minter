# TON Mining Script

Simple script for jettons givers

This is a script that allows you to send a specified amount of TON to a specified address. Here's how to use it:

## Prerequisites

1. Install Node.js on your system. You can download it from the official website: https://nodejs.org/

## Installation

1. Open your terminal or command prompt.
2. Create a new directory for your project: `mkdir ton-miner`
3. Navigate to the directory: `cd ton-miner`
4. Install the required dependencies: `npm install`

## Configuration

1. Open file `src/config.ts` in the project directory.
2. Replace the following values with your desired configuration:

`giverAddress`: The address to which you want to send the TON.

`tonAmount`: The amount of TON you want to send (in TON).

`comment`: An optional comment for the transaction (can be left as null).

`timeout`: The delay between transactions in milliseconds.

`txCount`: The total number of transactions you want to send.

`mnemonic`: Your TON wallet mnemonic phrase. Replace the placeholder with your actual mnemonic phrase.
