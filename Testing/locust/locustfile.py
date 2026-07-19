from locust import HttpUser, task, between
import random
import logging

# WAITRES
class WaitresUser(HttpUser):

    host = "http://127.0.0.1:8000"
    wait_time = between(2, 4)
    weight = 5

    WAITRES_ID = 3

    def on_start(self):
        print("\n===== WAITRES LOGIN =====")

        response = self.client.post(
            "/api/login",
            json={
                "email": "waitres@gmail.com",
                "password": "waitres"
            },
            name="01. Waitres - Login"
        )

        if response.status_code == 200:
            print("✅ Waitres login berhasil")
        else:
            print("❌ Waitres login gagal")

          
    @task(3)
    def lihat_menu(self):

        with self.client.get(
            "/api/products",
            catch_response=True,
            name="02. Waitres - Lihat Menu"
        ) as response:

            if response.status_code == 200:
                print("✅ Menu berhasil dimuat")
                response.success()
            else:
                print("❌ Gagal melihat menu")
                response.failure(response.text)   

    @task(2)
    def lihat_meja(self):

        with self.client.get(
            "/api/tables",
            catch_response=True,
            name="03. Waitres - Lihat Meja"
        ) as response:

            if response.status_code == 200:
                print("✅ Data meja berhasil")
                response.success()
            else:
                print("❌ Gagal mengambil meja")
                response.failure(response.text)  
            
    @task(1)
    def lihat_meja_terisi(self):

        with self.client.get(
            "/api/occupied-tables",
            catch_response=True,
            name="04. Waitres - Meja Terisi"
        ) as response:

            if response.status_code == 200:
                print("✅ Data meja terisi berhasil")
                response.success()
            else:
                print("❌ Gagal mengambil meja terisi")
                response.failure(response.text)

    @task(4)
    def buat_pesanan(self):

        payload = {
            "table_id": random.randint(1, 12),
            "waitres_id": self.WAITRES_ID,
            "items": [
                {
                    "product_id": random.choice([2,3,4,5,6,7,9]),
                    "quantity": random.randint(1,3)
                }
            ]
        }

        with self.client.post(
            "/api/orders",
            json=payload,
            catch_response=True,
            name="05. Waitres - Buat Pesanan"
        ) as response:

            if response.status_code == 201:
                print("🛒 Pesanan berhasil dibuat")
                response.success()

            else:
                print("❌ Pesanan gagal")
                print(response.text)
                response.failure(response.text)

 # KASIR 
class KasirUser(HttpUser):

    host = "http://127.0.0.1:8000"
    wait_time = between(2,4)
    weight = 3

    KASIR_ID = 2

    def on_start(self):

        print("\n===== KASIR LOGIN =====")

        response = self.client.post(
            "/api/login",
            json={
                "email":"kasir2@gmail.com",
                "password":"kasir2"
            },
            name="06. Kasir - Login"
        )

        if response.status_code == 200:
            print("✅ Kasir login berhasil")
        else:
            print("❌ Kasir login gagal")

    @task(3)
    def lihat_order(self):

        with self.client.get(
            "/api/orders",
            catch_response=True,
            name="07. Kasir - Lihat Order"
        ) as response:

            if response.status_code == 200:
                print("📋 Berhasil mengambil daftar order")
                response.success()
            else:
                print("❌ Gagal mengambil order")
                response.failure(response.text)
            
    @task(4)
    def buat_transaksi(self):

        orders = self.client.get("/api/orders")

        if orders.status_code != 200:
            print("❌ Tidak bisa mengambil order")
            return

        data = orders.json()

        pending_orders = [
            o for o in data
            if o["status"] == "pending"
        ]

        if len(pending_orders) == 0:
            print("⚠ Tidak ada order pending")
            return

        order = pending_orders[-1]

        payload = {
            "order_id": order["id"],
            "kasir_id": self.KASIR_ID,
            "total_amount": order["total_amount"],
            "payment_method": "cash",
            "amount_paid": order["total_amount"]
        }

        with self.client.post(
            "/api/transactions",
            json=payload,
            catch_response=True,
            name="08. Kasir - Buat Transaksi"
        ) as response:

            if response.status_code in [200,201]:
                print(f"💰 Transaksi berhasil untuk Order {order['id']}")
                response.success()

            else:
                print("❌ Gagal membuat transaksi")
                response.failure(response.text)


    @task(2)
    def payment(self):

        orders = self.client.get("/api/orders")

        if orders.status_code != 200:
            return

        data = orders.json()

        pending_orders = [
            o for o in data
            if o["status"] == "pending"
        ]

        if len(pending_orders) == 0:
            print("⚠ Tidak ada order yang bisa dibayar")
            return

        order = pending_orders[0]

        with self.client.post(
            "/api/payment",
            json={
                "order_id": order["id"]
            },
            catch_response=True,
            name="09. Kasir - Payment"
        ) as response:

            if response.status_code == 200:
                print(f"💳 Payment berhasil Order {order['id']}")
                response.success()

            else:
                print("❌ Payment gagal")
                response.failure(response.text)

    @task(2)
    def lihat_transaksi(self):

        with self.client.get(
            "/api/transactions",
            catch_response=True,
            name="10. Kasir - Lihat Transaksi"
        ) as response:

            if response.status_code == 200:
                print("📑 Data transaksi berhasil")
                response.success()

            else:
                print("❌ Gagal mengambil transaksi")
                response.failure(response.text)

            
