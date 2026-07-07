<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk Transaksi</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            margin: 20px;
            color: #000;
        }

        h2 {
            text-align: center;
            margin-bottom: 2px;
        }

        .alamat {
            text-align: center;
            margin-bottom: 20px;
            font-size: 11px;
        }

        .info {
            width: 100%;
            margin-bottom: 15px;
        }

        .info td {
            padding: 3px 0;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table.items th {
            border: 1px solid #000;
            padding: 8px;
            background: #eeeeee;
            text-align: center;
        }

        table.items td {
            border: 1px solid #000;
            padding: 8px;
        }

        .right {
            text-align: right;
        }

        .center {
            text-align: center;
        }

        .summary {
            margin-top: 20px;
            width: 100%;
        }

        .summary td {
            padding: 5px;
        }

        .footer {
            text-align: center;
            margin-top: 35px;
            font-size: 11px;
        }
    </style>
</head>

<body>

    <h2>NANYANG BAKERY</h2>

    <div class="alamat">
        Batam, Indonesia
    </div>

    <table class="info">
        <tr>
            <td width="35%">No. Struk</td>
            <td>: {{ $transaction->receipt->receipt_number ?? $transaction->transaction_id }}</td>
        </tr>

        <tr>
            <td>ID Transaksi</td>
            <td>: {{ $transaction->transaction_id }}</td>
        </tr>

        <tr>
            <td>Tanggal</td>
            <td>: {{ $transaction->created_at }}</td>
        </tr>

        <tr>
            <td>Kasir</td>
            <td>: {{ $transaction->kasir->name ?? '-' }}</td>
        </tr>

        <tr>
            <td>Metode Bayar</td>
            <td>: {{ strtoupper($transaction->payment_method) }}</td>
        </tr>

        <tr>
            <td>Status</td>
            <td>: {{ ucfirst($transaction->payment_status) }}</td>
        </tr>
    </table>

    <table class="items">

        <thead>
            <tr>
                <th width="40%">Produk</th>
                <th width="15%">Qty</th>
                <th width="20%">Harga</th>
                <th width="25%">Subtotal</th>
            </tr>
        </thead>

        <tbody>

        @forelse($transaction->order->items as $item)

            <tr>
                <td>
                    {{ $item->product->name ?? '-' }}
                </td>

                <td class="center">
                    {{ $item->quantity }}
                </td>

                <td class="right">
                    Rp {{ number_format($item->price,0,',','.') }}
                </td>

                <td class="right">
                    Rp {{ number_format($item->subtotal,0,',','.') }}
                </td>
            </tr>

        @empty

            <tr>
                <td colspan="4" class="center">
                    Tidak ada data produk
                </td>
            </tr>

        @endforelse

        </tbody>

    </table>

    <table class="summary">

        <tr>
            <td width="75%" class="right">
                <strong>Total</strong>
            </td>

            <td class="right">
                <strong>
                    Rp {{ number_format($transaction->total_amount,0,',','.') }}
                </strong>
            </td>
        </tr>

        <tr>
            <td class="right">
                Jumlah Bayar
            </td>

            <td class="right">
                Rp {{ number_format($transaction->amount_paid,0,',','.') }}
            </td>
        </tr>

        <tr>
            <td class="right">
                Kembalian
            </td>

            <td class="right">
                Rp {{ number_format($transaction->amount_paid - $transaction->total_amount,0,',','.') }}
            </td>
        </tr>

    </table>

    <div class="footer">
        <p>Terima kasih telah berbelanja di Nanyang Bakery.</p>
        <p>Simpan struk ini sebagai bukti transaksi.</p>
    </div>

</body>
</html>