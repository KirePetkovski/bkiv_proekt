let port;
        let reader;
        let writer;
        let buffer = "";
    
        async function connectToArduino() {
            const status = document.getElementById('status');
            try {
                port = await navigator.serial.requestPort();
                await port.open({ baudRate: 9600 });
                writer = port.writable.getWriter();
                reader = port.readable.getReader();
                status.textContent = 'Connected to Arduino';
                console.log('Connected to Arduino');
    
                // Ensure initial state is sent to Arduino
                await writer.write(new TextEncoder().encode('0'));
    
                // Read data from Arduino
                readFromArduino();
               
            } catch (error) {
                status.textContent = 'Failed to connect to Arduino: ' + error.message;
                console.error('Failed to connect to Arduino:', error);
            }
        }
    
        async function readFromArduino() {
            const cardData = document.getElementById('cardData');
            while (true) {
                try {
                    const { value, done } = await reader.read();
                    if (done) {
                        console.log('Reader closed');
                        reader.releaseLock();
                        break;
                    }
                    const text = new TextDecoder().decode(value);
                    buffer += text;
    
                    // Process each complete line in the buffer
                    let lines = buffer.split('\n');
                    buffer = lines.pop(); // Save the incomplete line back to the buffer
    
                    for (let line of lines) {
                        console.log('Received:', line.trim());
                        cardData.textContent = 'Card ID: ' + line.trim();
                    }
                    connectToMetaMask();
                } catch (error) {
                    console.error('Failed to read from Arduino:', error);
                    break;
                }
            }
        }
    
        async function connectToMetaMask() {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                    const account = accounts[0];
                    document.getElementById('accountAddress').textContent = 'Account Address: ' + account;
                    console.log('Connected to MetaMask:', account);
                } catch (error) {
                    console.error('Failed to connect to MetaMask:', error);
                }
            } else {
                console.error('MetaMask is not installed');
            }
        }
    
        async function transferSepoliaETH() {
            const ethAmount = document.getElementById('ethAmount').value;
            const account = document.getElementById('accountAddress').textContent.split(' ')[2];
            const toggleSwitch = document.getElementById('toggleSwitch');

            if (!account || !ethAmount || ethAmount <= 0) {
                console.error('Invalid account or ETH amount');
                toggleSwitch.checked = false; // Set the switch to false if validation fails
                return;
            }

            try {
                const transactionParameters = {
                    to: 'CONTRACT_ADDRESS', // Replace with your deployed contract address
                    from: account,
                    value: (ethAmount * 1e18).toString(16) // Convert ETH to Wei and then to hex
                };

                const txHash = await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });

                console.log('Transaction sent:', txHash);

                // Wait for the transaction to be confirmed
                const receipt = await ethereum.request({
                    method: 'eth_getTransactionReceipt',
                    params: [txHash],
                });

                if (receipt && receipt.status === '0x1') {
                    // Transaction was successful
                    toggleSwitch.checked = true; // Set the switch to true
                } else {
                    // Transaction failed
                    toggleSwitch.checked = false; // Set the switch to false
                }
            } catch (error) {
                console.error('Failed to send transaction:', error);
                toggleSwitch.checked = false; // Set the switch to false on error
            }
        }

        // Event listener for number buttons
        document.querySelectorAll('.numberButton').forEach(button => {
            button.addEventListener('click', () => {
                const ethAmountField = document.getElementById('ethAmount');
                ethAmountField.value += button.textContent;
            });
        });
    
        // Clear button functionality
        document.getElementById('clearButton').addEventListener('click', () => {
            document.getElementById('ethAmount').value = '';
        });
    
        document.getElementById('connectButton').addEventListener('click', () => {
            connectToArduino();
           // connectToMetaMask(); // Connect to MetaMask when the button is clicked
        });
    
        document.getElementById('transferButton').addEventListener('click', transferSepoliaETH);
    
        document.getElementById('toggleSwitch').addEventListener('change', async function() {
            if (writer) {
                try {
                    if (this.checked) {
                        await writer.write(new TextEncoder().encode('1'));
                    } else {
                        await writer.write(new TextEncoder().encode('0'));
                    }
                } catch (error) {
                    console.error('Failed to write to Arduino:', error);
                }
            }
        });
