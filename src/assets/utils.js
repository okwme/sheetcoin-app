export function getTransactionReceiptMined(txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            var receipt = global.web3.eth.getTransactionReceipt(txnHash);
            if (receipt == null) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
            } else {
                resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };
    
    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(global.web3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
            transactionReceiptAsync(txnHash, resolve, reject);
        });
    }
}
export function splitToken(token) {
    return token.split('.');
}

export function parseToken(token) {
    const [header, payload, signature] = splitToken(token);
    return {
        header: JSON.parse(atob(header)),
        payload: JSON.parse(atob(payload)),
        signature: '0x' + Buffer.from(signature, 'base64').toString('hex')
    }
}

export function tokenForRecovery(token) {
    const [header, payload, signature] = splitToken(token);
    return {
        header: atob(header),
        payload: atob(payload),
        signature: '0x' + Buffer.from(signature, 'base64').toString('hex')
    }
}