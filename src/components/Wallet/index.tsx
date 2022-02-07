import { useState } from 'react';
import { useWallet, WalletStatus, ConnectType } from '@terra-money/wallet-provider';
import './style.css';
import Button from '@mui/material/Button';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useEffect } from 'react';
import { connected } from 'process';
export default function Wallet() {
    const {status, wallets, network, connect, disconnect, refetchStates, availableConnectTypes} = useWallet();
    const [isConnected, setIsConnected] = useState(WalletStatus.WALLET_CONNECTED === status);
    const [connectedWallet, setConnectedWallet] = useState("");
    useEffect(() => {
        setIsConnected(WalletStatus.WALLET_CONNECTED === status)
    }, [status]);
    useEffect(() => {
        wallets[0] && setConnectedWallet(wallets[0].terraAddress);
    }, [wallets])

    return (
        <div className="wallet">
            {isConnected ?
                <>
                    <div className="wallet-icon"><AccountBalanceWalletIcon fontSize="large"/></div>
                    <div className="wallet-address">{connectedWallet}</div>
                    <div className="wallet-actions">
                        <Button variant="outlined" onClick={() => {
                            disconnect();
                            refetchStates();
                            }}>Disconnect</Button>
                    </div>
                </>
                :
                <>
                    <div className="wallet-icon"><AccountBalanceWalletOutlinedIcon fontSize="large"/></div>
                    <div className="wallet-address">Not connected</div>
                    <div className="wallet-actions">
                        <Button variant="outlined" onClick={() => {connect(ConnectType.EXTENSION)}}>Connect</Button>
                    </div>
                </>

                
            }


        </div>
    )
}