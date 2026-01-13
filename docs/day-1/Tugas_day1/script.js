// Ambil elemen dari HTML
const connectBtn = document.getElementById('connectBtn');
const statusDisplay = document.getElementById('status');
const addressDisplay = document.getElementById('address');
const networkDisplay = document.getElementById('network');
const balanceDisplay = document.getElementById('balance');

// Chain ID Avalanche Fuji Testnet (Decimal: 43113, Hex: 0xa869)
const AVALANCHE_FUJI_ID = 43113;

connectBtn.addEventListener('click', async () => {
    // 1. Cek apakah Wallet terinstall
    if (typeof window.ethereum !== 'undefined') {
        try {
            connectBtn.innerText = "Connecting...";
            connectBtn.disabled = true;

            // 2. Minta akses akun
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // 3. Ambil Chain ID
            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            const chainId = parseInt(chainIdHex, 16);

            // 4. Ambil Saldo
            const balanceHex = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            });
            
            // Konversi Saldo (Wei ke AVAX)
            const balanceAvax = (parseInt(balanceHex, 16) / 10**18).toFixed(4);

            // 5. Tampilkan Data
            updateUI(account, chainId, balanceAvax);

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
            connectBtn.innerText = "Connect Wallet";
            connectBtn.disabled = false;
        }
    } else {
        alert("⚠️ Core Wallet tidak ditemukan! Install extension dulu.");
    }
});

function updateUI(account, chainId, balance) {
    // Update Address
    addressDisplay.innerText = account;
    
    // Update Status
    statusDisplay.innerText = "Connected ✅";
    statusDisplay.style.color = "#00ff9d";
    
    // Umpetin tombol connect biar rapi
    connectBtn.style.display = "none";

    // Update Balance
    balanceDisplay.innerText = balance;

    // Cek Network (Validasi Task 2)
    if (chainId === AVALANCHE_FUJI_ID) {
        networkDisplay.innerText = "Avalanche Fuji Testnet ✅";
        networkDisplay.style.color = "#00ff9d";
    } else {
        networkDisplay.innerText = "Wrong Network ❌ (Switch to Fuji!)";
        networkDisplay.style.color = "#ff4444";
    }
}

// Auto-refresh kalau user ganti akun/network di wallet
if (window.ethereum) {
    //window.ethereum.on('accountsChanged', () => window.location.reload());
    //window.ethereum.on('chainChanged', () => window.location.reload());
}