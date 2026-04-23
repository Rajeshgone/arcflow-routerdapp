// app.js - Arcflow Router DApp Logic

let provider;
let signer;
let fromToken = "ETH";
let toToken = "USDC";

const tokens = [
    { symbol: "ETH", name: "Ethereum", emoji: "⛓️" },
    { symbol: "USDC", name: "USD Coin", emoji: "💵" },
    { symbol: "DAI", name: "Dai Stablecoin", emoji: "🔶" },
    { symbol: "USDT", name: "Tether", emoji: "💰" }
];

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const statusEl = document.getElementById('status');
const tokenFromEl = document.getElementById('tokenFrom');
const tokenToEl = document.getElementById('tokenTo');

// Connect Wallet
async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask!");
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        connectWalletBtn.textContent = `${address.slice(0,6)}...${address.slice(-4)}`;
        statusEl.textContent = "Wallet connected successfully ✓";
        statusEl.className = "text-emerald-400";
    } catch (error) {
        console.error(error);
        statusEl.textContent = "Failed to connect wallet";
    }
}

// Token Selection
function selectToken(side) {
    window.currentSide = side;
    renderTokenList();
    document.getElementById('tokenModal').classList.remove('hidden');
}

function renderTokenList() {
    const container = document.getElementById('tokenList');
    container.innerHTML = '';

    tokens.forEach(token => {
        const div = document.createElement('div');
        div.className = "flex items-center gap-4 p-3 hover:bg-white/10 rounded-2xl cursor-pointer";
        div.innerHTML = `
            <span class="text-3xl">${token.emoji}</span>
            <div>
                <div class="font-medium">${token.name}</div>
                <div class="text-sm text-gray-400">${token.symbol}</div>
            </div>
        `;
        div.onclick = () => chooseToken(token.symbol);
        container.appendChild(div);
    });
}

function chooseToken(token) {
    if (window.currentSide === 'from') {
        fromToken = token;
        tokenFromEl.innerHTML = `
            <span class="text-2xl">${getTokenEmoji(token)}</span>
            <span class="text-sm font-medium">${token}</span> ▼
        `;
    } else {
        toToken = token;
        tokenToEl.innerHTML = `
            <span class="text-2xl">${getTokenEmoji(token)}</span>
            <span class="text-sm font-medium">${token}</span> ▼
        `;
    }
    closeModal();
}

function getTokenEmoji(symbol) {
    const token = tokens.find(t => t.symbol === symbol);
    return token ? token.emoji : '🪙';
}

function closeModal() {
    document.getElementById('tokenModal').classList.add('hidden');
}

// Swap Direction
function swapTokens() {
    [fromToken, toToken] = [toToken, fromToken];
    
    const amountFrom = document.getElementById('amountFrom').value;
    const amountTo = document.getElementById('amountTo').value;
    
    document.getElementById('amountFrom').value = amountTo;
    document.getElementById('amountTo').value = amountFrom;

    tokenFromEl.innerHTML = `
        <span class="text-2xl">${getTokenEmoji(fromToken)}</span>
        <span class="text-sm font-medium">${fromToken}</span> ▼
    `;
    tokenToEl.innerHTML = `
        <span class="text-2xl">${getTokenEmoji(toToken)}</span>
        <span class="text-sm font-medium">${toToken}</span> ▼
    `;
}

// Execute Swap (Mock for now)
async function executeSwap() {
    const amount = document.getElementById('amountFrom').value.trim();
    
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    if (!signer) {
        alert("Please connect your wallet first");
        return;
    }

    statusEl.textContent = "Routing through Arcflow...";
    statusEl.className = "text-amber-400";

    // Mock transaction delay
    setTimeout(() => {
        statusEl.innerHTML = `✅ Successfully swapped <b>${amount} ${fromToken}</b> to ${toToken}`;
        statusEl.className = "text-emerald-400";
    }, 1800);
}

function refreshRate() {
    statusEl.textContent = "Rate updated";
    setTimeout(() => {
        statusEl.textContent = "";
    }, 1500);
}

// Event Listeners
connectWalletBtn.addEventListener('click', connectWallet);

window.ethereum?.on('accountsChanged', () => window.location.reload());

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial tokens
    tokenFromEl.innerHTML = `
        <span class="text-2xl">${getTokenEmoji(fromToken)}</span>
        <span class="text-sm font-medium">${fromToken}</span> ▼
    `;
    tokenToEl.innerHTML = `
        <span class="text-2xl">${getTokenEmoji(toToken)}</span>
        <span class="text-sm font-medium">${toToken}</span> ▼
    `;
});