# OWNER
class OwnerUser(HttpUser):

    host = "http://127.0.0.1:8000"
    wait_time = between(3,5)
    weight = 2

    def on_start(self):

        print("\n===== OWNER LOGIN =====")

        response = self.client.post(
            "/api/login",
            json={
                "email":"owner@gmail.com",
                "password":"owner123"
            },
            name="11. Owner - Login"
        )

        if response.status_code == 200:
            print("✅ Owner login berhasil")
        else:
            print("❌ Owner login gagal")

    @task(4)
    def dashboard(self):

        with self.client.get(
            "/api/dashboard",
            catch_response=True,
            name="12. Owner - Dashboard"
        ) as response:

            if response.status_code == 200:
                print("📊 Dashboard berhasil dimuat")
                response.success()
            else:
                print("❌ Dashboard gagal")
                response.failure(response.text)

    @task(3)
    def sales_chart(self):

        with self.client.get(
            "/api/sales-chart",
            catch_response=True,
            name="13. Owner - Sales Chart"
        ) as response:

            if response.status_code == 200:
                print("📈 Sales Chart berhasil")
                response.success()
            else:
                print("❌ Sales Chart gagal")
                response.failure(response.text)
        
    @task(3)
    def summary_report(self):

        with self.client.get(
            "/api/reports/summary",
            catch_response=True,
            name="14. Owner - Summary Report"
        ) as response:

            if response.status_code == 200:
                print("📄 Summary Report berhasil")
                response.success()
            else:
                print("❌ Summary Report gagal")
                response.failure(response.text)

    @task(2)
    def orders_report(self):

        with self.client.get(
            "/api/reports/orders",
            catch_response=True,
            name="15. Owner - Orders Report"
        ) as response:

            if response.status_code == 200:
                print("📝 Orders Report berhasil")
                response.success()
            else:
                print("❌ Orders Report gagal")
                response.failure(response.text)

    @task(2)
    def inventory(self):

        with self.client.get(
            "/api/inventory",
            catch_response=True,
            name="16. Owner - Inventory"
        ) as response:

            if response.status_code == 200:
                print("📦 Inventory berhasil")
                response.success()
            else:
                print("❌ Inventory gagal")
                response.failure(response.text)

    @task(2)
    def production(self):

        with self.client.get(
            "/api/productions",
            catch_response=True,
            name="17. Owner - Production"
        ) as response:

            if response.status_code == 200:
                print("🏭 Data Produksi berhasil")
                response.success()
            else:
                print("❌ Produksi gagal")
                response.failure(response.text)
            
    @task(2)
    def recipes(self):

        with self.client.get(
            "/api/recipes",
            catch_response=True,
            name="18. Owner - Recipes"
        ) as response:

            if response.status_code == 200:
                print("📖 Data resep berhasil")
                response.success()
            else:
                print("❌ Gagal mengambil data resep")
                response.failure(response.text)

    @task(2)
    def users(self):

        with self.client.get(
            "/api/users",
            catch_response=True,
            name="19. Owner - employees"
        ) as response:

            if response.status_code == 200:
                print("👥 Data karyawan berhasil dimuat")
                response.success()
            else:
                print("❌ Gagal mengambil data karyawan")
                response.failure(response.text)

                
                            