import {useLCDClient, useConnectedWallet} from '@terra-money/wallet-provider';
import { Coin } from '@terra-money/terra.proto/cosmos/base/v1beta1/coin'; 
import { useState } from 'react';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import './style.css';
export default function Balance() {
    const lcd = useLCDClient();
    const wallet = useConnectedWallet();
    const [luna, setLuna] = useState<String | null>('');
    useEffect(() => {
        const getBalance = async () => {
            if (wallet) {
                const {walletAddress} = wallet;
                const balances = await lcd.bank.balance(walletAddress);
                const balanceUluna = balances[0]?.get('uluna')?.toAmino()?.amount;
                setLuna(balanceUluna!);
            }
        };
        getBalance();
    }, [wallet])
    return (
        <div className="wallet-balance">
            {luna && <><img width="40" height="40" src="https://assets.terra.money/icon/svg/Luna.svg"></img>
            <Typography variant="h5" component="div">
                {Number(luna)/1000000}      
            </Typography></>
            }
        </div>
    )
}