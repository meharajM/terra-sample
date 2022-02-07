import { getChainOptions, WalletProvider, useConnectedWallet } from '@terra-money/wallet-provider';
import Wallet from 'components/Wallet';
import Balance from 'components/Balance';
import History from 'components/History';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';



function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const wallet = useConnectedWallet();
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <div className="header">
          <Wallet/>
        </div>
        {wallet && <> 
          <Balance/>
          <History />
        </>}
      </Container>
    </ThemeProvider>
  )
}

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>,
    document.getElementById('root'),
  );
});
