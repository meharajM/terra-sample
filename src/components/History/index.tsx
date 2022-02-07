import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {useLCDClient, useConnectedWallet} from '@terra-money/wallet-provider';
import {Tx} from "@terra-money/terra.js";
import { useEffect } from 'react';
import { useState } from 'react';
interface TransactionRow {
    type?: string,
    amount?: string,
    from?: string,
    to?: string,
    hash?: string,
    time?: string,
    gas?: string
}
const BANKSEND = 'bank/MsgSend';
const MARKETSWAP = "market/MsgSwap";
export default function History() {
    const lcd = useLCDClient();
    const wallet = useConnectedWallet();
    const [txs, setTxs] = useState([]);
    const [moneyTxs, setMoneyTxs] = useState([]);
    const [filter, setFilter] = useState(BANKSEND); //BANK | MARKETSWAP
    useEffect(() => {
        const getInfo = async () => {

            const transactions = await fetch(`https://bombay-fcd.terra.dev/v1/txs/?account=${wallet?.walletAddress}&chainId=localterra&limit=10`).then(res => res.json());
            if (transactions.txs) {
                const rows = transactions.txs.map((t: { tx: { value: { msg: any[]; fee: { amount: { amount: any; }[]; }; }; }; txhash: any; timestamp: any; }) => {
                    const row: TransactionRow = {};
                    const msg = t.tx.value.msg[0];
                    row.type = msg.type;

                    if (row.type === MARKETSWAP) {
                        row.from = msg.value.ask_denom;
                        row.amount = msg.value.offer_coin.amount;
                        row.to = msg.value.offer_coin.denom;
                    } else if (row.type === BANKSEND) {
                        row.amount = msg.value.amount[0].amount;
                        row.from = msg.value.from_address;
                        row.to = msg.value.to_address;
                    }
                    row.hash = t.txhash;
                    row.time = t.timestamp;
                    row.gas = t.tx.value.fee.amount[0].amount;
                    return row;
                });
            setTxs(rows);

            }
           // type, amout, add, hash, time, gas
        }
        wallet && getInfo();
    }, [wallet]);
    useEffect(() => {
        const moneyTxs = txs.filter((t:TransactionRow) => t.type === BANKSEND);
        setMoneyTxs(moneyTxs);
    },[txs])
    return (<div className="history">
        <div>
            <Button variant={filter === BANKSEND ? 'contained': 'outlined'} onClick={() => setFilter(BANKSEND)} >Money</Button>
            <Button variant={filter === MARKETSWAP ? 'contained': 'outlined'} onClick={() => setFilter(MARKETSWAP)} >Swap</Button>
        </div>
        <TableContainer component={Paper}>
           {txs.length ? <Table  aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="left" >Amount</TableCell>
                    <TableCell align="left">From</TableCell>
                    <TableCell align="left">To</TableCell>
                    <TableCell align="left">Time</TableCell>
                    <TableCell align="left">Gas used</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {txs.filter((row: TransactionRow) => row.type === filter).map((row: TransactionRow) => (
                    <TableRow
                    key={row.hash}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell>
                            {row.type}
                        </TableCell>
                        <TableCell>
                            {Number(row.amount)/1000000}
                        </TableCell>
                        <TableCell>{row.from}</TableCell>
                        <TableCell>{row.to}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>{Number(row.gas)/1000000}</TableCell>
                    </TableRow>
            ))}
            </TableBody>
      </Table>
      : 
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '300px', alignItems: 'center' }}>
            <CircularProgress />
        </Box>         
}
        </TableContainer>
    </div>)
} 